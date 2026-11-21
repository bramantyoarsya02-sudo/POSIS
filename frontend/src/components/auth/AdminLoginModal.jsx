import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { X, ShieldCheck, User, KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

export function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  // stage: 'loading' | 'form'
  const [stage, setStage] = useState('loading');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Saat modal dibuka, mulai animasi putaran logo selama 2.5 detik
  useEffect(() => {
    let timer;
    if (isOpen) {
      setStage('loading');
      setErrorMessage('');
      setIdentity('');
      setPassword('');

      timer = setTimeout(() => {
        setStage('form');
      }, 2500); // 2.5 detik animasi pemuatan
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMessage('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const loggedUser = await login({ identity, password });

      // Validasi peran: Hanya peran selain 'siswa' yang boleh masuk ke dashboard admin
      if (!loggedUser || loggedUser.role === 'siswa') {
        setErrorMessage('Akses Ditolak: Akun Anda berstatus Siswa Aktif dan tidak memiliki kewenangan hak akses Administrator.');
        setSubmitting(false);
        return;
      }

      // Berhasil login sebagai admin
      handleClose();
      if (onSuccess) {
        onSuccess(loggedUser);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Identitas (NISN/Email) atau kata sandi yang Anda masukkan salah.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Gelap Semi-Transparan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-[#0F1B3D]/80 backdrop-blur-sm transition-opacity"
      />

      {/* Konten Modal */}
      <div className="relative w-full max-w-md z-10">
        <AnimatePresence mode="wait">
          {stage === 'loading' ? (
            /* ================= TAHAP 1: ANIMASI LOGO BERPUTAR ================= */
            <motion.div
              key="stage-loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow-dark p-8 sm:p-10 text-center relative flex flex-col items-center justify-center min-h-[360px]"
            >
              {/* Tombol X Pojok Kanan Atas */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-3 right-3 text-stone-400 hover:text-posis-ink p-1.5 border border-transparent hover:border-stone-300 rounded-[2px] transition-colors"
                title="Batal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo SMKN 1 Ciomas dengan Animasi Rotasi Halus 360 Derajat */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-[124px] h-[124px] rounded-full border-2 border-dashed border-posis-gold/60 p-2 flex items-center justify-center bg-posis-bone/50 shadow-inner">
                  <img
                    src="/assets/smkn_1_ciomas.jpeg"
                    alt="Logo SMKN 1 Ciomas"
                    className="w-[110px] h-[110px] object-contain animate-spin-smooth select-none drop-shadow-md"
                    onError={(e) => {
                      // Fallback path jika diperlukan
                      e.target.src = '/smkn_1_ciomas.jpeg';
                    }}
                  />
                </div>
              </div>

              {/* Teks Animasi Memuat */}
              <div className="space-y-1.5 mt-2">
                <p className="font-mono text-base font-bold text-posis-blue uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-posis-gold animate-ping inline-block" />
                  Memuat...
                </p>
                <p className="text-xs font-mono text-stone-500 max-w-xs">
                  Menghubungkan ke Gerbang Keamanan Administrator SMK Negeri 1 Ciomas...
                </p>
              </div>

              {/* Tombol Batal */}
              <div className="mt-6 pt-4 border-t border-stone-200 w-full">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs font-mono text-stone-500 hover:text-red-700 underline uppercase tracking-wider"
                >
                  Batalkan &amp; Kembali
                </button>
              </div>
            </motion.div>
          ) : (
            /* ================= TAHAP 2: FORM LOGIN ADMINISTRATOR ================= */
            <motion.div
              key="stage-form"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow-dark p-6 sm:p-8 space-y-5 relative"
            >
              {/* Tombol X Pojok Kanan Atas */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 text-stone-400 hover:text-posis-ink p-1.5 border border-transparent hover:border-stone-300 rounded-[2px] transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Form */}
              <div className="flex items-start gap-3.5 pr-8">
                <div className="w-12 h-12 flex-shrink-0 bg-posis-blue/10 border border-posis-blue rounded-[2px] p-1 flex items-center justify-center">
                  <img
                    src="/assets/smkn_1_ciomas.jpeg"
                    alt="Logo SMKN 1 Ciomas"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/smkn_1_ciomas.jpeg';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-posis-blue" />
                    <span className="font-mono text-[10px] font-bold text-posis-blue uppercase tracking-wider">
                      AUTENTIKASI RESMI
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-posis-ink leading-tight">
                    Login Administrator
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Khusus Pengurus OSIS, Guru Pembina, &amp; Petugas Piket
                  </p>
                </div>
              </div>

              {/* Pesan Error Jika Login Gagal */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs flex items-start gap-2.5 rounded-[1px] animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <span className="font-bold block">Autentikasi Gagal:</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
                    NISN atau Email Sekolah
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value)}
                      placeholder="Contoh: siti.rahma@siswa... atau 0071293845"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-posis-bone border border-stone-300 focus:border-posis-blue rounded-[2px] outline-none font-mono text-posis-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-posis-bone border border-stone-300 focus:border-posis-blue rounded-[2px] outline-none text-posis-ink"
                    />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:flex-1 justify-center"
                    disabled={submitting}
                  >
                    {submitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
                  </Button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-mono uppercase tracking-wider text-stone-600 hover:text-posis-ink border border-stone-300 hover:border-posis-blue rounded-[2px] transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
