import { apiClient } from './api';

export const adminService = {
  // 1. Dashboard summary, trend chart data, & recent activities
  async getDashboard() {
    try {
      const res = await apiClient.request('/admin/dashboard');
      return res.data;
    } catch (err) {
      console.warn('Backend admin dashboard endpoint offline/error, using client fallback:', err);
      return {
        stats: {
          totalStudents: 1,
          lostFound: { total: 3, hilang: 1, ditemukan: 2, selesai: 0 },
          aspirations: { total: 2, baru: 0, diproses: 1, selesai: 1 },
          totalFaqs: 3,
        },
        monthlyTrends: [],
        recentActivities: [
          {
            id: 'item-1',
            type: 'lost_found',
            title: 'Laporan Temuan: Kunci Motor Honda Beat Hitam',
            author: 'Muhammad Rizky Pratama',
            badge: 'Ditemukan',
            badgeColor: 'emerald',
            created_at: '10 menit yang lalu',
          },
          {
            id: 'asp-1',
            type: 'aspiration',
            title: 'Aspirasi Masuk: Kran Air dan Gayung di Toilet Siswa Gedung B',
            author: 'Muhammad Rizky Pratama',
            badge: 'Aspirasi',
            badgeColor: 'blue',
            created_at: '25 menit yang lalu',
          },
          {
            id: 'student-1',
            type: 'student_registered',
            title: 'Siswa Baru Terdaftar: Muhammad Rizky Pratama',
            author: 'XII RPL 1',
            badge: 'Pendaftaran',
            badgeColor: 'amber',
            created_at: '1 jam yang lalu',
          },
        ],
      };
    }
  },

  // 2. Kelola Siswa
  async getStudents(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    try {
      const res = await apiClient.request(`/admin/students?${query.toString()}`);
      return res;
    } catch (err) {
      console.warn('Gagal memuat siswa dari API:', err);
      return {
        data: [
          {
            id: 2,
            name: 'Muhammad Rizky Pratama',
            nisn: '0067823910',
            class_or_division: 'XII Rekayasa Perangkat Lunak 1',
            email: 'siswa@smkn1ciomas.sch.id',
            is_active: true,
            role: 'siswa',
          },
        ],
        meta: { current_page: 1, last_page: 1, total: 1 },
      };
    }
  },

  async toggleStudentActive(id) {
    return await apiClient.request(`/admin/students/${id}/toggle-active`, {
      method: 'PATCH',
    });
  },

  async resetStudentPassword(id, newPassword) {
    return await apiClient.request(`/admin/students/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password: newPassword }),
    });
  },

  async deleteStudent(id) {
    return await apiClient.request(`/admin/students/${id}`, {
      method: 'DELETE',
    });
  },

  // 3. Kelola Lost & Found
  async getItems(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.type) query.append('type', params.type);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    try {
      const res = await apiClient.request(`/admin/items?${query.toString()}`);
      return res;
    } catch (err) {
      console.warn('Gagal memuat barang dari API:', err);
      return {
        data: [],
        meta: { current_page: 1, last_page: 1, total: 0 },
      };
    }
  },

  async updateItemStatus(id, status) {
    return await apiClient.request(`/admin/items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteItem(id) {
    return await apiClient.request(`/admin/items/${id}`, {
      method: 'DELETE',
    });
  },

  // 4. Kelola Aspirasi
  async getAspirations(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    try {
      const res = await apiClient.request(`/admin/aspirations?${query.toString()}`);
      return res;
    } catch (err) {
      console.warn('Gagal memuat aspirasi dari API:', err);
      return {
        data: [],
        meta: { current_page: 1, last_page: 1, total: 0 },
      };
    }
  },

  async updateAspirationStatus(id, { status, admin_reply }) {
    return await apiClient.request(`/admin/aspirations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_reply }),
    });
  },

  async deleteAspiration(id) {
    return await apiClient.request(`/admin/aspirations/${id}`, {
      method: 'DELETE',
    });
  },

  // 5. Kelola Panduan & FAQ
  async getFaqs() {
    try {
      const res = await apiClient.request('/admin/faqs');
      return res.data;
    } catch (err) {
      console.warn('Gagal memuat FAQ dari API:', err);
      return [];
    }
  },

  async createFaq(faq) {
    return await apiClient.request('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(faq),
    });
  },

  async updateFaq(id, faq) {
    return await apiClient.request(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faq),
    });
  },

  async deleteFaq(id) {
    return await apiClient.request(`/admin/faqs/${id}`, {
      method: 'DELETE',
    });
  },

  // 6. Kelola Klaim Barang (Lost & Found)
  async getClaims(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    try {
      const res = await apiClient.request(`/admin/claims?${query.toString()}`);
      return res;
    } catch (err) {
      console.warn('Gagal memuat klaim dari API:', err);
      return {
        data: [],
        meta: { current_page: 1, last_page: 1, total: 0 },
      };
    }
  },

  async verifyClaim(id, verificationNote) {
    return await apiClient.request(`/admin/claims/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ verification_note: verificationNote }),
    });
  },

  async rejectClaim(id, verificationNote) {
    return await apiClient.request(`/admin/claims/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ verification_note: verificationNote }),
    });
  },

  async deleteClaim(id) {
    return await apiClient.request(`/admin/claims/${id}`, {
      method: 'DELETE',
    });
  },

  // 7. Kelola Komentar Aspirasi
  async getComments(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    try {
      const res = await apiClient.request(`/admin/comments?${query.toString()}`);
      return res;
    } catch (err) {
      console.warn('Gagal memuat komentar dari API:', err);
      return {
        data: [],
        meta: { current_page: 1, last_page: 1, total: 0 },
      };
    }
  },

  async deleteComment(id) {
    return await apiClient.request(`/admin/comments/${id}`, {
      method: 'DELETE',
    });
  },
};
