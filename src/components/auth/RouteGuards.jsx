'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const isAdmin =
        user.role === 'admin' ||
        user.role === 'osis' ||
        user.role === 'piket' ||
        user.role === 'guru_pembina';
      router.replace(isAdmin ? '/admin/dashboard' : '/beranda');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-posis-bone font-mono text-xs text-posis-blue">
        Memeriksa sesi login...
      </div>
    );
  }

  return children;
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-posis-bone font-mono text-xs text-posis-blue">
        Memverifikasi otentikasi...
      </div>
    );
  }

  return children;
}

export function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/');
      } else if (user.role === 'siswa') {
        router.replace('/beranda');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role === 'siswa') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-posis-bone font-mono text-xs text-posis-blue">
        Memverifikasi hak akses administrator...
      </div>
    );
  }

  return children;
}

