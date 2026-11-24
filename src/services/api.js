/**
 * POSIS API Client (Next.js App Router)
 * Mengelola request ke Next.js API Route Handlers (/api/*) yang terhubung ke Supabase
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = {
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('posis_token');
  },

  getVisitorId() {
    if (typeof window === 'undefined') return 'server';
    let vid = localStorage.getItem('posis_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('posis_visitor_id', vid);
    }
    return vid;
  },

  setToken(token) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('posis_token', token);
    } else {
      localStorage.removeItem('posis_token');
    }
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      Accept: 'application/json',
      'X-Visitor-Id': this.getVisitorId(),
      ...(options.headers || {}),
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      body,
      headers,
    });

    if (response.status === 401 && typeof window !== 'undefined') {
      this.setToken(null);
      window.dispatchEvent(new CustomEvent('posis:unauthorized'));
    }

    const data = await response.json();
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Terjadi kesalahan pada sistem.',
        errors: data.errors || {},
      };
    }
    return data;
  },
};
