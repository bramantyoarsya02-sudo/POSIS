import { apiClient } from './api';

const READ_STORAGE_KEY = 'posis_read_notif_ids';

export const notificationService = {
  getReadIds() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(READ_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markAsRead(id) {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getReadIds();
      if (!current.includes(id)) {
        current.push(id);
        localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      console.error('Failed to save read notification:', e);
    }
  },

  markAllAsRead(ids = []) {
    if (typeof window === 'undefined') return;
    try {
      const current = new Set(this.getReadIds());
      ids.forEach((id) => current.add(id));
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...current]));
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e);
    }
  },

  async getNotifications() {
    try {
      const res = await apiClient.request('/notifications');
      const list = res?.notifications || [];
      const readIds = new Set(this.getReadIds());

      const withReadStatus = list.map((item) => ({
        ...item,
        is_read: readIds.has(item.id),
      }));

      const unreadCount = withReadStatus.filter((item) => !item.is_read).length;

      return {
        notifications: withReadStatus,
        unread_count: unreadCount,
      };
    } catch (err) {
      console.warn('Gagal mengambil notifikasi:', err);
      return {
        notifications: [],
        unread_count: 0,
      };
    }
  },
};
