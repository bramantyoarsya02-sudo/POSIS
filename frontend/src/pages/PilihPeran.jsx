import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, User, Lock, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { AdminLoginModal } from '../components/auth/AdminLoginModal';

export function PilihPeran() {
  const { user, switchRole, openAdminModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Jika dialihkan dari Route Guard (mencoba buka /admin/dashboard tanpa izin)
  useEffect(() => {
    if (location.state?.openAdminModal) {
      openAdminModal();
    }
  }, [location.state, openAdminModal]);

  const handleSelectSiswa = () => {
    switchRole('siswa');
    navigate('/');
  };

  const handleSelectAdmin = () => {
    // Membuka modal autentikasi admin dengan animasi logo berputar
    openAdminModal();
  };

  return (
    <div className="min-h-[85vh] bg-posis-bone py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Banner Notifikasi jika dialihkan dari Route Guard */}
        {location.state?.fromAdminGuard && (
          <div className="bg-amber-50 border-2 border-posis-gold p-4 rounded-[2px] editorial-shadow-sm flex items-start gap-3 text-amber-900 text-xs font-mono">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-700" />
            <div>
              <p className="font-bold uppercase">Akses Panel Admin Dibatasi</p>
              <p className="text-stone-700 mt-0.5">
                Anda harus melakukan autentikasi login terlebih dahulu dengan akun resmi Administrator untuk membuka halaman dashboard tersebut.
              </p>
            </div>
          </div>
        )}

        {/* Header Halaman */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-posis-blue/10 border border-posis-blue px-3 py-1 rounded-[2px]">
            <img
              src="/assets/smkn_1_ciomas.jpeg"
              alt="SMKN 1 Ciomas"
              className="w-4 h-4 object-contain"
              onError={(e) => {
                e.target.src = '/smkn_1_ciomas.jpeg';
              }}
            />
            <span className="font-mono text-xs font-bold text-posis-blue uppercase tracking-wider">
              PORTAL RESMI SMKN 1 CIOMAS
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-posis-blue tracking-tight">
            Pemilihan Peran Pengguna
          </h1>
          <p className="font-sans text-sm md:text-base text-stone-600 max-w-xl mx-auto">
            Silakan tentukan peran Anda untuk mengakses layanan sistem Pusat Olah Suara &amp; Informasi Siswa (POSIS).
          </p>
        </div>

        {/* Kartu Pilihan Peran (Responsif: 1 Kolom di HP, 2 Kolom di Tablet/Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* ================= KARTU 1: SISWA ================= */}
          <div className="bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow p-6 sm:p-8 flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-[2px] bg-posis-bone border border-posis-blue flex items-center justify-center text-posis-blue">
                  <User className="w-6 h-6" />
                </span>
                <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-[2px]">
                  Akses Langsung
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-posis-ink group-hover:text-posis-blue transition-colors">
                  Siswa Aktif
                </h2>
                <p className="font-mono text-xs text-stone-500 uppercase mt-0.5">
                  Seluruh Siswa SMKN 1 Ciomas
                </p>
              </div>

              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                Akses terbuka untuk menyampaikan aspirasi dan keluhan fasilitas sekolah, mencari barang hilang, mengajukan klaim temuan, serta memantau linimasa penyelesaian.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs font-mono text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Katalog Lost &amp; Found Terbuka</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pengajuan Aspirasi Fasilitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dukungan Suara (Upvoting)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-200">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSelectSiswa}
                className="w-full justify-between"
              >
                <span>Masuk sebagai Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ================= KARTU 2: ADMINISTRATOR (WAJIB LOGIN) ================= */}
          <div className="bg-white border-2 border-posis-blue-dark rounded-[2px] editorial-shadow-dark p-6 sm:p-8 flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group relative overflow-hidden">
            {/* Aksen Latar Belakang */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-posis-gold/10 -mr-6 -mt-6 rounded-full pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-[2px] bg-posis-blue text-white border border-posis-blue-dark flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-posis-gold" />
                </span>
                <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded-[2px] flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  WAJIB LOGIN
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-posis-ink group-hover:text-posis-blue transition-colors">
                  Administrator
                </h2>
                <p className="font-mono text-xs text-amber-900 font-semibold uppercase mt-0.5">
                  OSIS · Guru Pembina · Petugas Piket
                </p>
              </div>

              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                Area manajemen khusus untuk meninjau &amp; memoderasi laporan barang, memverifikasi bukti klaim kepemilikan di loket serah terima, dan merespons aspirasi siswa.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs font-mono text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-posis-blue" />
                  <span>Moderasi Laporan Masuk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-posis-blue" />
                  <span>Verifikasi Bukti Ciri &amp; Klaim</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-posis-blue" />
                  <span>Tanggapan Resmi Tindak Lanjut</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-200 relative z-10">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleSelectAdmin}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-posis-gold" />
                  Pilih Peran Admin (Login)
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Petunjuk Tambahan */}
        <div className="text-center pt-4">
          <p className="text-xs font-mono text-stone-500">
            *Pengguna Admin wajib memiliki kredensial resmi terdaftar di database SMKN 1 Ciomas.
          </p>
        </div>
      </div>
    </div>
  );
}
