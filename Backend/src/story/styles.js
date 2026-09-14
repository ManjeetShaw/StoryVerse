/**
 * Hardcoded art style presets, ported as-is from Junaid's story service.
 * We stopped letting the LLM invent a style description per book - it was
 * too inconsistent and too soft/generic ("warm watercolor" every time).
 * These fragments are written specifically to push FLUX.1 schnell toward
 * a bold, dynamic comic look instead.
 *
 * Never reference real copyrighted characters/franchises here or in any
 * generated prompt - keep it to style/technique descriptors only.
 */
const STYLE_PRESETS = {
  pixar_3d: {
    label: '3D Cinematic Animation',
    promptFragment:
      'masterpiece 3D animation render, Pixar and Disney animated film studio aesthetic, Octane Render, 8k resolution, subsurface scattering skin, cinematic studio lighting, vibrant atmospheric depth, ultra-detailed textures, volumetric light rays, rich color grading, beautiful soft bokeh background',
  },
  anime_epic: {
    label: 'Cinematic Fantasy Anime',
    promptFragment:
      'masterpiece epic anime illustration, Makoto Shinkai and Studio Ghibli quality, high definition 8k render, crisp detailed linework, breathtaking dramatic sky, glowing lighting effects, cinematic camera angle, rich ambient occlusion, vivid color palette',
  },
  comic_color: {
    label: 'Color Graphic Novel',
    promptFragment:
      'professional graphic novel illustration, Marvel DC style comic art, bold crisp black ink outlines, dynamic action framing, cinematic dramatic lighting with intense rim light, vibrant rich colors, detailed halftones and crosshatching shading, masterpiece 8k digital illustration',
  },
  comic_bw: {
    label: 'Noir Pen & Ink',
    promptFragment:
      'masterpiece black and white graphic novel ink drawing, high contrast film noir lighting, intricate stippling and heavy crosshatching, dramatic shadows, bold expressive linework, classic comic book pen and ink illustration, 8k depth',
  },
  storybook: {
    label: 'Masterpiece Watercolor',
    promptFragment:
      'award-winning children\'s book watercolor and gouache illustration, soft dreamy lighting, whimsical textured paper grain, rich painterly brushstrokes, magical golden hour illumination, detailed fairytale environment art, heartwarming character feel',
  },
};

const DEFAULT_STYLE = 'storybook';

function resolveStyle(styleKey) {
  const aliasMap = {
    comic: 'comic_color',
    ink: 'comic_bw',
    watercolor: 'storybook',
    pixar: 'pixar_3d',
    anime: 'anime_epic',
  };
  const key = aliasMap[styleKey] || styleKey;
  return STYLE_PRESETS[key] || STYLE_PRESETS[DEFAULT_STYLE];
}

module.exports = { STYLE_PRESETS, DEFAULT_STYLE, resolveStyle };
