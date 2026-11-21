import React from 'react';

export function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-stone-100 text-stone-700 border-stone-300',
    blue: 'bg-blue-50 text-posis-blue border-posis-blue',
    gold: 'bg-amber-50 text-amber-900 border-posis-gold',
    lost: 'bg-red-50 text-posis-lost border-posis-lost',
    found: 'bg-emerald-50 text-posis-found border-posis-found',
    process: 'bg-amber-50 text-posis-process border-posis-process',
    done: 'bg-stone-100 text-posis-done border-stone-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-xs font-mono font-medium tracking-wider uppercase rounded-[2px] ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
}
