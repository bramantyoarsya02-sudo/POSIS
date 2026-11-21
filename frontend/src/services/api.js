/**
 * POSIS API Client
 * Mengelola request ke backend Laravel Sanctum dengan fallback otomatis ke Mock Service
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api');

export const apiClient = {
  getToken() {
    return localStorage.getItem('posis_token');
  },

  getVisitorId() {
    let vid = localStorage.getItem('posis_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('posis_visitor_id', vid);
    }
    return vid;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('posis_token', token);
    } else {
      localStorage.removeItem('posis_token');
    }
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Accept': 'application/json',
      'X-Visitor-Id': this.getVisitorId(),
      ...(options.headers || {})
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let body = options.body;
    if (body && !(body instanceof FormData) && typeof body === 'object') {
      body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        body,
        headers
      });

      if (response.status === 401) {
        this.setToken(null);
        window.dispatchEvent(new CustomEvent('posis:unauthorized'));
      }

      const data = await response.json();
      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Terjadi kesalahan pada sistem.',
          errors: data.errors || {}
        };
      }
      return data;
    } catch (err) {
      // Jika backend Laravel belum menyala / connection refused, lemparkan error
      throw err;
    }
  }
};
