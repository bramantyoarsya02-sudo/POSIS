'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function HeroMotifSVG({ className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className="w-full h-full opacity-[0.14]"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Garis Grid Blueprint Sekolah */}
        <pattern id="editorial-blueprint" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1F3F94" strokeWidth="0.5" strokeOpacity="0.4" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#editorial-blueprint)" />

        {/* Motif Garis Gedung Sekolah SMKN 1 Ciomas */}
        <g stroke="#1F3F94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Garis Dasar Gedung */}
          <motion.path
            d="M 150 720 L 1050 720"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
          {/* Siluet Gedung Utama */}
          <motion.path
            d="M 220 720 L 220 480 L 380 480 L 380 720 M 380 420 L 580 340 L 780 420 L 780 720 M 780 500 L 980 500 L 980 720"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, ease: "easeInOut", delay: 0.2 }}
          />
          {/* Jendela & Pilar Sekolah */}
          <motion.path
            d="M 260 520 H 340 M 260 580 H 340 M 260 640 H 340 M 820 540 H 940 M 820 600 H 940 M 820 660 H 940"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.0, ease: "easeInOut", delay: 0.5 }}
          />
          {/* Tiang Bendera / Menara Utama */}
          <motion.path
            d="M 580 340 L 580 250 M 580 250 L 630 270 L 580 290"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
          />
        </g>

        {/* Roda Gigi Vokasi/SMK (Berputar 1 putaran per 60 detik) */}
        <motion.g
          stroke="#1F3F94"
          strokeWidth="1.5"
          fill="none"
          transform-origin="960 220"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="960" cy="220" r="54" strokeDasharray="3 3" />
          <circle cx="960" cy="220" r="32" />
          <circle cx="960" cy="220" r="14" fill="#1F3F94" fillOpacity="0.15" />
          {/* Gigi Roda */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="960"
              y1="160"
              x2="960"
              y2="170"
              transform={`rotate(${deg} 960 220)`}
              strokeWidth="3.5"
            />
          ))}
        </motion.g>

        {/* Tangkai Daun Padi Kemakmuran (Simbol Logo Sekolah) */}
        <g stroke="#F2B705" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6">
          <motion.path
            d="M 120 400 Q 180 340 240 380 Q 280 420 320 360"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.6 }}
          />
          {/* Butir Padi */}
          <ellipse cx="160" cy="360" rx="12" ry="6" transform="rotate(-30 160 360)" fill="#F2B705" fillOpacity="0.15" />
          <ellipse cx="205" cy="350" rx="12" ry="6" transform="rotate(25 205 350)" fill="#F2B705" fillOpacity="0.15" />
          <ellipse cx="250" cy="385" rx="12" ry="6" transform="rotate(-15 250 385)" fill="#F2B705" fillOpacity="0.15" />
        </g>
      </svg>
    </div>
  );
}
