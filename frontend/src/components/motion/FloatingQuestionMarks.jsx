import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Tanda tanya melayang di sekitar karakter mencari
 * Titik koordinat disesuaikan agar tidak menutupi wajah
 */
export function FloatingQuestionMarks({ isInView = true, count = 3, className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  // Posisi relatif di sekitar karakter (persentase box)
  // Posisi 1: Kiri atas (dekat kaca pembesar)
  // Posisi 2: Kanan atas kepala (di atas bahu)
  // Posisi 3: Kiri bawah (di atas lantai pencarian)
  const spawnPoints = [
    { id: 1, top: '14%', left: '18%', size: 'w-10 h-10 md:w-14 md:h-14', delay: 0 },
    { id: 2, top: '8%', left: '68%', size: 'w-12 h-12 md:w-16 md:h-16', delay: 1.1 },
    { id: 3, top: '48%', left: '10%', size: 'w-8 h-8 md:w-11 md:h-11', delay: 2.2 }
  ];

  const activePoints = spawnPoints.slice(0, count);

  if (shouldReduceMotion) {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
        <img
          src="/assets/tanda-tanya.png"
          alt=""
          className="absolute top-[12%] right-[15%] w-12 h-12 opacity-80"
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      {activePoints.map((pt) => (
        <motion.div
          key={pt.id}
          className={`absolute ${pt.size}`}
          style={{ top: pt.top, left: pt.left }}
          initial={{ scale: 0, opacity: 0, y: 0, rotate: -6 }}
          animate={
            isInView
              ? {
                  scale: [0, 1.08, 1, 0.9, 0],
                  opacity: [0, 1, 0.95, 0.8, 0],
                  y: [0, -8, -18, -32, -45],
                  rotate: [-6, 6, -4, 4, 0]
                }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            duration: 3.2,
            repeat: Infinity,
            repeatDelay: 1.2,
            delay: pt.delay,
            ease: "easeInOut"
          }}
        >
          <img
            src="/assets/tanda-tanya.png"
            alt=""
            width="56"
            height="56"
            loading="lazy"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(220,38,38,0.25)]"
          />
        </motion.div>
      ))}
    </div>
  );
}
