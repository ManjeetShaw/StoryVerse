const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

module.exports = {
  // Core server
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  databaseUrl: process.env.DATABASE_URL,
  frontendOrigin: process.env.FRONTEND_ORIGIN || '*',

  // Story text generation (xAI Grok / Gemini)
  grokApiKey: process.env.GROK_API_KEY || process.env.XAI_API_KEY,
  grokModel: process.env.GROK_MODEL || 'grok-2-latest',
  geminiApiKey: process.env.GEMINI_API_KEY,
  textModel: process.env.TEXT_MODEL || 'gemini-3.5-flash',

  // Image generation (Cloudflare Workers AI - FLUX.1 schnell)
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
  imageConcurrency: Number(process.env.IMAGE_CONCURRENCY || 3),
  defaultPageCount: Number(process.env.DEFAULT_PAGE_COUNT || 8),

  // Voice narration (ElevenLabs TTS) — Jessica sounds like a real person, not a robot
  elevenlabsApiKey: process.env.ELEVENLABS_API_KEY,
  elevenlabsVoiceId: process.env.ELEVENLABS_VOICE_ID || 'cgSgspJ2msm6clMCkdW9', // Jessica
  elevenlabsModel: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
};
