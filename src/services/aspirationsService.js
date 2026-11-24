import { apiClient } from './api';
import { MOCK_ASPIRATIONS } from './mockData';

let localAspirations = [...MOCK_ASPIRATIONS];

export const aspirationsService = {
  async getAspirations(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await apiClient.request(`/aspirations${query ? `?${query}` : ''}`);
      return res;
    } catch {
      await new Promise(r => setTimeout(r, 250));
      let filtered = [...localAspirations];

      if (params.category && params.category !== 'semua') {
        filtered = filtered.filter(a => a.category === params.category);
      }
      if (params.status && params.status !== 'semua') {
        filtered = filtered.filter(a => a.status === params.status);
      }
      if (params.q) {
        const q = params.q.toLowerCase();
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q)
        );
      }

      if (params.sort === 'populer') {
        filtered.sort((a, b) => b.upvotes_count - a.upvotes_count);
      } else {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      return {
        data: filtered,
        meta: {
          total: filtered.length,
          per_page: 10,
          current_page: 1
        }
      };
    }
  },

  async getAspirationById(id) {
    try {
      const res = await apiClient.request(`/aspirations/${id}`);
      return res?.data || res;
    } catch {
      await new Promise(r => setTimeout(r, 200));
      const found = localAspirations.find(a => String(a.id) === String(id));
      if (!found) {
        throw new Error("Aspirasi tidak ditemukan.");
      }
      return found;
    }
  },

  async createAspiration(data) {
    try {
      const res = await apiClient.request('/aspirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res?.data || res;
    } catch (err) {
      if (err?.message || err?.errors) {
        const errorDetail = err.errors ? Object.values(err.errors).flat().join(', ') : err.message;
        throw new Error(errorDetail || 'Gagal mengirim aspirasi ke server.');
      }
      throw err;
    }
  },

  async toggleVote(id) {
    try {
      const res = await apiClient.request(`/aspirations/${id}/vote`, {
        method: 'POST'
      });
      return {
        upvotes_count: res?.upvotes_count ?? (res?.data?.upvotes_count ?? 0),
        has_voted: res?.has_voted ?? (res?.data?.has_voted ?? false),
      };
    } catch {
      await new Promise(r => setTimeout(r, 150));
      const item = localAspirations.find(a => String(a.id) === String(id));
      if (item) {
        if (item.has_voted) {
          item.upvotes_count = Math.max(0, item.upvotes_count - 1);
          item.has_voted = false;
        } else {
          item.upvotes_count += 1;
          item.has_voted = true;
        }
        return { upvotes_count: item.upvotes_count, has_voted: item.has_voted };
      }
      return { upvotes_count: 0, has_voted: false };
    }
  },

  async addComment(id, commentText) {
    try {
      const res = await apiClient.request(`/aspirations/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentText })
      });
      return res.comment || res.data || res;
    } catch (err) {
      if (err?.message || err?.errors) {
        const errorDetail = err.errors ? Object.values(err.errors).flat().join(', ') : err.message;
        throw new Error(errorDetail || 'Gagal mengirim komentar.');
      }
      throw err;
    }
  }
};
