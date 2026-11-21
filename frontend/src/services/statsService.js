import { apiClient } from './api';
import { MOCK_STATS } from './mockData';

export const statsService = {
  async getStats() {
    try {
      const res = await apiClient.request('/stats');
      return res.data;
    } catch {
      // Fallback ke mock data realistis saat backend Laravel belum berjalan
      await new Promise(r => setTimeout(r, 200));
      return MOCK_STATS;
    }
  }
};
