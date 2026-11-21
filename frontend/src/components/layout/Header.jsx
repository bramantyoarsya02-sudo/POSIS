import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search, MessageSquare, HelpCircle, ShieldCheck, User, LogOut, Home } from 'lucide-react';
import { NotificationBell } from '../common/NotificationBell';

export function Header() {
  const location = useLocation();
  const { user, requestLogout, isAdmin } = useAuth();

  // Menu navbar untuk semua pengguna terotentikasi
  const navItems = [
    { name: 'Beranda', path: '/beranda', icon: Home },
    { name: 'Lost & Found', path: '/lost-found', icon: Search },
    { name: 'Aspirasi', path: '/aspirasi', icon: MessageSquare },
    { name: 'Panduan & FAQ', path: '/panduan-faq', icon: HelpCircle },
  ];

  const roleLabels = {
    admin: 'Administrator',
    siswa: 'Siswa',
    osis: 'Pengurus OSIS',
    piket: 'Petugas Piket',
    guru_pembina: 'Guru Pembina',
  };

  const isAtAdminDashboard = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-posis-bone/95 backdrop-blur-sm border-b-2 border-posis-blue shadow-sm">
      {/* Main Header Bar */}
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-2 lg:gap-3">
        {/* Brand & Logo */}
        <Link to="/beranda" className="flex items-center gap-2 lg:gap-2.5 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center p-1 bg-white border border-posis-blue rounded-[2px] editorial-shadow-sm group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform shrink-0">
            <img
              src="/assets/smkn_1_ciomas.jpeg"
              alt="Logo SMK Negeri 1 Ciomas"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-posis-blue leading-none">
                POSIS
              </span>
            </div>
            {/* Slogan disembunyikan di layar laptop (< 1280px) agar navbar rapi dan tidak overflow batas container */}
            <p className="text-[11px] text-posis-ink font-mono font-medium tracking-tight mt-0.5 hidden xl:block whitespace-nowrap">
              Pusat Olah Suara &amp; Informasi Siswa
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap px-2 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-[2px] transition-all border inline-flex items-center justify-center ${
                  isActive
                    ? 'bg-posis-blue text-white border-posis-blue editorial-shadow-sm'
                    : 'text-posis-ink border-transparent hover:border-posis-blue hover:bg-posis-blue/5'
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Tombol Dashboard Admin (HANYA tampil untuk role admin) */}
          {isAdmin && (
            isAtAdminDashboard ? (
              /* Saat sudah di Dashboard Admin: tampilkan badge minimalis hanya di layar lebar agar tidak menduplikasi tombol */
              <span className="hidden xl:inline-flex items-center gap-1.5 ml-1 px-2.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-[2px] bg-posis-gold/20 text-posis-blue border border-posis-blue/30">
                <ShieldCheck className="w-3.5 h-3.5 text-posis-blue shrink-0" />
                <span>Mode Admin</span>
              </span>
            ) : (
              /* Saat di halaman siswa/publik: tombol masuk ke Dashboard Admin */
              <Link
                to="/admin/dashboard"
                className="whitespace-nowrap ml-1 px-2 xl:px-3 py-1.5 xl:py-2 text-xs font-mono font-bold tracking-wider uppercase inline-flex items-center gap-1.5 rounded-[2px] border transition-all bg-posis-gold hover:bg-posis-gold-hover text-posis-ink border-posis-ink shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-posis-ink shrink-0" />
                <span className="hidden xl:inline">Dashboard Admin</span>
                <span className="inline xl:hidden">Admin</span>
              </Link>
            )
          )}

          {/* Lonceng Notifikasi Siswa & Warga Sekolah */}
          <div className="ml-1 xl:ml-2">
            <NotificationBell />
          </div>

          {/* User Profile Pill */}
          <div className="ml-1.5 xl:ml-3 pl-2 xl:pl-3 border-l-2 border-stone-300 flex items-center gap-1.5 xl:gap-2 shrink-0">
            <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center text-posis-blue overflow-hidden shadow-sm shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              )}
            </div>
            <div className="text-left text-xs leading-tight hidden sm:block">
              <p className="font-bold text-posis-ink truncate max-w-[85px] xl:max-w-[130px] whitespace-nowrap">
                {user?.name || 'Siswa'}
              </p>
              <span className="font-mono text-[9px] xl:text-[10px] text-posis-blue uppercase font-bold block whitespace-nowrap">
                {roleLabels[user?.role] || 'Siswa'}
              </span>
            </div>

            {/* Tombol Keluar (Ikon Panah Keluar) */}
            <button
              type="button"
              onClick={requestLogout}
              title="Keluar dari akun POSIS"
              className="p-1.5 xl:p-2 border border-stone-300 hover:border-red-600 hover:bg-red-50 hover:text-red-700 text-stone-600 bg-white rounded-[2px] transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            </button>
          </div>
        </nav>

        {/* Mobile Header Right Controls */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {isAdmin && !isAtAdminDashboard && (
            <Link
              to="/admin/dashboard"
              className="whitespace-nowrap px-2 py-1 text-[11px] font-mono font-bold uppercase bg-posis-gold text-posis-ink border border-posis-ink rounded-[2px] flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          )}

          {/* Mobile Bell */}
          <NotificationBell />

          <span className="whitespace-nowrap text-xs font-mono text-posis-blue font-bold px-2 py-1 bg-white border border-posis-blue rounded-[2px]">
            {roleLabels[user?.role] || 'Siswa'}
          </span>
          <button
            type="button"
            onClick={requestLogout}
            title="Keluar"
            className="p-1.5 border border-stone-300 text-stone-600 bg-white rounded-[2px] hover:text-red-600 shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
