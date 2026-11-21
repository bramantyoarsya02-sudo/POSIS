import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { MegaphoneWaves } from './MegaphoneWaves';

export function CharacterAspiration({ size = 'default', showFrame = true, className = '' }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const isSmall = size === 'small';
  const [isMegaphoneActive, setIsMegaphoneActive] = useState(true);

  // Siklus loop megaphone: aktif 4.5 detik, istirahat 1.5 detik
  useEffect(() => {
    if (shouldReduceMotion || !isInView) return;
    const interval = setInterval(() => {
      setIsMegaphoneActive((prev) => !prev);
    }, 4500);
    return () => clearInterval(interval);
  }, [isInView, shouldReduceMotion]);

  const idleCharacter = shouldReduceMotion
    ? {}
    : {
        rotate: [0, 2.5, 0, -1, 0],
        x: [0, 4, 0, -2, 0],
      };

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      {showFrame && (
        <>
          {/* Offset Blue Block di Belakang (12-16px) */}
          <div
            className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-full h-full bg-posis-gold/20 border border-posis-gold rounded-[2px]"
            aria-hidden="true"
          />
          {/* Editorial Frame Panel */}
          <div
            className="absolute inset-0 bg-white border-2 border-posis-blue rounded-[2px] z-0 overflow-hidden"
            aria-hidden="true"
          >
            {/* Header label majalah / cetak */}
            <div className="absolute top-2 left-3 flex items-center justify-between w-[calc(100%-24px)] text-posis-blue font-mono text-[11px] font-semibold tracking-widest uppercase border-b border-posis-blue/20 pb-1">
              <span>FIG. 02 — KOTAK SARAN &amp; ASPIRASI</span>
              <span className="bg-posis-gold text-posis-ink font-bold px-1.5 py-0.2 rounded-[1px]">02</span>
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

      {/* Kontainer Karakter & Toa */}
      <div className={`relative z-10 flex items-center justify-center ${isSmall ? 'w-48 h-48' : 'w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96'}`}>
        {/* Karakter Siswa Berseru */}
        <motion.div
          animate={isInView ? idleCharacter : {}}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/assets/karakter-aspirasi.png"
            alt="Ilustrasi siswa SMKN 1 Ciomas bertopi abu-abu berseru menyampaikan aspirasi demi sekolah lebih baik"
            width={isSmall ? 200 : 420}
            height={isSmall ? 200 : 420}
            loading={isSmall ? "lazy" : "eager"}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(242,183,5,0.2)] translate-y-2 select-none"
          />
        </motion.div>

        {/* Toa Megafon Biru Animasi (diposisikan di sisi tangan/mulut kiri tanpa menutupi balon teks gambar) */}
        {!shouldReduceMotion ? (
          <motion.div
            className={`absolute ${isSmall ? '-left-2 top-8 w-16 h-16' : '-left-4 sm:-left-6 top-12 sm:top-16 w-24 h-24 sm:w-28 sm:h-28'} pointer-events-none z-20`}
            initial={{ scale: 0.6, opacity: 0, x: -20 }}
            animate={
              isInView && isMegaphoneActive
                ? {
                    scale: [0.6, 1, 1, 1],
                    opacity: [0, 1, 1, 1],
                    x: [-20, 0, 1, -1, 1, 0],
                    rotate: [0, -5, 4, -4, 2, 0]
                  }
                : { scale: 0.7, opacity: 0 }
            }
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
            aria-hidden="true"
          >
            <div className="relative w-full h-full">
              <img
                src="/assets/toa.png"
                alt=""
                width="112"
                height="112"
                loading="lazy"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(31,63,148,0.3)] rotate-[-12deg]"
              />
              {/* Gelombang Bunyi Toa */}
              <MegaphoneWaves
                isActive={isInView && isMegaphoneActive}
                className="top-1 left-16 sm:left-20"
              />
            </div>
          </motion.div>
        ) : (
          <div
            className="absolute -left-2 top-10 w-20 h-20 pointer-events-none opacity-80"
            aria-hidden="true"
          >
            <img src="/assets/toa.png" alt="" className="w-full h-full object-contain" />
          </div>
        )}
      </div>
    </div>
  );
}
