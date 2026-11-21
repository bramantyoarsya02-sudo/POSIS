import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';

const SCHOOL_LOGO = '/assets/smkn_1_ciomas.jpeg';

export function AuthPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identity: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginGeneralError, setLoginGeneralError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'osis' || user.role === 'piket' || user.role === 'guru_pembina') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/beranda', { replace: true });
      }
    }
  }, [user, navigate]);

  // --- Handlers: Login ---
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setLoginGeneralError('');
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.identity.trim()) {
      errors.identity = 'NISN atau Email siswa wajib diisi.';
    }
    if (!loginForm.password) {
      errors.password = 'Kata sandi wajib diisi.';
    } else if (loginForm.password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter.';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoggingIn(true);
    setLoginGeneralError('');

    try {
      const loggedUser = await login({
        identity: loginForm.identity.trim(),
        password: loginForm.password,
      });

      // Auto redirect according to role
      if (loggedUser.role === 'admin' || loggedUser.role === 'osis' || loggedUser.role === 'piket' || loggedUser.role === 'guru_pembina') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/beranda', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginGeneralError(err.message || 'NISN / Email atau kata sandi yang Anda masukkan salah.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-posis-bone text-posis-ink flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#1F3F94_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* MAIN AUTHENTICATION CARD */}
      <div className="w-full max-w-lg bg-white border-2 border-posis-blue editorial-shadow rounded-[2px] overflow-hidden z-10 my-6">
        {/* Top Header Card with School Logo Identity */}
        <div className="bg-posis-blue text-white p-6 sm:p-7 text-center relative border-b-2 border-posis-blue-dark">
          <div className="mx-auto w-20 h-20 bg-white rounded-full p-2 border-2 border-posis-gold shadow-md flex items-center justify-center mb-3">
            <img
              src={SCHOOL_LOGO}
              alt="Logo SMK Negeri 1 Ciomas"
              className="w-full h-full object-contain rounded-full hover:scale-105 transition-transform"
            />
          </div>
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-posis-gold font-bold block mb-1">
            PORTAL RESMI SMK NEGERI 1 CIOMAS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            POSIS
          </h1>
          <p className="font-mono text-xs text-white/80 mt-1">
            Pusat Olah Suara &amp; Informasi Siswa
          </p>
        </div>

        {/* Card Body: Khusus Form Login */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-center mb-5">
              <span className="inline-block px-2.5 py-0.5 bg-posis-gold text-posis-ink font-mono text-[11px] font-bold uppercase rounded-[2px] mb-2">
                AUTENTIKASI WARGA SEKOLAH
              </span>
              <h2 className="font-serif text-2xl font-bold text-posis-ink">
                Masuk ke Akun POSIS
              </h2>
              <p className="font-mono text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Khusus peserta didik aktif &amp; staf SMKN 1 Ciomas. Masukkan NISN atau Email terdaftar Anda.
              </p>
            </div>

            {/* School Privacy & Security Notice */}
            <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-[2px] flex items-start gap-2.5 text-xs text-amber-900 leading-snug">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Akses Khusus Warga Sekolah:</strong> Pendaftaran akun publik ditutup untuk mencegah penyalahgunaan. Seluruh akun siswa telah dibuat dan terdaftar resmi oleh pihak sekolah.
              </span>
            </div>

            {loginGeneralError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-[2px] flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginGeneralError}</span>
              </div>
            )}

            {/* Input Identity */}
            <div className="space-y-1">
              <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                NISN / Email Siswa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="identity"
                  value={loginForm.identity}
                  onChange={handleLoginChange}
                  placeholder="Contoh: 0070001001 atau siswa01@smkn1ciomas.sch.id"
                  disabled={isLoggingIn}
                  className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                    loginErrors.identity ? 'border-red-500 focus:ring-red-200' : 'border-stone-300 focus:border-posis-blue'
                  } rounded-[2px] outline-none transition-all`}
                />
                <User className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
              {loginErrors.identity && (
                <p className="font-mono text-[11px] text-red-600 mt-1">
                  {loginErrors.identity}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Masukkan kata sandi akun Anda"
                  disabled={isLoggingIn}
                  className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                    loginErrors.password ? 'border-red-500 focus:ring-red-200' : 'border-stone-300 focus:border-posis-blue'
                  } rounded-[2px] outline-none transition-all pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-posis-blue"
                  title={showLoginPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginErrors.password && (
                <p className="font-mono text-[11px] text-red-600 mt-1">
                  {loginErrors.password}
                </p>
              )}
            </div>

            {/* Login Button with Rotating Logo Spinner when loading */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-xs font-bold uppercase rounded-[2px] border-2 border-posis-blue-dark transition-all flex items-center justify-center gap-2.5 disabled:opacity-80 shadow-md cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-white p-0.5 border border-posis-gold inline-flex items-center justify-center animate-spin-smooth">
                      <img
                        src={SCHOOL_LOGO}
                        alt="Loading"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-posis-gold" />
                    <span>Masuk ke Akun POSIS</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Role auto-detection */}
            <div className="p-3 bg-posis-bone border border-stone-300 rounded-[2px] text-[11px] text-stone-600 font-mono leading-relaxed">
              <span className="font-bold text-posis-blue block mb-0.5">PANDUAN LOGIN PENGUJIAN:</span>
              Gunakan salah satu dari 50 akun siswa resmi SMKN 1 Ciomas (misal: <code>siswa01@smkn1ciomas.sch.id</code> atau NISN <code>0070001001</code>, password: <code>siswa123</code>).
            </div>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center font-mono text-[11px] text-stone-500 space-y-1 z-10">
        <p>&copy; {new Date().getFullYear()} SMK Negeri 1 Ciomas · Kabupaten Bogor</p>
        <p className="text-[10px] text-stone-400">
          Sistem Terintegrasi Layanan Aspirasi &amp; Pengembalian Barang Sekolah
        </p>
      </footer>
    </div>
  );
}
