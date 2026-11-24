import { apiClient } from './api';
import { MOCK_USERS } from './mockData';

export const authService = {
  async login({ identity, password }) {
    try {
      const res = await apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identity, password })
      });
      apiClient.setToken(res.token);
      localStorage.setItem('posis_user', JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      if (err?.status || err?.message) {
        throw new Error(err.message || 'NISN / Email atau kata sandi yang Anda masukkan salah.');
      }

      // Offline / fallback mock validation
      await new Promise(r => setTimeout(r, 250));
      const found = MOCK_USERS.find(u =>
        (u.nisn && u.nisn === identity) ||
        (u.email && u.email.toLowerCase() === identity.toLowerCase())
      );

      if (!found || found.password !== password) {
        throw new Error('NISN / Email atau kata sandi yang Anda masukkan salah.');
      }

      const mockToken = `mock-token-${found.role}-${Date.now()}`;
      apiClient.setToken(mockToken);
      localStorage.setItem('posis_user', JSON.stringify(found));
      return found;
    }
  },

  async register(data) {
    try {
      const res = await apiClient.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      apiClient.setToken(res.token);
      localStorage.setItem('posis_user', JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      if (err?.errors) {
        throw err;
      }
      throw new Error(err?.message || 'Pendaftaran siswa gagal diproses.');
    }
  },

  async getCurrentUser() {
    const token = apiClient.getToken();
    if (!token) {
      return null;
    }
    try {
      const res = await apiClient.request('/auth/me');
      return res.data;
    } catch {
      const stored = localStorage.getItem('posis_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  async logout() {
    try {
      await apiClient.request('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Backend logout warning:', err);
    } finally {
      apiClient.setToken(null);
      localStorage.removeItem('posis_user');
      localStorage.removeItem('posis_token');
    }
  }
};
