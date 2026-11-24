'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';

function ShellContent({ children }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { user, logoutModalOpen, cancelLogout, confirmLogout } = useAuth();

  const isAuthPage = pathname === '/' || pathname === '/login';
  const showNavAndFooter = Boolean(user) && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-posis-bone text-posis-ink selection:bg-posis-gold selection:text-posis-ink">
      {showNavAndFooter && <Header />}

      <main className="flex-1 flex flex-col">{children}</main>

      {showNavAndFooter && <Footer />}
      {showNavAndFooter && <MobileNav />}

      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onCancel={cancelLogout}
        onConfirm={() => confirmLogout(() => router.replace('/'))}
        userName={user?.name}
      />
    </div>
  );
}

export function AppShell({ children }) {
  return (
    <AuthProvider>
      <ShellContent>{children}</ShellContent>
    </AuthProvider>
  );
}

