import React, { useEffect, useState } from 'react';
import { getStyles } from '../services/api';
import { Palette, Check, Sparkles } from 'lucide-react';

export default function StylePicker({ selectedStyle, onSelectStyle }) {
  const [stylesList, setStylesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStyles() {
      try {
        const data = await getStyles();
        if (isMounted) {
          const list = data.styles || [];
          setStylesList(list);

          // If no style currently selected, default-select the key matching the "default" field
          if (!selectedStyle && data.default) {
            onSelectStyle(data.default);
          } else if (!selectedStyle && list.length > 0) {
            onSelectStyle(list[0].key);
          }
        }
      } catch (err) {
        if (isMounted) {
          // Fallback if needed
          const fallback = [
            { key: 'comic', label: 'Color Comic' },
            { key: 'ink', label: 'Black & White Ink' },
            { key: 'watercolor', label: 'Storybook Watercolor' }
          ];
          setStylesList(fallback);
          if (!selectedStyle) onSelectStyle('watercolor');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStyles();
    return () => {
      isMounted = false;
    };
  }, []);

  // Visual accents & thumbnail previews for styles
  const stylePreviews = {
    pixar_3d: {
      desc: '3D studio animation aesthetic, volumetric cinematic lighting, Octane render depth',
      color: 'from-amber-200 to-indigo-200',
      badge: 'Popular',
    },
    anime_epic: {
      desc: 'Makoto Shinkai quality, breathtaking glowing atmospheres, vivid detail',
      color: 'from-cyan-100 to-purple-200',
      badge: 'Epic',
    },
    comic_color: {
      desc: 'Bold ink lines, Marvel/DC graphic novel dynamic framing, saturated halftones',
      color: 'from-amber-200 to-rose-200',
    },
    comic_bw: {
      desc: 'Noir pen-and-ink engraving, intricate stippling, monochrome atmospheric depth',
      color: 'from-stone-800 to-stone-950 text-white',
    },
    storybook: {
      desc: 'Soft gouache washes, whimsical paper grain, golden storybook warmth',
      color: 'from-sky-100 to-amber-100',
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          Art style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-20 rounded-2xl bg-white/60 border border-stone-200/60 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          Art style
        </label>
        <span className="text-xs text-stone-400">Consistent character art across every page</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {stylesList.map((styleItem) => {
          const isSelected = selectedStyle === styleItem.key;
          const preview = stylePreviews[styleItem.key] || {
            desc: 'Illustrated book aesthetic',
            color: 'from-stone-100 to-stone-200',
          };

          return (
            <button
              key={styleItem.key}
              type="button"
              onClick={() => onSelectStyle(styleItem.key)}
              className={`text-left p-4 rounded-2xl transition-all duration-200 cursor-pointer relative border-2 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-stone-900 shadow-[0_8px_20px_rgba(20,40,70,0.12)] -translate-y-0.5'
                  : 'bg-white/80 hover:bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-craft-serif text-base sm:text-lg font-normal text-stone-900 leading-snug">
                      {styleItem.label}
                    </span>
                    {preview.badge && (
                      <span className="text-[10px] bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {preview.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-stone-900 text-white' : 'border border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[12px] text-stone-500 leading-relaxed">
                  {preview.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
