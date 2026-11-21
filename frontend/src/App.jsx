import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';

// Pages
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { LostFoundIndex } from './pages/LostFound/Index';
import { LostFoundDetail } from './pages/LostFound/Detail';
import { AspirasiIndex } from './pages/Aspirasi/Index';
import { AspirasiDetail } from './pages/Aspirasi/Detail';
import { PanduanFaq } from './pages/PanduanFaq';
import { AdminDashboard } from './pages/Admin/Dashboard';

// Route Guard 1: Khusus Pengguna Publik (Belum Login)
// Jika sudah login, redirect otomatis ke tujuan sesuai peran:
// - Admin -> /admin/dashboard
// - Siswa -> /beranda
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-posis-bone font-mono text-xs text-posis-blue">
        Memeriksa sesi login...
      </div>
    );
  }

  if (user) {
    const isAdmin = user.role === 'admin' || user.role === 'osis' || user.role === 'piket' || user.role === 'guru_pembina';
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/beranda'} replace />;
  }

  return children;
}

// Route Guard 2: Proteksi Halaman Umum (Wajib Login)
// Belum login -> diarahkan ke halaman Login / Registrasi (/)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-posis-bone font-mono text-xs text-posis-blue">
        Memverifikasi otentikasi...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Route Guard 3: Khusus Area Administrator (/admin/*)
// Belum login -> redirect ke /
// Siswa mencoba akses -> tolak akses (403) dan alihkan ke /beranda
function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-posis-bone font-mono text-xs text-posis-blue">
        Memverifikasi hak akses administrator...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === 'siswa') {
    return <Navigate to="/beranda" replace />;
  }

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location}>
          {/* HALAMAN AWAL: Login / Registrasi Siswa dengan Animasi Logo */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />

          {/* Halaman Pemilihan Peran Lama dinonaktifkan & diarahkan ke rute awal */}
          <Route path="/pilih-peran" element={<Navigate to="/" replace />} />
          <Route path="/roles" element={<Navigate to="/" replace />} />

          {/* Halaman Beranda & Fitur Siswa (Terproteksi Route Guard) */}
          <Route
            path="/beranda"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost-found"
            element={
              <ProtectedRoute>
                <LostFoundIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost-found/:id"
            element={
              <ProtectedRoute>
                <LostFoundDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aspirasi"
            element={
              <ProtectedRoute>
                <AspirasiIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aspirasi/:id"
            element={
              <ProtectedRoute>
                <AspirasiDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panduan-faq"
            element={
              <ProtectedRoute>
                <PanduanFaq />
              </ProtectedRoute>
            }
          />

          {/* DASHBOARD ADMIN (BARU) - Khusus Role Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutModalOpen, cancelLogout, confirmLogout } = useAuth();

  const isAuthPage = location.pathname === '/' || location.pathname === '/login';
  const showNavAndFooter = Boolean(user) && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-posis-bone text-posis-ink selection:bg-posis-gold selection:text-posis-ink">
      {/* Header HANYA tampil jika sudah login dan bukan di halaman Login/Registrasi */}
      {showNavAndFooter && <Header />}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <AnimatedRoutes />
      </main>

      {/* Footer HANYA tampil jika sudah login dan bukan di halaman Login/Registrasi */}
      {showNavAndFooter && <Footer />}

      {/* Mobile Bottom Navigation Bar (max-w 768px) */}
      {showNavAndFooter && <MobileNav />}

      {/* Modal Dialog Konfirmasi Logout */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onCancel={cancelLogout}
        onConfirm={async () => {
          await confirmLogout();
          window.location.href = '/';
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
