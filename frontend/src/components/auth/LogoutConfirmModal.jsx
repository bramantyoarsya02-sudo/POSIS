import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutConfirmModal({ isOpen, onCancel, onConfirm }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsLoggingOut(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (typeof onConfirm === 'function') {
        await onConfirm();
      }
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoggingOut ? undefined : onCancel}
            className="fixed inset-0 bg-posis-ink/70 backdrop-blur-sm -z-10 cursor-pointer"
          />

          {/* Dialog Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white border-2 border-posis-blue editorial-shadow p-6 rounded-[2px] z-20 space-y-5 pointer-events-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-[2px] bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-posis-ink">
                  Konfirmasi Keluar Akun
                </h3>
                <p className="font-mono text-xs text-stone-500 mt-0.5">
                  Pusat Olah Suara &amp; Informasi Siswa
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-[2px] text-xs text-stone-700 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sistem POSIS? Anda perlu memasukkan kredensial akun kembali untuk mengakses layanan ini.
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoggingOut}
                className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 font-mono text-xs font-bold uppercase rounded-[2px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoggingOut}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase rounded-[2px] border border-red-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengeluarkan...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Ya, Keluar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
