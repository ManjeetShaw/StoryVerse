import React, { useState, useEffect } from 'react';
import FloatingClouds from './FloatingClouds';
import { BookOpen, Sparkles, Feather, Palette } from 'lucide-react';

export default function GeneratingLoader({ prompt, pageCount = 8, style = 'watercolor' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const styleNames = {
    comic: 'Color Comic',
    ink: 'Black & White Ink',
    watercolor: 'Storybook Watercolor',
  };

  const statusLines = [
    'Dreaming up the opening chapter...',
    'Designing protagonist & world rules...',
    `Establishing ${styleNames[style] || 'storybook'} palette...`,
    `Sketching page 1 of ${pageCount}...`,
    `Painting scene composition for page 2...`,
    `Sketching page 3 of ${pageCount}...`,
    `Inking atmospheric lighting on page 4...`,
    `Rendering characters across page 5...`,
    `Composing lyrical story prose...`,
    `Sketching page ${Math.min(7, pageCount)} of ${pageCount}...`,
    'Harmonizing character consistency...',
    `Typesetting typography across ${pageCount} pages...`,
    'Binding hardcover pages and final touches...',
  ];

  useEffect(() => {
    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % statusLines.length);
    }, 4500);

    // Elapsed seconds timer
    const secondInterval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(secondInterval);
    };
  }, [statusLines.length]);

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Floating clouds touch */}
      <FloatingClouds variant="subtle" />

      {/* Center Generating Card */}
      <div className="relative z-20 max-w-lg w-full bg-white/90 backdrop-blur-md rounded-3xl border-2 border-white/95 shadow-[0_24px_54px_rgba(20,45,75,0.12)] p-8 sm:p-10 text-center">
        {/* Animated Magic Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-sky-200/50 animate-ping opacity-30"></div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-sky-100 via-sky-50 to-amber-50 border border-white flex items-center justify-center text-stone-800 shadow-md">
            <Sparkles className="w-8 h-8 text-sky-700 animate-pulse" />
          </div>
        </div>

        {/* Serif Headline */}
        <h2 className="font-craft-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight mb-2">
          Illustrating your story
        </h2>

        {/* Prompt Quote */}
        <p className="text-xs sm:text-sm text-stone-500 italic max-w-sm mx-auto mb-6 line-clamp-2 px-2">
          &ldquo;{prompt}&rdquo;
        </p>

        {/* Rotating Status Line (Never frozen) */}
        <div className="h-10 flex items-center justify-center mb-6">
          <div
            key={currentStepIndex}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-stone-100/90 rounded-full text-xs sm:text-sm font-medium text-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-300 border border-stone-200/60"
          >
            <Feather className="w-3.5 h-3.5 text-stone-500 animate-bounce" />
            <span>{statusLines[currentStepIndex]}</span>
          </div>
        </div>

        {/* Subtle breathing progress bar */}
        <div className="w-full bg-stone-100 rounded-full h-2 mb-4 overflow-hidden p-0.5 border border-stone-200/50">
          <div
            className="bg-[#0D1116] h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(95, Math.max(12, (secondsElapsed / 45) * 100))}%`,
            }}
          ></div>
        </div>

        {/* Progress note */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
          <span>{pageCount} fully illustrated pages</span>
          <span>Crafting character fidelity</span>
        </div>
      </div>
    </div>
  );
}
