const config = require('../config');

/**
 * Cloudflare Workers AI - FLUX.1 [schnell] image generation.
 * Free tier: 10,000 Neurons/day per account, no credit card required.
 * Ported as-is from Junaid's story service.
 */
function endpointUrl() {
  return `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;
}

let isQuotaExhausted = false;

async function callCloudflare(body, { retries = 2 } = {}) {
  if (isQuotaExhausted) {
    throw new Error('Cloudflare Workers AI daily free allocation exhausted. Skipping to secondary AI image generator.');
  }

  if (!config.cloudflareAccountId || !config.cloudflareApiToken) {
    throw new Error(
      'CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN are not set. See README for setup steps and add them to .env'
    );
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(endpointUrl(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success && data.result?.image) {
        console.log('[Cloudflare AI] Image successfully generated!');
        return data.result.image;
      }

      const errText = JSON.stringify(data.errors || data);
      if (errText.includes('4006') || errText.includes('daily free allocation')) {
        isQuotaExhausted = true;
        console.warn('[Cloudflare AI] Daily free neuron allocation exhausted (4006). Switching to FLUX AI image engine.');
        throw new Error(`Cloudflare AI Quota Exhausted: ${errText}`);
      }

      const isRetryable = res.status === 429 || res.status >= 500;
      if (isRetryable && attempt < retries) {
        const waitMs = 1000 * Math.pow(1.5, attempt);
        console.warn(`[Cloudflare AI] Status ${res.status}, retrying in ${Math.round(waitMs)}ms (attempt ${attempt + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      throw new Error(`Cloudflare Workers AI error (${res.status}): ${errText}`);
    } catch (err) {
      if (isQuotaExhausted) throw err;
      if (attempt < retries && (err.message.includes('fetch failed') || err.message.includes('500'))) {
        const waitMs = 1000 * Math.pow(1.5, attempt);
        console.warn(`[Cloudflare AI] Fetch error, retrying in ${Math.round(waitMs)}ms...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw err;
    }
  }
}

/**
 * Generates one image. `steps` defaults to 6 - schnell is a distilled
 * few-step model, going much past ~8 burns Neurons without improving quality.
 */
async function generateImageCloudflare({ prompt, steps = 6 }) {
  const base64 = await callCloudflare({
    prompt: prompt.slice(0, 2048), // model has a hard prompt length cap
    steps,
  });

  return { base64, mimeType: 'image/jpeg' };
}

module.exports = { generateImageCloudflare };
