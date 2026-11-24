'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('posis_token') : null;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('posis_user') : null;

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    async function loadUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted && currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.warn('Gagal memperbarui status user di latar:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadUser();

    const handleUnauthorized = () => {
      if (mounted) setUser(null);
    };
    window.addEventListener('posis:unauthorized', handleUnauthorized);
    return () => {
      mounted = false;
      window.removeEventListener('posis:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const loggedUser = await authService.login(credentials);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (studentData) => {
    const newUser = await authService.register(studentData);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setUser(null);
      setLogoutModalOpen(false);
    }
  };

  const requestLogout = () => {
    setLogoutModalOpen(true);
  };

  const cancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const confirmLogout = async (onDone) => {
    await logout();
    if (typeof onDone === 'function') {
      onDone();
    }
  };

  const isAdmin = Boolean(user && user.role !== 'siswa');

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        requestLogout,
        cancelLogout,
        confirmLogout,
        logoutModalOpen,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}
