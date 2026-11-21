import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { FloatingQuestionMarks } from './FloatingQuestionMarks';

export function CharacterSearching({ size = 'default', showFrame = true, className = '' }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const isSmall = size === 'small';

  const idleAnimation = shouldReduceMotion
    ? {}
    : {
        y: [0, -6, 0, 4, 0],
        rotate: [0, 1.2, 0, -1.2, 0],
      };

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      {showFrame && (
        <>
          {/* Offset Blue Block di Belakang (12-16px) */}
          <div
            className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-full h-full bg-posis-blue/15 border border-posis-blue rounded-[2px]"
            aria-hidden="true"
          />
          {/* Editorial Frame Panel */}
          <div
            className="absolute inset-0 bg-white border-2 border-posis-blue rounded-[2px] z-0 overflow-hidden"
            aria-hidden="true"
          >
            {/* Header label majalah / cetak */}
            <div className="absolute top-2 left-3 flex items-center justify-between w-[calc(100%-24px)] text-posis-blue font-mono text-[11px] font-semibold tracking-widest uppercase border-b border-posis-blue/20 pb-1">
              <span>FIG. 01 — LOST &amp; FOUND</span>
              <span className="bg-posis-blue text-white px-1.5 py-0.2 rounded-[1px]">01</span>
            </div>
            {/* Grid watermark background halus */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#1F3F94 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />
          </div>
        </>
      )}

      {/* Kontainer Karakter & Tanda Tanya */}
      <div className={`relative z-10 flex items-center justify-center ${isSmall ? 'w-48 h-48' : 'w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96'}`}>
        {/* Karakter Siswa Mencari Barang */}
        <motion.div
          animate={isInView ? idleAnimation : {}}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/assets/karakter-mencari.png"
            alt="Ilustrasi siswa SMKN 1 Ciomas bertopi abu-abu memegang kaca pembesar mencari barang hilang"
            width={isSmall ? 200 : 420}
            height={isSmall ? 200 : 420}
            loading={isSmall ? "lazy" : "eager"}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(31,63,148,0.15)] translate-y-2 select-none"
          />
        </motion.div>

        {/* Floating Question Marks */}
        <FloatingQuestionMarks
          isInView={isInView}
          count={isSmall ? 2 : 3}
        />
      </div>
    </div>
  );
}
