import React from 'react';

/**
 * Reusable Floating Clouds background motif
 * Matches the existing sky-blue palette and floating clouds established on the homepage.
 */
export default function FloatingClouds({ variant = 'default' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Halftone Texture Overlay */}
      <div className="absolute inset-0 halftone-dots"></div>

      {variant === 'subtle' ? (
        <>
          {/* Subtle clouds for centered auth cards and focused views */}
          <div className="absolute -top-16 -left-16 w-[420px] h-[320px] rounded-full bg-white/50 blur-3xl"></div>
          <div className="absolute top-1/4 -right-16 w-[460px] h-[360px] rounded-full bg-white/45 blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-[450px] h-[280px] rounded-full bg-[#E5F1FC]/60 blur-2xl"></div>
        </>
      ) : (
        <>
          {/* Full rich clouds for hero and dashboard pages */}
          <div className="absolute -top-10 -left-20 w-[480px] h-[360px] rounded-full bg-white/55 blur-3xl"></div>
          <div className="absolute top-20 right-[-100px] w-[620px] h-[580px] rounded-full bg-white/50 blur-3xl"></div>
          <div className="absolute top-72 left-1/4 w-[750px] h-[400px] rounded-full bg-white/40 blur-2xl"></div>
          <div className="absolute bottom-40 right-1/4 w-[500px] h-[300px] rounded-full bg-[#E5F1FC]/60 blur-2xl"></div>

          {/* Subtle architectural orbit / draft curve */}
          <svg
            className="absolute top-4 left-6 w-[1250px] h-[850px] opacity-20 stroke-[#13436B]"
            fill="none"
            strokeWidth="1.2"
            viewBox="0 0 1250 850"
          >
            <path d="M 50 350 C 300 50, 700 650, 1150 250" strokeDasharray="6,6" />
            <circle cx="750" cy="380" r="180" />
            <circle cx="750" cy="380" r="4" fill="#13436B" />
          </svg>
        </>
      )}
    </div>
  );
}
