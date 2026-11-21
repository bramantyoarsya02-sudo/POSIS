import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function MegaphoneWaves({ isActive = true, className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  // 3 Busur gelombang suara memancar dari kanan mulut toa
  const waves = [
    { id: 1, radius: 24, strokeWidth: 3, delay: 0 },
    { id: 2, radius: 44, strokeWidth: 2.5, delay: 0.35 },
    { id: 3, radius: 64, strokeWidth: 2, delay: 0.7 }
  ];

  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {waves.map((w) => (
          <motion.path
            key={w.id}
            d={`M 10 ${55 - w.radius} A ${w.radius} ${w.radius} 0 0 1 10 ${55 + w.radius}`}
            stroke="#F2B705"
            strokeWidth={w.strokeWidth}
            strokeLinecap="round"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isActive
                ? {
                    opacity: [0, 1, 0.8, 0],
                    scale: [0.8, 1, 1.25, 1.45],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: w.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
}
