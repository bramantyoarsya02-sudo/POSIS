'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import {
  Users,
  Search,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  Plus,
  Key,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  FileText,
  FileSpreadsheet,
  Download,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  exportAdminReport,
  buildOverviewTableHtml,
  buildStudentsTableHtml,
  buildItemsTableHtml,
  buildClaimsTableHtml,
  buildAspirationsTableHtml,
  buildCommentsTableHtml,
  buildFaqsTableHtml,
} from '../../utils/reportExporter';

export function AdminDashboard() {
  const { user, requestLogout } = useAuth();

  // Navigation: 'overview' | 'students' | 'items' | 'aspirations' | 'faqs'
  const [activeMenu, setActiveMenu] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Today formatted
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // --- State: Overview ---
  const [dashboardData, setDashboardData] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [exportingKey, setExportingKey] = useState(null);

  // --- State: Kelola Siswa ---
  const [studentsData, setStudentsData] = useState([]);
  const [studentsMeta, setStudentsMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsSearch, setStudentsSearch] = useState('');
  const [studentsFilterStatus, setStudentsFilterStatus] = useState('');
  const [studentsPage, setStudentsPage] = useState(1);

  // Reset Password Modal
  const [resetModalStudent, setResetModalStudent] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // --- State: Kelola Lost & Found ---
  const [itemsData, setItemsData] = useState([]);
  const [itemsMeta, setItemsMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsSearch, setItemsSearch] = useState('');
  const [itemsTypeFilter, setItemsTypeFilter] = useState('');
  const [itemsStatusFilter, setItemsStatusFilter] = useState('');
  const [itemsPage, setItemsPage] = useState(1);

  // --- State: Kelola Aspirasi ---
  const [aspirationsData, setAspirationsData] = useState([]);
  const [aspirationsMeta, setAspirationsMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [aspirationsLoading, setAspirationsLoading] = useState(false);
  const [aspirationsSearch, setAspirationsSearch] = useState('');
  const [aspirationsStatusFilter, setAspirationsStatusFilter] = useState('');
  const [aspirationsPage, setAspirationsPage] = useState(1);

  // Reply Modal
  const [replyAspiration, setReplyAspiration] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const [replyStatusSelect, setReplyStatusSelect] = useState('diproses');

  // --- State: Kelola Klaim Barang ---
  const [claimsData, setClaimsData] = useState([]);
  const [claimsMeta, setClaimsMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsSearch, setClaimsSearch] = useState('');
  const [claimsStatusFilter, setClaimsStatusFilter] = useState('');
  const [claimsPage, setClaimsPage] = useState(1);

  // Claim Review Modal
  const [selectedClaimModal, setSelectedClaimModal] = useState(null);
  const [claimVerificationNote, setClaimVerificationNote] = useState('');
  const [claimActionLoading, setClaimActionLoading] = useState(false);

  // --- State: Kelola Komentar Aspirasi ---
  const [commentsData, setCommentsData] = useState([]);
  const [commentsMeta, setCommentsMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsSearch, setCommentsSearch] = useState('');
  const [commentsPage, setCommentsPage] = useState(1);

  // --- State: Kelola FAQ ---
  const [faqsData, setFaqsData] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(false);
  const [faqFormOpen, setFaqFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'general' });

  // Confirmation Modal for destructive actions
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Ya, Lanjutkan',
    isDanger: true,
    onConfirm: () => {},
  });

  // Load Overview Data
  const loadOverview = async () => {
    setOverviewLoading(true);
    try {
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setOverviewLoading(false);
    }
  };

  // Load Students
  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await adminService.getStudents({
        search: studentsSearch,
        status: studentsFilterStatus,
        page: studentsPage,
      });
      setStudentsData(res.data || []);
      setStudentsMeta(res.meta || { current_page: 1, last_page: 1, total: (res.data || []).length });
    } catch (err) {
      console.error(err);
    } finally {
      setStudentsLoading(false);
    }
  };

  // Load Items
  const loadItems = async () => {
    setItemsLoading(true);
    try {
      const res = await adminService.getItems({
        search: itemsSearch,
        type: itemsTypeFilter,
        status: itemsStatusFilter,
        page: itemsPage,
      });
      setItemsData(res.data || []);
      setItemsMeta(res.meta || { current_page: 1, last_page: 1, total: (res.data || []).length });
    } catch (err) {
      console.error(err);
    } finally {
      setItemsLoading(false);
    }
  };

  // Load Aspirations
  const loadAspirations = async () => {
    setAspirationsLoading(true);
    try {
      const res = await adminService.getAspirations({
        search: aspirationsSearch,
        status: aspirationsStatusFilter,
        page: aspirationsPage,
      });
      setAspirationsData(res.data || []);
      setAspirationsMeta(res.meta || { current_page: 1, last_page: 1, total: (res.data || []).length });
    } catch (err) {
      console.error(err);
    } finally {
      setAspirationsLoading(false);
    }
  };

  // Load FAQs
  const loadFaqs = async () => {
    setFaqsLoading(true);
    try {
      const data = await adminService.getFaqs();
      setFaqsData(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFaqsLoading(false);
    }
  };

  // Load Claims
  const loadClaims = async () => {
    setClaimsLoading(true);
    try {
      const res = await adminService.getClaims({
        search: claimsSearch,
        status: claimsStatusFilter,
        page: claimsPage,
      });
      setClaimsData(res.data || []);
      setClaimsMeta(res.meta || { current_page: 1, last_page: 1, total: (res.data || []).length });
    } catch (err) {
      console.error(err);
    } finally {
      setClaimsLoading(false);
    }
  };

  // Load Comments
  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await adminService.getComments({
        search: commentsSearch,
        page: commentsPage,
      });
      setCommentsData(res.data || []);
      setCommentsMeta(res.meta || { current_page: 1, last_page: 1, total: (res.data || []).length });
    } catch (err) {
      console.error(err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadOverview();
  }, []);

  // Trigger loads when tab switches
  useEffect(() => {
    if (activeMenu === 'students') loadStudents();
    if (activeMenu === 'items') loadItems();
    if (activeMenu === 'claims') loadClaims();
    if (activeMenu === 'aspirations') loadAspirations();
    if (activeMenu === 'comments') loadComments();
    if (activeMenu === 'faqs') loadFaqs();
  }, [activeMenu, studentsPage, itemsPage, claimsPage, aspirationsPage, commentsPage]);

  // Handle Action: Toggle Student Active
  const handleToggleStudent = (student) => {
    setConfirmModal({
      isOpen: true,
      title: student.is_active ? 'Nonaktifkan Akun Siswa' : 'Aktifkan Akun Siswa',
      message: `Apakah Anda yakin ingin ${student.is_active ? 'menonaktifkan' : 'mengaktifkan'} akses untuk siswa "${student.name}" (NISN: ${student.nisn || '-'})?`,
      confirmLabel: student.is_active ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
      isDanger: student.is_active,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await adminService.toggleStudentActive(student.id);
          loadStudents();
        } catch (err) {
          alert('Gagal mengubah status siswa.');
        }
      },
    });
  };

  // Handle Action: Delete Student
  const handleDeleteStudent = (student) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Akun Siswa',
      message: `Tindakan ini tidak dapat dibatalkan! Hapus akun siswa "${student.name}" secara permanen dari sistem?`,
      confirmLabel: 'Ya, Hapus Permanen',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteStudent(student.id);
          loadStudents();
          loadOverview();
        } catch (err) {
          alert('Gagal menghapus siswa.');
        }
      },
    });
  };

  // Handle Action: Reset Student Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 8) {
      alert('Kata sandi baru minimal 8 karakter.');
      return;
    }
    try {
      await adminService.resetStudentPassword(resetModalStudent.id, newPasswordInput);
      setResetSuccessMsg(`Kata sandi untuk ${resetModalStudent.name} berhasil diubah.`);
      setTimeout(() => {
        setResetModalStudent(null);
        setNewPasswordInput('');
        setResetSuccessMsg('');
      }, 1500);
    } catch (err) {
      alert('Gagal mereset kata sandi siswa.');
    }
  };

  // Handle Action: Update Item Status
  const handleUpdateItemStatus = async (item, newStatus) => {
    try {
      await adminService.updateItemStatus(item.id, newStatus);
      loadItems();
      loadOverview();
    } catch (err) {
      alert('Gagal memperbarui status barang.');
    }
  };

  // Handle Action: Delete Item
  const handleDeleteItem = (item) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Laporan Lost & Found',
      message: `Hapus laporan "${item.title}" (${item.ticket_number}) dari daftar barang sekolah?`,
      confirmLabel: 'Ya, Hapus Laporan',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteItem(item.id);
          loadItems();
          loadOverview();
        } catch (err) {
          alert('Gagal menghapus laporan barang.');
        }
      },
    });
  };

  // Handle Action: Submit Reply & Status Aspiration
  const handleSaveAspirationReply = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateAspirationStatus(replyAspiration.id, {
        status: replyStatusSelect,
        admin_reply: replyInput,
      });
      setReplyAspiration(null);
      setReplyInput('');
      loadAspirations();
      loadOverview();
    } catch (err) {
      alert('Gagal menyimpan tanggapan aspirasi.');
    }
  };

  // Handle Action: Delete Aspiration
  const handleDeleteAspiration = (asp) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Aspirasi Siswa',
      message: `Hapus laporan aspirasi "${asp.title}" (${asp.ticket_number}) secara permanen?`,
      confirmLabel: 'Ya, Hapus Aspirasi',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteAspiration(asp.id);
          loadAspirations();
          loadOverview();
        } catch (err) {
          alert('Gagal menghapus aspirasi.');
        }
      },
    });
  };

  // Handle Action: Save FAQ (Create or Update)
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert('Pertanyaan dan jawaban wajib diisi.');
      return;
    }
    try {
      if (editingFaq) {
        await adminService.updateFaq(editingFaq.id, faqForm);
      } else {
        await adminService.createFaq(faqForm);
      }
      setFaqFormOpen(false);
      setEditingFaq(null);
      setFaqForm({ question: '', answer: '', category: 'general' });
      loadFaqs();
    } catch (err) {
      alert('Gagal menyimpan FAQ.');
    }
  };

  // Handle Action: Delete FAQ
  const handleDeleteFaq = (faq) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Panduan & FAQ',
      message: `Apakah Anda yakin ingin menghapus pertanyaan: "${faq.question}"?`,
      confirmLabel: 'Ya, Hapus FAQ',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteFaq(faq.id);
          loadFaqs();
        } catch (err) {
          alert('Gagal menghapus FAQ.');
        }
      },
    });
  };

  // Handle Action: Verify Claim
  const handleVerifyClaim = async (claim) => {
    setClaimActionLoading(true);
    try {
      await adminService.verifyClaim(claim.id, claimVerificationNote);
      setSelectedClaimModal(null);
      setClaimVerificationNote('');
      loadClaims();
      loadOverview();
      loadItems();
    } catch (err) {
      alert(err.message || 'Gagal memverifikasi klaim barang.');
    } finally {
      setClaimActionLoading(false);
    }
  };

  // Handle Action: Reject Claim
  const handleRejectClaim = async (claim) => {
    if (!claimVerificationNote.trim()) {
      alert('Mohon cantumkan alasan atau catatan penolakan klaim.');
      return;
    }
    setClaimActionLoading(true);
    try {
      await adminService.rejectClaim(claim.id, claimVerificationNote);
      setSelectedClaimModal(null);
      setClaimVerificationNote('');
      loadClaims();
      loadOverview();
      loadItems();
    } catch (err) {
      alert(err.message || 'Gagal menolak klaim barang.');
    } finally {
      setClaimActionLoading(false);
    }
  };

  // Handle Action: Delete Claim
  const handleDeleteClaim = (claim) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Catatan Klaim',
      message: `Hapus catatan klaim "${claim.claim_number}" atas nama "${claim.claimant_name}"?`,
      confirmLabel: 'Ya, Hapus Klaim',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteClaim(claim.id);
          loadClaims();
          loadOverview();
        } catch (err) {
          alert('Gagal menghapus klaim.');
        }
      },
    });
  };

  // Handle Action: Delete Comment
  const handleDeleteComment = (comment) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus / Moderasi Komentar',
      message: `Hapus komentar dari "${comment.author_name}": "${comment.body.substring(0, 60)}${comment.body.length > 60 ? '...' : ''}"?`,
      confirmLabel: 'Ya, Hapus Komentar',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteComment(comment.id);
          loadComments();
          loadOverview();
        } catch (err) {
          alert('Gagal menghapus komentar.');
        }
      },
    });
  };

  // Handle Action: Export / Download Laporan (Word / Excel)
  const handleExportReport = async (moduleKey, format) => {
    const loadingId = `${moduleKey}-${format}`;
    setExportingKey(loadingId);
    const adminName = user?.name || 'Administrator POSIS';

    try {
      if (moduleKey === 'overview') {
        const data = dashboardData || (await adminService.getDashboard());
        exportAdminReport({
          format,
          reportType: 'Ringkasan_Eksekutif',
          title: 'LAPORAN RINGKASAN EKSEKUTIF & STATISTIK SISTEM POSIS',
          subtitle: 'Rekapitulasi Statistik Siswa, Lost & Found, Aspirasi, dan Tren Bulanan',
          adminName,
          bodyHtml: buildOverviewTableHtml(data),
        });
      } else if (moduleKey === 'all') {
        const [ovRes, stRes, itRes, clRes, aspRes] = await Promise.all([
          dashboardData ? Promise.resolve(dashboardData) : adminService.getDashboard(),
          adminService.getStudents({ per_page: 1000 }),
          adminService.getItems({ per_page: 1000 }),
          adminService.getClaims({ per_page: 1000 }),
          adminService.getAspirations({ per_page: 1000 }),
        ]);

        const combinedHtml = [
          buildOverviewTableHtml(ovRes),
          buildItemsTableHtml(itRes.data || itemsData),
          buildClaimsTableHtml(clRes.data || claimsData),
          buildAspirationsTableHtml(aspRes.data || aspirationsData),
          buildStudentsTableHtml(stRes.data || studentsData),
        ].join('<br/>');

        exportAdminReport({
          format,
          reportType: 'Lengkap_Semua_Modul',
          title: 'LAPORAN LENGKAP MANAJEMEN PORTAL POSIS SMK NEGERI 1 CIOMAS',
          subtitle: 'Rekapitulasi Terpadu: Statistik, Lost & Found, Klaim Barang, Aspirasi Siswa, dan Data Siswa',
          adminName,
          bodyHtml: combinedHtml,
        });
      } else if (moduleKey === 'students') {
        const res = await adminService.getStudents({
          search: studentsSearch,
          status: studentsFilterStatus,
          per_page: 1000,
        });
        const list = res.data?.length ? res.data : studentsData;
        exportAdminReport({
          format,
          reportType: 'Data_Siswa',
          title: 'LAPORAN DATA AKUN PESERTA DIDIK TERDAFTAR',
          subtitle: `Filter Status: ${studentsFilterStatus || 'Semua Status'} | Pencarian: ${studentsSearch || '-'}`,
          adminName,
          bodyHtml: buildStudentsTableHtml(list),
        });
      } else if (moduleKey === 'items') {
        const res = await adminService.getItems({
          search: itemsSearch,
          type: itemsTypeFilter,
          status: itemsStatusFilter,
          per_page: 1000,
        });
        const list = res.data?.length ? res.data : itemsData;
        exportAdminReport({
          format,
          reportType: 'Lost_And_Found',
          title: 'LAPORAN BARANG HILANG & DITEMUKAN (LOST & FOUND)',
          subtitle: `Tipe: ${itemsTypeFilter || 'Semua'} | Status: ${itemsStatusFilter || 'Semua'} | Pencarian: ${itemsSearch || '-'}`,
          adminName,
          bodyHtml: buildItemsTableHtml(list),
        });
      } else if (moduleKey === 'claims') {
        const res = await adminService.getClaims({
          search: claimsSearch,
          status: claimsStatusFilter,
          per_page: 1000,
        });
        const list = res.data?.length ? res.data : claimsData;
        exportAdminReport({
          format,
          reportType: 'Klaim_Barang',
          title: 'LAPORAN VERIFIKASI KLAIM & SERAH TERIMA BARANG PIKET',
          subtitle: `Status Klaim: ${claimsStatusFilter || 'Semua Status'} | Pencarian: ${claimsSearch || '-'}`,
          adminName,
          bodyHtml: buildClaimsTableHtml(list),
        });
      } else if (moduleKey === 'aspirations') {
        const res = await adminService.getAspirations({
          search: aspirationsSearch,
          status: aspirationsStatusFilter,
          per_page: 1000,
        });
        const list = res.data?.length ? res.data : aspirationsData;
        exportAdminReport({
          format,
          reportType: 'Aspirasi_Siswa',
          title: 'LAPORAN ASPIRASI & SUARA SISWA SMK NEGERI 1 CIOMAS',
          subtitle: `Status Penanganan: ${aspirationsStatusFilter || 'Semua Status'} | Pencarian: ${aspirationsSearch || '-'}`,
          adminName,
          bodyHtml: buildAspirationsTableHtml(list),
        });
      } else if (moduleKey === 'comments') {
        const res = await adminService.getComments({
          search: commentsSearch,
          per_page: 1000,
        });
        const list = res.data?.length ? res.data : commentsData;
        exportAdminReport({
          format,
          reportType: 'Komentar_Diskusi',
          title: 'LAPORAN MODERASI KOMENTAR DISKUSI ASPIRASI',
          subtitle: `Pencarian: ${commentsSearch || '-'}`,
          adminName,
          bodyHtml: buildCommentsTableHtml(list),
        });
      } else if (moduleKey === 'faqs') {
        const res = await adminService.getFaqs();
        const list = res?.length ? res : faqsData;
        exportAdminReport({
          format,
          reportType: 'Panduan_FAQ',
          title: 'DAFTAR PANDUAN & TANYA JAWAB (FAQ) RESMI POSIS',
          subtitle: 'Dokumentasi Panduan Layanan Lost & Found dan Aspirasi Siswa',
          adminName,
          bodyHtml: buildFaqsTableHtml(list),
        });
      }
    } catch (err) {
      console.error('Gagal mengekspor laporan:', err);
      alert('Gagal mengunduh laporan. Silakan coba kembali.');
    } finally {
      setExportingKey(null);
    }
  };

  const renderExportButtons = (moduleKey, labelPrefix = 'Export') => (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={exportingKey !== null}
        onClick={() => handleExportReport(moduleKey, 'word')}
        className="px-3 py-1.5 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
        title="Unduh Laporan dalam bentuk Microsoft Word (.doc)"
      >
        <FileText className="w-3.5 h-3.5 text-posis-gold" />
        <span>
          {exportingKey === `${moduleKey}-word` ? 'Mengunduh...' : `${labelPrefix} Word (.doc)`}
        </span>
      </button>
      <button
        type="button"
        disabled={exportingKey !== null}
        onClick={() => handleExportReport(moduleKey, 'excel')}
        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
        title="Unduh Laporan dalam bentuk Microsoft Excel (.xls)"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
        <span>
          {exportingKey === `${moduleKey}-excel` ? 'Mengunduh...' : `${labelPrefix} Excel (.xls)`}
        </span>
      </button>
    </div>
  );

  const navMenuItems = [
    { id: 'overview', label: 'Ringkasan & Grafik', icon: TrendingUp },
    { id: 'students', label: 'Kelola Siswa', icon: Users },
    { id: 'items', label: 'Kelola Lost & Found', icon: Search },
    { id: 'claims', label: 'Kelola Klaim Barang', icon: ShieldCheck },
    { id: 'aspirations', label: 'Kelola Aspirasi', icon: MessageSquare },
    { id: 'comments', label: 'Kelola Komentar Diskusi', icon: MessageSquare },
    { id: 'faqs', label: 'Kelola Panduan & FAQ', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-posis-bone flex flex-col">
      {/* 1. TOP HEADER ADMIN BANNER */}
      <div className="bg-posis-blue text-white border-b-2 border-posis-blue-dark shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button on Mobile */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white hover:bg-posis-blue-dark rounded-[2px] border border-white/20"
              title="Menu Navigasi Admin"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* School Logo */}
            <div className="w-10 h-10 rounded-full bg-white p-1 border border-posis-gold flex items-center justify-center shrink-0">
              <img
                src="/assets/smkn_1_ciomas.jpeg"
                alt="Logo SMKN 1 Ciomas"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  Dashboard Admin POSIS
                </span>
                <span className="hidden sm:inline-block font-mono text-[9px] bg-posis-gold text-posis-ink font-bold px-1.5 py-0.5 rounded-[2px] uppercase">
                  Panel Pengelola
                </span>
              </div>
              <p className="font-mono text-[11px] text-white/80">
                Selamat datang, <strong>{user?.name || 'Administrator'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Display */}
            <div className="hidden md:flex items-center gap-1.5 font-mono text-xs text-white/85 bg-posis-blue-dark/80 px-3 py-1.5 rounded-[2px] border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-posis-gold" />
              <span>{todayFormatted}</span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={requestLogout}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase rounded-[2px] border border-red-800 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Keluar dari Akun Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 bg-white border-2 border-posis-blue editorial-shadow rounded-[2px] p-4 shrink-0 self-start space-y-2`}
        >
          <div className="pb-3 border-b border-stone-200">
            <span className="font-mono text-[10px] text-posis-blue font-bold uppercase tracking-wider block">
              NAVIGASI ADMINISTRASI
            </span>
          </div>

          <nav className="space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono font-bold rounded-[2px] transition-all text-left ${
                    isActive
                      ? 'bg-posis-blue text-white shadow-sm border border-posis-blue'
                      : 'text-stone-700 hover:bg-posis-blue/10 hover:text-posis-blue border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-posis-gold' : 'text-posis-blue'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Info Box */}
          <div className="pt-4 border-t border-stone-200 text-[11px] font-mono text-stone-600 space-y-1.5 bg-stone-50 p-3 rounded-[2px]">
            <div className="flex items-center gap-1.5 font-bold text-posis-blue">
              <ShieldCheck className="w-3.5 h-3.5 text-posis-gold" />
              <span>Otoritas Penuh</span>
            </div>
            <p className="text-[10px] text-stone-500 leading-tight">
              Akses khusus manajemen data sekolah SMK Negeri 1 Ciomas.
            </p>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="flex-1 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & STATS & CHARTS & RECENT ACTIVITY */}
          {/* ========================================================= */}
          {activeMenu === 'overview' && (
            <div className="space-y-6">
              {/* Pusat Ekspor Laporan Resmi (Word & Excel) */}
              <div className="bg-white border-2 border-posis-blue p-5 rounded-[2px] editorial-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-posis-blue" />
                    <h3 className="font-serif text-lg font-bold text-posis-ink">
                      Pusat Unduh &amp; Ekspor Laporan Resmi POSIS
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-stone-500">
                    Unduh rekapitulasi laporan lengkap berformat Kop Surat SMK Negeri 1 Ciomas dalam bentuk Word (.doc) atau Excel (.xls)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {renderExportButtons('overview', 'Ringkasan')}
                  <div className="hidden sm:block h-5 w-px bg-stone-300 mx-1" />
                  {renderExportButtons('all', 'Semua Laporan')}
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* 1. Siswa Terdaftar */}
                <div className="bg-white border-2 border-posis-blue p-5 rounded-[2px] editorial-shadow space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-stone-500">
                      Siswa Terdaftar
                    </span>
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-posis-blue flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-bold text-posis-ink">
                    {overviewLoading ? '...' : dashboardData?.stats?.totalStudents || 0}
                  </div>
                  <p className="font-mono text-[10px] text-stone-500">
                    Akun peserta didik terverifikasi
                  </p>
                </div>

                {/* 2. Lost & Found */}
                <div className="bg-white border-2 border-posis-blue p-5 rounded-[2px] editorial-shadow space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-stone-500">
                      Lost &amp; Found
                    </span>
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-bold text-posis-ink">
                    {overviewLoading ? '...' : dashboardData?.stats?.lostFound?.total || 0}
                  </div>
                  <div className="font-mono text-[10px] text-stone-600 flex items-center gap-1.5 flex-wrap">
                    <span className="text-red-600 font-bold">
                      {dashboardData?.stats?.lostFound?.hilang || 0} Hilang
                    </span>
                    <span>·</span>
                    <span className="text-emerald-700 font-bold">
                      {dashboardData?.stats?.lostFound?.ditemukan || 0} Ditemukan
                    </span>
                    <span>·</span>
                    <span className="text-stone-500">
                      {dashboardData?.stats?.lostFound?.selesai || 0} Selesai
                    </span>
                  </div>
                </div>

                {/* 3. Aspirasi Siswa */}
                <div className="bg-white border-2 border-posis-blue p-5 rounded-[2px] editorial-shadow space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-stone-500">
                      Aspirasi Siswa
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-bold text-posis-ink">
                    {overviewLoading ? '...' : dashboardData?.stats?.aspirations?.total || 0}
                  </div>
                  <div className="font-mono text-[10px] text-stone-600 flex items-center gap-1.5 flex-wrap">
                    <span className="text-blue-600 font-bold">
                      {dashboardData?.stats?.aspirations?.baru || 0} Baru
                    </span>
                    <span>·</span>
                    <span className="text-amber-700 font-bold">
                      {dashboardData?.stats?.aspirations?.diproses || 0} Diproses
                    </span>
                    <span>·</span>
                    <span className="text-emerald-700">
                      {dashboardData?.stats?.aspirations?.selesai || 0} Selesai
                    </span>
                  </div>
                </div>

                {/* 4. Data Panduan & FAQ */}
                <div
                  onClick={() => setActiveMenu('faqs')}
                  className="bg-white border-2 border-posis-blue p-5 rounded-[2px] editorial-shadow space-y-2 cursor-pointer hover:border-posis-gold transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-stone-500">
                      Data Panduan &amp; FAQ
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-bold text-posis-ink">
                    {overviewLoading ? '...' : dashboardData?.stats?.totalFaqs ?? 0}
                  </div>
                  <p className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Pertanyaan panduan resmi tersedia
                  </p>
                </div>
              </div>

              {/* Monthly Trend Chart */}
              <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-posis-ink">
                      Tren Laporan &amp; Aspirasi 6 Bulan Terakhir
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Perbandingan jumlah laporan Lost &amp; Found dan Aspirasi masuk
                    </p>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-[#1F3F94] inline-block rounded-[1px]" />
                      <span>Lost &amp; Found</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-[#F2B705] inline-block rounded-[1px]" />
                      <span>Aspirasi</span>
                    </div>
                  </div>
                </div>

                {/* Lightweight SVG Bar Chart */}
                <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 px-2">
                  {(() => {
                    const trends = dashboardData?.monthlyTrends || [];
                    const maxVal = Math.max(
                      ...trends.flatMap((t) => [Number(t.lostFound) || 0, Number(t.aspiration) || 0]),
                      5
                    );
                    return trends.map((bar, idx) => {
                      const lfVal = Number(bar.lostFound) || 0;
                      const aspVal = Number(bar.aspiration) || 0;
                      const lfHeight = lfVal > 0 ? Math.max(Math.round((lfVal / maxVal) * 170), 12) : 4;
                      const aspHeight = aspVal > 0 ? Math.max(Math.round((aspVal / maxVal) * 170), 12) : 4;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full flex items-end justify-center gap-1.5 h-48 border-b border-stone-200 pb-1">
                            {/* Lost & Found Bar */}
                            <div
                              style={{ height: `${lfHeight}px` }}
                              className="w-5 sm:w-8 bg-[#1F3F94] hover:bg-posis-blue-dark transition-all rounded-t-[2px] relative flex justify-center"
                              title={`Lost & Found (${bar.month}): ${lfVal} Laporan`}
                            >
                              <span className=" absolute -top-5 font-mono text-[9px] font-bold text-posis-blue bg-white px-1 border border-posis-blue shadow-xs">
                                {lfVal}
                              </span>
                            </div>
                            {/* Aspirasi Bar */}
                            <div
                              style={{ height: `${aspHeight}px` }}
                              className="w-5 sm:w-8 bg-[#F2B705] hover:bg-posis-gold-hover transition-all rounded-t-[2px] relative flex justify-center"
                              title={`Aspirasi (${bar.month}): ${aspVal} Aspirasi`}
                            >
                              <span className="absolute -top-5 font-mono text-[9px] font-bold text-amber-800 bg-white px-1 border border-amber-400 shadow-xs">
                                {aspVal}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-stone-600 text-center">
                            {bar.month}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-posis-ink">
                      Aktivitas Terbaru Sistem
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      8 pembaruan dan laporan terakhir dari peserta didik
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadOverview}
                    className="p-1.5 text-stone-600 hover:text-posis-blue hover:bg-stone-100 rounded-[2px]"
                    title="Perbarui Data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-stone-200">
                  {dashboardData?.recentActivities?.length ? (
                    dashboardData.recentActivities.map((act) => (
                      <div key={act.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-posis-ink">{act.title}</p>
                          <p className="font-mono text-stone-500 text-[11px]">
                            Oleh: {act.author} · {act.created_at}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded-[2px] shrink-0 border ${
                            act.badgeColor === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : act.badgeColor === 'red'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : act.badgeColor === 'amber'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-blue-50 text-posis-blue border-blue-300'
                          }`}
                        >
                          {act.badge}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center font-mono text-xs text-stone-500">
                      Belum ada aktivitas terbaru hari ini.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: KELOLA SISWA */}
          {/* ========================================================= */}
          {activeMenu === 'students' && (
            <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-posis-ink">
                    Manajemen Akun Siswa
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Kelola data, status aktif, dan reset kata sandi peserta didik
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderExportButtons('students', 'Export')}
                  <button
                    type="button"
                    onClick={loadStudents}
                    className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5 text-stone-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={studentsSearch}
                    onChange={(e) => setStudentsSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadStudents()}
                    placeholder="Cari berdasarkan nama, NISN, atau email..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none focus:border-posis-blue"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={studentsFilterStatus}
                  onChange={(e) => {
                    setStudentsFilterStatus(e.target.value);
                    setStudentsPage(1);
                  }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none font-mono text-stone-700 bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setStudentsPage(1);
                    loadStudents();
                  }}
                  className="px-4 py-2 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-xs font-bold uppercase rounded-[2px]"
                >
                  Cari
                </button>
              </div>

              {/* Table Siswa */}
              <div className="overflow-x-auto border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 font-mono text-stone-700 uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">NIS / NISN</th>
                      <th className="p-3">Kelas / Jurusan</th>
                      <th className="p-3">Email</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {studentsLoading ? (
                      <tr>
                        <td colSpan="6" className="p-6 text-center font-mono text-stone-500">
                          Memuat data siswa...
                        </td>
                      </tr>
                    ) : studentsData.length ? (
                      studentsData.map((st) => (
                        <tr key={st.id} className="hover:bg-stone-50">
                          <td className="p-3 font-semibold text-posis-ink">{st.name}</td>
                          <td className="p-3 font-mono text-posis-blue font-bold">{st.nisn || '-'}</td>
                          <td className="p-3 font-mono text-stone-600">{st.class_or_division || '-'}</td>
                          <td className="p-3 text-stone-600">{st.email}</td>
                          <td className="p-3 text-center font-mono">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-[2px] border ${
                                st.is_active
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-red-50 text-red-700 border-red-300'
                              }`}
                            >
                              {st.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Toggle Active */}
                              <button
                                type="button"
                                onClick={() => handleToggleStudent(st)}
                                title={st.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                                className="p-1.5 border border-stone-300 hover:bg-stone-100 rounded-[2px] text-stone-600"
                              >
                                {st.is_active ? (
                                  <ToggleRight className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4 text-stone-400" />
                                )}
                              </button>
                              {/* Reset Password */}
                              <button
                                type="button"
                                onClick={() => {
                                  setResetModalStudent(st);
                                  setNewPasswordInput('');
                                  setResetSuccessMsg('');
                                }}
                                title="Reset Kata Sandi"
                                className="p-1.5 border border-stone-300 hover:bg-amber-50 hover:text-amber-700 rounded-[2px] text-stone-600"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(st)}
                                title="Hapus Akun Siswa"
                                className="p-1.5 border border-stone-300 hover:bg-red-50 hover:text-red-700 rounded-[2px] text-stone-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-6 text-center font-mono text-stone-500">
                          Belum ada data siswa ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-2">
                <span>Total: {studentsMeta.total} Siswa</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={studentsPage <= 1}
                    onClick={() => setStudentsPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>
                    Halaman {studentsMeta.current_page} dari {studentsMeta.last_page || 1}
                  </span>
                  <button
                    disabled={studentsPage >= studentsMeta.last_page}
                    onClick={() => setStudentsPage((p) => p + 1)}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: KELOLA LOST & FOUND */}
          {/* ========================================================= */}
          {activeMenu === 'items' && (
            <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-posis-ink">
                    Kelola Laporan Lost &amp; Found
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Moderasi status barang hilang / ditemukan dan verifikasi penyelesaian
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderExportButtons('items', 'Export')}
                  <button
                    type="button"
                    onClick={loadItems}
                    className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5 text-stone-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2 relative">
                  <input
                    type="text"
                    value={itemsSearch}
                    onChange={(e) => setItemsSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadItems()}
                    placeholder="Cari judul barang, lokasi, atau deskripsi..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none focus:border-posis-blue"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={itemsTypeFilter}
                  onChange={(e) => {
                    setItemsTypeFilter(e.target.value);
                    setItemsPage(1);
                  }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none font-mono text-stone-700 bg-white"
                >
                  <option value="">Semua Tipe</option>
                  <option value="hilang">Barang Hilang</option>
                  <option value="ditemukan">Barang Ditemukan</option>
                </select>
                <select
                  value={itemsStatusFilter}
                  onChange={(e) => {
                    setItemsStatusFilter(e.target.value);
                    setItemsPage(1);
                  }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none font-mono text-stone-700 bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="tersedia">Tersedia / Aktif</option>
                  <option value="selesai">Selesai / Diklaim</option>
                </select>
              </div>

              {/* Table Barang */}
              <div className="overflow-x-auto border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 font-mono text-stone-700 uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-3">Tiket</th>
                      <th className="p-3">Nama Barang</th>
                      <th className="p-3">Tipe</th>
                      <th className="p-3">Lokasi Kejadian</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Ubah Status &amp; Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {itemsLoading ? (
                      <tr>
                        <td colSpan="6" className="p-6 text-center font-mono text-stone-500">
                          Memuat laporan barang...
                        </td>
                      </tr>
                    ) : itemsData.length ? (
                      itemsData.map((it) => (
                        <tr key={it.id} className="hover:bg-stone-50">
                          <td className="p-3 font-mono font-bold text-posis-blue">{it.ticket_number}</td>
                          <td className="p-3 font-semibold text-posis-ink max-w-xs">
                            <div className="flex items-center gap-2">
                              {it.photo_url && (
                                <img
                                  src={it.photo_url}
                                  alt={it.title}
                                  className="w-8 h-8 rounded-[2px] object-cover border border-stone-300 shrink-0"
                                />
                              )}
                              <span>{it.title}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono uppercase">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] border ${
                                it.type === 'hilang'
                                  ? 'bg-red-50 text-red-700 border-red-300'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              }`}
                            >
                              {it.type}
                            </span>
                          </td>
                          <td className="p-3 text-stone-600">{it.location || '-'}</td>
                          <td className="p-3 font-mono">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-[2px] border ${
                                it.status === 'selesai'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              {it.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {it.status === 'selesai' ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemStatus(it, 'tersedia')}
                                  title="Kembalikan status barang menjadi aktif/tersedia"
                                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] font-bold uppercase rounded-[2px]"
                                >
                                  Buka Kembali
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemStatus(it, 'selesai')}
                                  title="Tandai barang telah diserahterimakan / selesai"
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold uppercase rounded-[2px]"
                                >
                                  Tandai Selesai
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(it)}
                                title="Hapus Laporan Tidak Pantas"
                                className="p-1 border border-stone-300 hover:bg-red-50 hover:text-red-700 rounded-[2px] text-stone-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-6 text-center font-mono text-stone-500">
                          Belum ada data laporan barang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-2">
                <span>Total: {itemsMeta.total} Laporan Barang</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={itemsPage <= 1}
                    onClick={() => setItemsPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>
                    Halaman {itemsMeta.current_page} dari {itemsMeta.last_page || 1}
                  </span>
                  <button
                    disabled={itemsPage >= itemsMeta.last_page}
                    onClick={() => setItemsPage((p) => p + 1)}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3.5: KELOLA KLAIM BARANG (LOST & FOUND) */}
          {/* ========================================================= */}
          {activeMenu === 'claims' && (
            <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-posis-ink">
                    Kelola Klaim Barang (Lost &amp; Found)
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Daftar klaim kepemilikan barang dari siswa dengan verifikasi ciri khusus rahasia
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderExportButtons('claims', 'Export')}
                  <button
                    type="button"
                    onClick={loadClaims}
                    className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5 text-stone-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={claimsSearch}
                    onChange={(e) => setClaimsSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadClaims()}
                    placeholder="Cari berdasarkan nama lengkap, nomor klaim, atau nama barang..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none focus:border-posis-blue"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={claimsStatusFilter}
                  onChange={(e) => {
                    setClaimsStatusFilter(e.target.value);
                    setClaimsPage(1);
                  }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none font-mono text-stone-700 bg-white"
                >
                  <option value="">Semua Status Klaim</option>
                  <option value="menunggu">Menunggu Verifikasi</option>
                  <option value="terverifikasi">Terverifikasi (Diserahkan)</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              {/* Claims Table */}
              <div className="overflow-x-auto border border-stone-200 rounded-[2px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-posis-bone font-mono uppercase text-[11px] text-posis-ink border-b border-stone-200">
                    <tr>
                      <th className="p-3">No. Klaim</th>
                      <th className="p-3">Nama Lengkap Pengklaim</th>
                      <th className="p-3">Barang yang Diklaim</th>
                      <th className="p-3">Ciri Khusus Rahasia</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {claimsLoading ? (
                      <tr>
                        <td colSpan="6" className="p-6 text-center font-mono text-stone-500">
                          Memuat data klaim barang...
                        </td>
                      </tr>
                    ) : claimsData.length ? (
                      claimsData.map((cl) => (
                        <tr key={cl.id} className="hover:bg-stone-50/80">
                          <td className="p-3 font-mono font-bold text-posis-blue whitespace-nowrap">
                            <div>{cl.claim_number}</div>
                            <div className="text-[10px] text-stone-400 font-normal">{cl.created_at}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-posis-ink text-sm">{cl.claimant_name}</div>
                            <div className="font-mono text-[10px] text-stone-500">
                              NISN: {cl.claimant_nisn} · {cl.claimant_class}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-posis-ink">{cl.item_title}</div>
                            <div className="font-mono text-[10px] text-stone-500">
                              Tiket: {cl.item_ticket} · Lokasi: {cl.item_location}
                            </div>
                            <div className="font-mono text-[10px] text-amber-700 font-bold mt-0.5">
                              Lokasi Piket: {cl.item_handover_point}
                            </div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="p-2 bg-stone-50 border border-stone-200 rounded-[2px] text-stone-700 text-xs italic">
                              "{cl.proof_description}"
                            </div>
                            {cl.verification_note && (
                              <div className="mt-1 font-mono text-[10px] text-stone-500">
                                Catatan: <strong>{cl.verification_note}</strong>
                              </div>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded-[2px] border ${
                                cl.status === 'terverifikasi'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : cl.status === 'ditolak'
                                  ? 'bg-red-50 text-red-700 border-red-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              {cl.status === 'terverifikasi'
                                ? 'Terverifikasi'
                                : cl.status === 'ditolak'
                                ? 'Ditolak'
                                : 'Menunggu Verifikasi'}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedClaimModal(cl);
                                  setClaimVerificationNote(cl.verification_note || '');
                                }}
                                title="Tinjau & Verifikasi Klaim"
                                className="px-2.5 py-1 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-[10px] font-bold uppercase rounded-[2px] flex items-center gap-1 shadow-sm"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                <span>Tinjau</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClaim(cl)}
                                title="Hapus Catatan Klaim"
                                className="p-1 border border-stone-300 hover:bg-red-50 hover:text-red-700 rounded-[2px] text-stone-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-6 text-center font-mono text-stone-500">
                          Belum ada data klaim barang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-2">
                <span>Total: {claimsMeta.total} Pengajuan Klaim</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={claimsPage <= 1}
                    onClick={() => setClaimsPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>
                    Halaman {claimsMeta.current_page} dari {claimsMeta.last_page || 1}
                  </span>
                  <button
                    disabled={claimsPage >= claimsMeta.last_page}
                    onClick={() => setClaimsPage((p) => p + 1)}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: KELOLA ASPIRASI */}
          {/* ========================================================= */}
          {activeMenu === 'aspirations' && (
            <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-posis-ink">
                    Kelola Aspirasi &amp; Suara Siswa
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Tinjau aspirasi masuk, ubah status proses, dan berikan balasan resmi sekolah
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderExportButtons('aspirations', 'Export')}
                  <button
                    type="button"
                    onClick={loadAspirations}
                    className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5 text-stone-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <input
                    type="text"
                    value={aspirationsSearch}
                    onChange={(e) => setAspirationsSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadAspirations()}
                    placeholder="Cari aspirasi berdasarkan judul atau isi..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none focus:border-posis-blue"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={aspirationsStatusFilter}
                  onChange={(e) => {
                    setAspirationsStatusFilter(e.target.value);
                    setAspirationsPage(1);
                  }}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none font-mono text-stone-700 bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="menunggu_review">Menunggu Review</option>
                  <option value="diproses">Diproses</option>
                  <option value="ditindaklanjuti">Selesai / Ditindaklanjuti</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              {/* Aspirations Feed */}
              <div className="space-y-4">
                {aspirationsLoading ? (
                  <div className="p-8 text-center font-mono text-xs text-stone-500">
                    Memuat data aspirasi...
                  </div>
                ) : aspirationsData.length ? (
                  aspirationsData.map((asp) => (
                    <div
                      key={asp.id}
                      className="p-4 border-2 border-stone-200 rounded-[2px] bg-stone-50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-posis-blue">
                              {asp.ticket_number}
                            </span>
                            <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded-[2px]">
                              {asp.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-posis-ink mt-1">{asp.title}</h4>
                        </div>
                        <span className="px-2.5 py-1 font-mono text-xs font-bold uppercase rounded-[2px] border bg-blue-50 text-posis-blue border-blue-300 self-start">
                          {asp.status}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 bg-white p-3 border border-stone-200 rounded-[2px] leading-relaxed">
                        {asp.body}
                      </p>

                      {asp.admin_reply && (
                        <div className="bg-blue-50/70 border border-posis-blue/30 p-3 rounded-[2px] text-xs">
                          <span className="font-mono text-[10px] font-bold text-posis-blue uppercase block mb-1">
                            Tanggapan Resmi Sekolah:
                          </span>
                          <p className="text-stone-800 italic">{asp.admin_reply}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                        <span className="font-mono text-[11px] text-stone-500">
                          {asp.upvotes_count || 0} Dukungan Siswa
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyAspiration(asp);
                              setReplyInput(asp.admin_reply || '');
                              setReplyStatusSelect(asp.status || 'diproses');
                            }}
                            className="px-3 py-1.5 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-xs font-bold uppercase rounded-[2px]"
                          >
                            Tanggapi / Ubah Status
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAspiration(asp)}
                            className="p-1.5 border border-stone-300 hover:bg-red-50 hover:text-red-700 rounded-[2px] text-stone-600"
                            title="Hapus Aspirasi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center font-mono text-xs text-stone-500">
                    Belum ada data aspirasi masuk.
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-2">
                <span>Total: {aspirationsMeta.total} Aspirasi</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={aspirationsPage <= 1}
                    onClick={() => setAspirationsPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>
                    Halaman {aspirationsMeta.current_page} dari {aspirationsMeta.last_page || 1}
                  </span>
                  <button
                    disabled={aspirationsPage >= aspirationsMeta.last_page}
                    onClick={() => setAspirationsPage((p) => p + 1)}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4.5: KELOLA KOMENTAR DISKUSI ASPIRASI */}
          {/* ========================================================= */}
          {activeMenu === 'comments' && (
            <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-posis-ink">
                    Kelola Komentar Diskusi Aspirasi
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Moderasi dan pantau tanggapan/komentar warga sekolah pada artikel aspirasi
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderExportButtons('comments', 'Export')}
                  <button
                    type="button"
                    onClick={loadComments}
                    className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 font-mono text-xs font-bold rounded-[2px] flex items-center gap-1.5 text-stone-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Search Control */}
              <div className="relative">
                <input
                  type="text"
                  value={commentsSearch}
                  onChange={(e) => setCommentsSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadComments()}
                  placeholder="Cari komentar berdasarkan isi, nama penulis, atau judul aspirasi..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none focus:border-posis-blue"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>

              {/* Comments List / Table */}
              <div className="overflow-x-auto border border-stone-200 rounded-[2px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-posis-bone font-mono uppercase text-[11px] text-posis-ink border-b border-stone-200">
                    <tr>
                      <th className="p-3">Penulis Komentar</th>
                      <th className="p-3">Aspirasi Terkait</th>
                      <th className="p-3">Isi Tanggapan / Komentar</th>
                      <th className="p-3">Waktu</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {commentsLoading ? (
                      <tr>
                        <td colSpan="5" className="p-6 text-center font-mono text-stone-500">
                          Memuat komentar diskusi...
                        </td>
                      </tr>
                    ) : commentsData.length ? (
                      commentsData.map((cm) => (
                        <tr key={cm.id} className="hover:bg-stone-50/80">
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-bold text-posis-ink">{cm.author_name}</div>
                            <div className="font-mono text-[10px] text-stone-500">
                              {cm.author_class} {cm.is_official_reply && <span className="text-posis-blue font-bold">(Resmi)</span>}
                            </div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="font-semibold text-posis-ink truncate">{cm.aspiration_title}</div>
                            <div className="font-mono text-[10px] text-stone-500">{cm.aspiration_ticket}</div>
                          </td>
                          <td className="p-3 max-w-md">
                            <p className="text-stone-700 text-xs whitespace-pre-wrap">{cm.body}</p>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-stone-400 whitespace-nowrap">
                            {cm.created_at}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(cm)}
                              title="Hapus / Moderasi Komentar"
                              className="px-2 py-1 border border-stone-300 hover:bg-red-50 hover:text-red-700 text-stone-600 rounded-[2px] font-mono text-[10px] font-bold flex items-center gap-1 ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-6 text-center font-mono text-stone-500">
                          Belum ada komentar diskusi pada aspirasi warga sekolah.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-2">
                <span>Total: {commentsMeta.total} Komentar Diskusi</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={commentsPage <= 1}
                    onClick={() => setCommentsPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>
                    Halaman {commentsMeta.current_page} dari {commentsMeta.last_page || 1}
                  </span>
                  <button
                    disabled={commentsPage >= commentsMeta.last_page}
                    onClick={() => setCommentsPage((p) => p + 1)}
                    className="p-1.5 border border-stone-300 rounded-[2px] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: KELOLA PANDUAN & FAQ */}
          {/* ========================================================= */}
          {activeMenu === 'faqs' && (
            <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 editorial-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-posis-ink">
                    Kelola Panduan &amp; FAQ
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Tambah, perbarui, atau hapus konten tanya-jawab untuk panduan siswa
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderExportButtons('faqs', 'Export')}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaq(null);
                      setFaqForm({ question: '', answer: '', category: 'general' });
                      setFaqFormOpen(true);
                    }}
                    className="px-4 py-1.5 bg-posis-gold hover:bg-posis-gold-hover text-posis-ink border border-posis-ink font-mono text-xs font-bold uppercase rounded-[2px] flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah FAQ Baru</span>
                  </button>
                </div>
              </div>

              {/* FAQ Form (Create / Edit) */}
              {faqFormOpen && (
                <form
                  onSubmit={handleSaveFaq}
                  className="bg-posis-bone border-2 border-posis-blue p-5 rounded-[2px] space-y-3"
                >
                  <h4 className="font-serif text-lg font-bold text-posis-ink">
                    {editingFaq ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}
                  </h4>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                      Pertanyaan
                    </label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      placeholder="Contoh: Bagaimana prosedur mengambil barang di ruang piket?"
                      className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-[2px] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                      Jawaban Resmi
                    </label>
                    <textarea
                      rows={3}
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      placeholder="Tulis penjelasan lengkap yang mudah dipahami peserta didik..."
                      className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-[2px] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFaqFormOpen(false)}
                      className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-200 font-mono text-xs font-bold uppercase rounded-[2px]"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-xs font-bold uppercase rounded-[2px]"
                    >
                      Simpan FAQ
                    </button>
                  </div>
                </form>
              )}

              {/* FAQs List */}
              <div className="divide-y divide-stone-200 border border-stone-200">
                {faqsLoading ? (
                  <div className="p-8 text-center font-mono text-xs text-stone-500">
                    Memuat FAQ...
                  </div>
                ) : faqsData.length ? (
                  faqsData.map((faq) => (
                    <div key={faq.id} className="p-4 bg-white hover:bg-stone-50 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-posis-ink">{faq.question}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFaq(faq);
                            setFaqForm({
                              question: faq.question,
                              answer: faq.answer,
                              category: faq.category || 'general',
                            });
                            setFaqFormOpen(true);
                          }}
                          className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 font-mono text-[11px] font-bold rounded-[2px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(faq)}
                          className="p-1.5 border border-stone-300 hover:bg-red-50 hover:text-red-700 rounded-[2px] text-stone-600"
                          title="Hapus FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center font-mono text-xs text-stone-500">
                    Belum ada konten FAQ.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: RESET PASSWORD SISWA */}
      {/* ========================================================= */}
      {resetModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-posis-ink/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border-2 border-posis-blue editorial-shadow p-6 rounded-[2px] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[2px] bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-posis-ink">Reset Kata Sandi</h3>
                <p className="font-mono text-xs text-stone-500">Siswa: {resetModalStudent.name}</p>
              </div>
            </div>

            {resetSuccessMsg ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-[2px] text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{resetSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                    Kata Sandi Baru (Min. 8 Karakter)
                  </label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Masukkan sandi baru untuk siswa"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-[2px] outline-none focus:border-posis-blue"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalStudent(null)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 font-mono text-xs font-bold uppercase rounded-[2px]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-xs font-bold uppercase rounded-[2px]"
                  >
                    Simpan Sandi Baru
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TANGGAPAN ASPIRASI */}
      {/* ========================================================= */}
      {replyAspiration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-posis-ink/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border-2 border-posis-blue editorial-shadow p-6 rounded-[2px] space-y-4">
            <h3 className="font-serif text-xl font-bold text-posis-ink">
              Tanggapan &amp; Pembaruan Status Aspirasi
            </h3>
            <p className="font-mono text-xs text-stone-500">
              Tiket: {replyAspiration.ticket_number} · "{replyAspiration.title}"
            </p>

            <form onSubmit={handleSaveAspirationReply} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                  Ubah Status Penanganan
                </label>
                <select
                  value={replyStatusSelect}
                  onChange={(e) => setReplyStatusSelect(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-[2px] outline-none font-mono"
                >
                  <option value="diproses">DIPROSES (Sedang dalam penanganan)</option>
                  <option value="ditindaklanjuti">SELESAI / TELAH DITINDAKLANJUTI</option>
                  <option value="ditolak">DITOLAK (Tidak sesuai pedoman)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                  Tulis Balasan / Tanggapan Resmi Sekolah
                </label>
                <textarea
                  rows={4}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Sampaikan langkah tindak lanjut atau klarifikasi dari pihak sekolah/kesiswaan..."
                  className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-[2px] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyAspiration(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 font-mono text-xs font-bold uppercase rounded-[2px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-posis-blue hover:bg-posis-blue-dark text-white font-mono text-xs font-bold uppercase rounded-[2px]"
                >
                  Simpan &amp; Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DIALOG KONFIRMASI AKSI BERBAHAYA */}
      {/* ========================================================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-posis-ink/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border-2 border-posis-blue editorial-shadow p-6 rounded-[2px] space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-[2px] flex items-center justify-center shrink-0 border ${
                  confirmModal.isDanger
                    ? 'bg-red-100 text-red-600 border-red-300'
                    : 'bg-amber-100 text-amber-700 border-amber-300'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-posis-ink">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 font-mono text-xs font-bold uppercase rounded-[2px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2 text-white font-mono text-xs font-bold uppercase rounded-[2px] border ${
                  confirmModal.isDanger
                    ? 'bg-red-600 hover:bg-red-700 border-red-800'
                    : 'bg-posis-blue hover:bg-posis-blue-dark border-posis-blue-dark'
                }`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VERIFIKASI / TINJAU KLAIM BARANG */}
      {/* ========================================================= */}
      {selectedClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-posis-ink/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border-2 border-posis-blue editorial-shadow p-6 rounded-[2px] space-y-4">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-posis-blue uppercase font-bold tracking-wider">
                  VERIFIKASI SERAH TERIMA PIKET
                </span>
                <h3 className="font-serif text-xl font-bold text-posis-ink mt-0.5">
                  Tinjau Klaim: {selectedClaimModal.claim_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClaimModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Pengklaim & Barang */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-posis-bone border border-stone-300 rounded-[2px] text-xs">
              <div>
                <span className="font-mono text-[10px] text-stone-500 uppercase block font-bold">
                  Nama Lengkap Pengklaim:
                </span>
                <p className="font-bold text-posis-ink text-sm">{selectedClaimModal.claimant_name}</p>
                <p className="font-mono text-[10px] text-stone-500">
                  {selectedClaimModal.claimant_class} (NISN: {selectedClaimModal.claimant_nisn})
                </p>
                <p className="font-mono text-[10px] text-stone-400">
                  Email: {selectedClaimModal.claimant_email}
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-stone-500 uppercase block font-bold">
                  Barang yang Diklaim:
                </span>
                <p className="font-bold text-posis-ink text-sm">{selectedClaimModal.item_title}</p>
                <p className="font-mono text-[10px] text-stone-500">
                  Tiket: {selectedClaimModal.item_ticket}
                </p>
                <p className="font-mono text-[10px] text-amber-800 font-bold mt-1">
                  Titik: {selectedClaimModal.item_handover_point}
                </p>
              </div>
            </div>

            {/* Ciri Khusus Rahasia */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-stone-700 mb-1">
                Ciri Khusus Rahasia yang Diberikan Siswa:
              </label>
              <div className="p-3 bg-amber-50/70 border border-posis-gold rounded-[2px] text-xs text-amber-950 font-medium leading-relaxed">
                "{selectedClaimModal.proof_description}"
              </div>
            </div>

            {/* Catatan Verifikasi */}
            <div className="space-y-1">
              <label className="block font-mono text-xs font-bold uppercase text-stone-700">
                Catatan Verifikasi Petugas Piket / Alasan Penolakan:
              </label>
              <textarea
                rows={3}
                value={claimVerificationNote}
                onChange={(e) => setClaimVerificationNote(e.target.value)}
                placeholder="Tuliskan catatan verifikasi, misal: 'Ciri stiker cocok, kartu pelajar terverifikasi, barang diserahkan ke siswa.'"
                className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-[2px] outline-none focus:border-posis-blue"
              />
            </div>

            {/* Tombol Aksi Verifikasi */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedClaimModal(null)}
                className="w-full sm:w-auto px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 font-mono text-xs font-bold uppercase rounded-[2px]"
              >
                Tutup
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  disabled={claimActionLoading}
                  onClick={() => handleRejectClaim(selectedClaimModal)}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase rounded-[2px] disabled:opacity-50"
                >
                  Tolak Klaim
                </button>
                <button
                  type="button"
                  disabled={claimActionLoading}
                  onClick={() => handleVerifyClaim(selectedClaimModal)}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold uppercase rounded-[2px] flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verifikasi &amp; Serahkan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
