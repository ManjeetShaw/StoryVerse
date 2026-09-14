/**
 * Turns story page text into spoken narration with natural breaths.
 * ElevenLabs follows punctuation; extra ellipses make it feel read-aloud, not robotic.
 */
function toSpokenNarration(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,;:!?])/g, '$1')
    .replace(/([.!?])\s+(?=[A-Z“"‘])/g, '$1 ... ')
    .replace(/([,;])\s+/g, '$1 ')
    .trim();
}

// Modern ElevenLabs voices that sound like a person, not a TTS engine.
const STUDIO_VOICES = {
  jessica: { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica' }, // default — conversational US female
  chris: { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris' }, // natural US male
  george: { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George' }, // warm British narrator
  lily: { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily' }, // soft British
  matilda: { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda' }, // gentle storyteller
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
};

const DEFAULT_VOICE_ID = STUDIO_VOICES.jessica.id;

const NARRATION_VOICE_SETTINGS = {
  stability: 0.32,
  similarity_boost: 0.72,
  style: 0.55,
  use_speaker_boost: true,
};

module.exports = {
  toSpokenNarration,
  STUDIO_VOICES,
  DEFAULT_VOICE_ID,
  NARRATION_VOICE_SETTINGS,
};
