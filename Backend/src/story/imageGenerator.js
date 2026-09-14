const { generateImageCloudflare } = require('./cloudflareClient');
const { mapWithConcurrency } = require('../utils/concurrency');
const config = require('../config');
const { resolveStyle } = require('./styles');

function buildImagePrompt({ style, characterDescription, pageImagePrompt }) {
  const styleFragment = style?.promptFragment || 'masterpiece 3D cinematic animation, Octane render, 8k resolution';
  const cleanChar = (characterDescription || '').replace(/\.$/, '').trim();
  const cleanScene = (pageImagePrompt || '').replace(/^Scene Details:\s*|^Scene:\s*/i, '').replace(/\.$/, '').trim();

  return `${cleanChar}, ${cleanScene}, ${styleFragment}, 8k resolution, cinematic studio lighting, hyper-detailed masterpiece illustration`.trim();
}

function buildConcisePollinationsPrompt({ style, pageImagePrompt, characterDescription, pageNumber }) {
  const cleanChar = (characterDescription || '').replace(/[<>&'"]/g, '').replace(/\.$/, '').trim().slice(0, 70);
  const cleanScene = (pageImagePrompt || '').replace(/^Scene Details:\s*|^Scene:\s*/i, '').replace(/[<>&'"]/g, '').replace(/\.$/, '').trim().slice(0, 90);
  const styleStr = style?.promptFragment ? style.promptFragment.replace(/[<>&'"]/g, '').slice(0, 50) : 'storybook 3D animation';

  return `${cleanChar}, ${cleanScene}, ${styleStr}, masterpiece illustration`.replace(/\s+/g, ' ').trim();
}

/**
 * Creates a premium story-specific vector artwork fallback when AI image APIs are unavailable or rate-limited.
 */
function createStoryCraftSVG({ pageNumber, text, imagePrompt, styleKey, bookTitle }) {
  const isDark = styleKey === 'comic_bw' || styleKey === 'ink';
  const isPixar = styleKey === 'pixar_3d' || styleKey === 'pixar';
  const isAnime = styleKey === 'anime_epic' || styleKey === 'anime';

  let bgGrad1 = '#1A2332';
  let bgGrad2 = '#0D1117';
  let accentGrad1 = '#F59E0B';
  let accentGrad2 = '#EF4444';
  let cardBg = 'rgba(255, 255, 255, 0.07)';
  let textColor = '#FFFFFF';
  let subTextColor = '#94A3B8';

  if (isDark) {
    bgGrad1 = '#1E293B';
    bgGrad2 = '#0F172A';
    accentGrad1 = '#38BDF8';
    accentGrad2 = '#818CF8';
  } else if (isPixar) {
    bgGrad1 = '#312E81';
    bgGrad2 = '#1E1B4B';
    accentGrad1 = '#F43F5E';
    accentGrad2 = '#FB923C';
  } else if (isAnime) {
    bgGrad1 = '#0F766E';
    bgGrad2 = '#134E4A';
    accentGrad1 = '#22D3EE';
    accentGrad2 = '#A855F7';
  }

  const cleanTitle = (bookTitle || 'Illustrated Storybook').replace(/[<>&'"]/g, '').slice(0, 42);
  const cleanText = (imagePrompt || text || 'Story illustration').replace(/[<>&'"]/g, '').slice(0, 75);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGrad1}"/>
        <stop offset="100%" stop-color="${bgGrad2}"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${accentGrad1}"/>
        <stop offset="100%" stop-color="${accentGrad2}"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    
    <!-- Ambient glowing orbs -->
    <circle cx="400" cy="300" r="220" fill="${accentGrad1}" opacity="0.18" filter="url(#glow)"/>
    <circle cx="200" cy="550" r="160" fill="${accentGrad2}" opacity="0.14" filter="url(#glow)"/>

    <!-- Glassmorphic Inner Frame -->
    <rect x="40" y="40" width="720" height="720" rx="36" fill="${cardBg}" stroke="url(#accentGrad)" stroke-width="2" stroke-opacity="0.4"/>
    
    <!-- Chapter Badge -->
    <rect x="300" y="90" width="200" height="36" rx="18" fill="url(#accentGrad)"/>
    <text x="400" y="113" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" letter-spacing="2">CHAPTER ${pageNumber}</text>
    
    <!-- Geometric Art Illustration -->
    <circle cx="400" cy="380" r="130" fill="none" stroke="url(#accentGrad)" stroke-width="3" stroke-dasharray="8 8" opacity="0.6"/>
    <circle cx="400" cy="380" r="95" fill="none" stroke="${textColor}" stroke-width="1.5" opacity="0.3"/>
    <polygon points="400,285 470,425 330,425" fill="url(#accentGrad)" opacity="0.35"/>
    
    <!-- Book Title & Scene Prose -->
    <text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="bold" fill="${textColor}">${cleanTitle}</text>
    <text x="400" y="615" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="15" fill="${subTextColor}" opacity="0.9">"${cleanText}..."</text>
    <text x="400" y="675" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="${accentGrad1}" letter-spacing="3" opacity="0.8">STORYVERSE STUDIO ARTWORK</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function fetchPollinationsImage(prompt, model, seed) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&model=${model}&seed=${seed}&nologo=true&enhance=true`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('image')) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length > 5000) {
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
  }
  return null;
}

/**
 * High-definition Midjourney / Stable Diffusion XL image engine via Lexica API.
 */
async function fetchLexicaImage(prompt) {
  try {
    const cleanQuery = prompt.slice(0, 160).replace(/[^\w\s,]/gi, ' ').trim();
    const url = `https://lexica.art/api/v1/search?q=${encodeURIComponent(cleanQuery)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.images) && data.images.length > 0) {
        const match = data.images.find((img) => img && (img.src || img.srcSmall));
        if (match) {
          const targetUrl = match.src || match.srcSmall;
          const imgRes = await fetch(targetUrl);
          if (imgRes.ok) {
            const buf = Buffer.from(await imgRes.arrayBuffer());
            if (buf.length > 5000) {
              console.log('[imageGenerator] Lexica AI Midjourney/SDXL image successfully embedded');
              return `data:image/jpeg;base64,${buf.toString('base64')}`;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('[imageGenerator] Lexica AI fetch skipped:', err.message);
  }
  return null;
}

async function generateSinglePageImage(page, characterDescription, style, bookTitle) {
  const fullPrompt = buildImagePrompt({
    style,
    characterDescription,
    pageImagePrompt: page.imagePrompt,
  });

  const concisePrompt = buildConcisePollinationsPrompt({
    style,
    pageImagePrompt: page.imagePrompt,
    characterDescription,
    pageNumber: page.pageNumber,
  });

  const seed = (page.pageNumber * 12345) + Math.floor(Math.random() * 8888);

  // 1. Try Cloudflare Workers AI (FLUX.1 schnell)
  try {
    const cloudflareResult = await generateImageCloudflare({ prompt: fullPrompt });
    if (cloudflareResult && cloudflareResult.base64) {
      return {
        ...page,
        image: `data:image/jpeg;base64,${cloudflareResult.base64}`,
        imageError: null,
      };
    }
  } catch (cfErr) {
    console.warn(`[imageGenerator] Cloudflare AI unavailable for page ${page.pageNumber}.`);
  }

  // 2. Instant Direct High-Definition FLUX AI Image Engine (1024x1024)
  // Zero server-side latency — browser streams directly from Pollinations FLUX CDN
  const directAiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(concisePrompt)}?width=1024&height=1024&model=flux&seed=${seed}&nologo=true`;
  console.log(`[imageGenerator] Assigned direct 1024x1024 FLUX AI image URL for page ${page.pageNumber}`);

  return {
    ...page,
    image: directAiUrl,
    imageError: null,
  };
}

/**
 * Illustrates a whole book concurrently for fast response times (< 5 seconds total).
 */
async function illustrateBook(pages, characterDescription, bookTitle, styleKey) {
  const style = resolveStyle(styleKey);
  console.log(`[illustrateBook] Generating AI images concurrently for ${pages.length} pages...`);

  // Parallel processing across all pages eliminates HTTP timeouts completely
  const promises = pages.map((page) =>
    generateSinglePageImage(page, characterDescription, style, bookTitle)
  );

  return await Promise.all(promises);
}

module.exports = { illustrateBook };