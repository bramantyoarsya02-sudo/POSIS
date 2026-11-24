'use client';

import React from 'react';

export function SkeletonCard({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border-2 border-stone-200 rounded-[2px] p-5 space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="w-28 h-3.5 bg-stone-200 rounded-[1px]" />
            <div className="w-16 h-4 bg-stone-200 rounded-[1px]" />
          </div>
          <div className="space-y-2">
            <div className="w-4/5 h-6 bg-stone-200 rounded-[1px]" />
            <div className="w-1/2 h-3.5 bg-stone-100 rounded-[1px]" />
          </div>
          <div className="space-y-1.5 pt-2">
            <div className="w-full h-3 bg-stone-100 rounded-[1px]" />
            <div className="w-3/4 h-3 bg-stone-100 rounded-[1px]" />
          </div>
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="w-20 h-7 bg-stone-200 rounded-[2px]" />
            <div className="w-16 h-7 bg-stone-100 rounded-[2px]" />
          </div>
        </div>
      ))}
    </>
  );
}
