/**
 * Quick test script - calls the book generator directly (no HTTP, no auth,
 * no DB) and saves the result as readable files instead of a wall of
 * base64 in your terminal. Useful for isolating Gemini/Cloudflare issues
 * from auth/DB issues.
 *
 * Usage:
 *   npm run test:generate -- "a city where gravity works sideways"
 *   npm run test:generate -- "a thriller about a stolen violin" 6
 *   npm run test:generate -- "a thriller about a stolen violin" 6 comic_bw
 *
 * Style options: comic_color (default), comic_bw, storybook
 */
const fs = require('fs');
const path = require('path');
const { generateBook } = require('../src/services/bookGenerator');

async function main() {
  const prompt = process.argv[2];
  const pageCount = Number(process.argv[3]) || 8;
  const style = process.argv[4] || 'comic_color';

  if (!prompt) {
    console.error('Usage: npm run test:generate -- "your idea" [pageCount] [style]');
    process.exit(1);
  }

  console.log(`Requesting book: "${prompt}" (${pageCount} pages, style: ${style})...`);
  const start = Date.now();

  const book = await generateBook(prompt, pageCount, style);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Done in ${elapsed}s: "${book.title}"`);

  const outDir = path.join(__dirname, '..', 'test-output', book.title.replace(/[^a-z0-9]+/gi, '_'));
  fs.mkdirSync(outDir, { recursive: true });

  let markdown = `# ${book.title}\n\n**Character:** ${book.characterDescription}\n\n**Style:** ${book.style}\n\n---\n\n`;

  book.pages.forEach((page) => {
    let imgTag = '_(image failed: ' + (page.imageError || 'unknown') + ')_';
    if (page.image) {
      const imgFile = `page-${page.pageNumber}.jpg`;
      fs.writeFileSync(path.join(outDir, imgFile), Buffer.from(page.image.base64, 'base64'));
      imgTag = `![page ${page.pageNumber}](./${imgFile})`;
    }
    markdown += `## Page ${page.pageNumber}\n\n${imgTag}\n\n${page.text}\n\n---\n\n`;
  });

  fs.writeFileSync(path.join(outDir, 'book.md'), markdown);
  console.log(`Saved to ${outDir}/book.md — open it in VS Code's Markdown preview to see the result.`);
}

main().catch((err) => {
  console.error('Test generation failed:', err.message);
  process.exit(1);
});
