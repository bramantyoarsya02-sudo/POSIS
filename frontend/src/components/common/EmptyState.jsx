import React from 'react';
import { Button } from './Button';

export function EmptyState({
  type = 'lost-found', // 'lost-found' | 'aspiration'
  title,
  message,
  actionText,
  onAction,
}) {
  return (
    <div className="py-12 px-6 text-center bg-white border-2 border-dashed border-stone-300 rounded-[2px] max-w-lg mx-auto my-6">
      {type === 'lost-found' ? (
        <div className="w-32 h-32 mx-auto relative mb-4">
          <img
            src="/assets/karakter-mencari.png"
            alt=""
            width="128"
            height="128"
            className="w-full h-full object-contain filter grayscale opacity-70"
          />
          <img
            src="/assets/tanda-tanya.png"
            alt=""
            width="32"
            height="32"
            className="w-8 h-8 absolute top-0 right-2 animate-bounce"
          />
        </div>
      ) : (
        <div className="w-28 h-28 mx-auto relative mb-4">
          <img
            src="/assets/toa.png"
            alt=""
            width="112"
            height="112"
            className="w-full h-full object-contain filter grayscale opacity-75"
          />
        </div>
      )}

      <h4 className="font-serif text-2xl font-bold text-posis-ink mb-1">
        {title || (type === 'lost-found' ? 'Belum Ada Barang yang Cocok' : 'Belum Ada Aspirasi di Kategori Ini')}
      </h4>

      <p className="text-xs text-stone-600 max-w-xs mx-auto mb-5 leading-relaxed">
        {message || (type === 'lost-found' 
          ? 'Belum ada barang hilang atau ditemukan yang cocok dengan pencarian Anda. Jadilah yang pertama melaporkan.'
          : 'Jadilah yang pertama menyampaikan aspirasi demi perbaikan fasilitas sekolah kita.')}
      </p>

      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
