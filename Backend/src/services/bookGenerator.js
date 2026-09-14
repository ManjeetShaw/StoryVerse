const { generateStory } = require('../story/storyGenerator');
const { illustrateBook } = require('../story/imageGenerator');
const { STYLE_PRESETS, DEFAULT_STYLE } = require('../story/styles');
const config = require('../config');

// Safety ceiling: native fetch (used inside the Gemini/Cloudflare clients)
// has NO default timeout, so a hung upstream call would otherwise hang this
// forever. This wraps the whole generation pipeline in a hard deadline.
const GENERATION_TIMEOUT_MS = 150_000; // 2.5 min

function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Generates a full illustrated book: story text (Gemini) + per-page
 * illustrations (Cloudflare Workers AI / FLUX.1 schnell), in-process.
 * Mirrors Junaid's original POST /api/generate-book route logic, just
 * called as a function instead of over HTTP.
 */
async function generateBook(prompt, pageCount, style, language = 'English') {
  const resolvedPageCount = Math.min(
    Math.max(Number(pageCount) || config.defaultPageCount, 4),
    12 // hard cap - keeps demo latency predictable
  );
  const resolvedStyle = STYLE_PRESETS[style] ? style : DEFAULT_STYLE;

  const run = async () => {
    console.log(`[generate-book] story: "${prompt}" (${resolvedPageCount} pages, style: ${resolvedStyle}, lang: ${language})`);
    const story = await generateStory(prompt, resolvedPageCount, language);

    console.log(`[generate-book] illustrating "${story.title}"...`);
    const illustratedPages = await illustrateBook(
      story.pages,
      story.characterDescription,
      story.title,
      resolvedStyle
    );

    return {
      title: story.title,
      characterDescription: story.characterDescription,
      style: resolvedStyle,
      language,
      pageCount: illustratedPages.length,
      pages: illustratedPages,
    };
  };

  return withTimeout(
    run(),
    GENERATION_TIMEOUT_MS,
    'Book generation timed out after 2.5 minutes'
  );
}

function getStyles() {
  return {
    styles: Object.entries(STYLE_PRESETS).map(([key, { label }]) => ({ key, label })),
    default: DEFAULT_STYLE,
  };
}

module.exports = { generateBook, getStyles };
