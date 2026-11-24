import { apiClient } from './api';
import { MOCK_ITEMS } from './mockData';

let localItems = [...MOCK_ITEMS];

export const itemsService = {
  async getItems(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await apiClient.request(`/items${query ? `?${query}` : ''}`);
      return res;
    } catch {
      await new Promise(r => setTimeout(r, 250));
      let filtered = [...localItems];

      if (params.type && params.type !== 'semua') {
        filtered = filtered.filter(item => item.type === params.type);
      }
      if (params.category && params.category !== 'semua') {
        filtered = filtered.filter(item => item.category === params.category);
      }
      if (params.q) {
        const q = params.q.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
        );
      }

      return {
        data: filtered,
        meta: {
          total: filtered.length,
          per_page: 12,
          current_page: 1
        }
      };
    }
  },

  async getItemById(id) {
    try {
      const res = await apiClient.request(`/items/${id}`);
      return res?.data || res;
    } catch {
      await new Promise(r => setTimeout(r, 200));
      const found = localItems.find(item => String(item.id) === String(id));
      if (!found) {
        throw new Error("Barang tidak ditemukan.");
      }
      return found;
    }
  },

  async createItem(formData) {
    try {
      const res = await apiClient.request('/items', {
        method: 'POST',
        body: formData
      });
      return res?.data || res;
    } catch (err) {
      if (err?.message || err?.errors) {
        const errorDetail = err.errors ? Object.values(err.errors).flat().join(', ') : err.message;
        throw new Error(errorDetail || 'Gagal menerbitkan laporan barang.');
      }
      throw err;
    }
  },

  async submitClaim(itemId, claimData) {
    try {
      const res = await apiClient.request(`/items/${itemId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      });
      return res?.data || res;
    } catch (err) {
      if (err?.message || err?.errors) {
        const errorDetail = err.errors ? Object.values(err.errors).flat().join(', ') : err.message;
        throw new Error(errorDetail || 'Gagal mengajukan klaim.');
      }
      throw err;
    }
  }
};
