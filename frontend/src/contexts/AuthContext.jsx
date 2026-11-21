import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('posis_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('posis_token');
    if (!token) {
      setUser(null);
      return;
    }

    async function loadUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.warn("Gagal memperbarui status user di latar:", err);
      }
    }
    loadUser();

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('posis:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('posis:unauthorized', handleUnauthorized);
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
      console.warn("Logout error:", err);
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
    <AuthContext.Provider value={{
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
    }}>
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
