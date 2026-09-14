const config = require('../config');

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Text generation only. Low-level POST to Gemini's generateContent
 * endpoint, with retries and backoff on transient failures (429/503).
 * Ported as-is from Junaid's story service.
 */
async function callGeminiWithFallback(body, { retries = 4 } = {}) {
  if (!config.geminiApiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey and add it to .env'
    );
  }

  // Active supported Gemini models
  const candidateModels = [
    config.textModel || 'gemini-3.5-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
  ];

  let lastError;

  for (const model of candidateModels) {
    const url = `${BASE_URL}/${model}:generateContent?key=${config.geminiApiKey}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`[Gemini] Requesting model: ${model} (attempt ${attempt + 1}/${retries + 1})`);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errText = await res.text();
          // If it's a quota / resource exhausted error, fail fast without 30s delay
          if (res.status === 429 && (errText.includes('RESOURCE_EXHAUSTED') || errText.includes('Quota exceeded') || errText.includes('quota'))) {
            throw new Error(`Gemini API Quota Exceeded (429 ${model}): ${errText}`);
          }
          // Rate limit or high demand - retry with backoff
          if ((res.status === 429 || res.status === 503 || res.status === 500) && attempt < retries) {
            const waitMs = 1500 * Math.pow(2, attempt);
            console.warn(`  Gemini ${res.status} on ${model}, retrying in ${waitMs}ms...`);
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          throw new Error(`Gemini API error (${res.status} ${model}): ${errText}`);
        }

        const data = await res.json();
        const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOut) {
          console.log(`[Gemini] Success using model: ${model}`);
          return textOut;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini] Model ${model} failed: ${err.message}`);
        // If it's a 404, 400, or 429 quota exhausted error, break inner loop immediately
        if (err.message.includes('404') || err.message.includes('400') || err.message.includes('Quota Exceeded') || err.message.includes('RESOURCE_EXHAUSTED')) {
          break;
        }
      }
    }
  }

  throw lastError || new Error('All Gemini API model fallbacks failed due to high demand. Please try again in a few moments.');
}

/**
 * Text generation. Pass a JSON schema to force structured output -
 * this is what lets us get the whole story back as clean JSON in one call.
 */
async function generateText({ prompt, responseSchema }) {
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.65,
      ...(responseSchema && {
        responseMimeType: 'application/json',
        responseSchema,
      }),
    },
  };

  return await callGeminiWithFallback(body);
}

module.exports = { generateText };
