'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SITE_CONFIG } from '../../config/site';
import { itemsService } from '../../services/itemsService';
import { CheckCircle2, AlertCircle, Camera, UploadCloud, X } from 'lucide-react';

export function ItemReportModal({ isOpen, onClose, onSuccess, initialType = 'hilang' }) {
  const [type, setType] = useState(initialType);
  const [formData, setFormData] = useState({
    title: '',
    category: 'alat_tulis',
    location: '',
    event_date: new Date().toISOString().split('T')[0],
    description: '',
    handover_point: 'ruang_piket',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran foto maksimal 5MB.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      setErrorMsg('Mohon lengkapi semua kolom wajib.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('type', type);
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('event_date', formData.event_date);
      data.append('description', formData.description);
      if (type === 'ditemukan') {
        data.append('handover_point', formData.handover_point);
      }
      if (photoFile) {
        data.append('photo', photoFile);
      }

      const res = await itemsService.createItem(data);
      setSuccessTicket(res.ticket_number || 'POSIS-LF-BERHASIL');
      if (onSuccess) onSuccess(res);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirim laporan. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessTicket(null);
    setFormData({
      title: '',
      category: 'alat_tulis',
      location: '',
      event_date: new Date().toISOString().split('T')[0],
      description: '',
      handover_point: 'ruang_piket',
    });
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={successTicket ? "Laporan Terkirim" : "Formulir Lapor Barang"}
      maxWidth="max-w-xl"
    >
      {successTicket ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-posis-found border-2 border-posis-found rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-serif text-2xl font-bold text-posis-blue">Laporan Berhasil Diterbitkan</h4>
            <p className="text-sm text-stone-600 mt-1">
              Nomor tiket resmi pencatatan sistem POSIS SMKN 1 Ciomas:
            </p>
            <div className="inline-block mt-3 px-4 py-2 bg-posis-blue text-white font-mono text-base font-bold tracking-wider rounded-[2px] editorial-shadow-gold">
              {successTicket}
            </div>
          </div>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Laporan Anda telah masuk ke katalog aktif dan sedang disinkronkan ke ruang piket sekolah. Pantau berkala untuk update klaim.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={handleResetAndClose} className="w-full sm:w-auto">
              Selesai &amp; Tutup
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-posis-lost text-posis-lost text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Toggle Jenis Laporan */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200 border border-stone-300 rounded-[2px]">
            <button
              type="button"
              onClick={() => setType('hilang')}
              className={`py-2 text-xs font-mono font-bold uppercase transition-all rounded-[2px] ${
                type === 'hilang'
                  ? 'bg-posis-lost text-white shadow-sm'
                  : 'text-stone-700 hover:text-posis-ink'
              }`}
            >
              Saya Kehilangan Barang
            </button>
            <button
              type="button"
              onClick={() => setType('ditemukan')}
              className={`py-2 text-xs font-mono font-bold uppercase transition-all rounded-[2px] ${
                type === 'ditemukan'
                  ? 'bg-posis-found text-white shadow-sm'
                  : 'text-stone-700 hover:text-posis-ink'
              }`}
            >
              Saya Menemukan Barang
            </button>
          </div>

          {/* Nama Barang */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Nama Barang <span className="text-posis-lost">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Kunci Motor Honda Beat dengan Gantungan Biru"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kategori */}
            <div>
              <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
                Kategori <span className="text-posis-lost">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
              >
                {SITE_CONFIG.categories.items
                  .filter((c) => c.id !== 'semua')
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Tanggal Kejadian */}
            <div>
              <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
                Tanggal Kejadian <span className="text-posis-lost">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
              />
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Lokasi Kejadian / Penemuan <span className="text-posis-lost">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Contoh: Kantin Sehat Meja Pojok, R. Praktik RPL 2, dsb."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            />
          </div>

          {/* Titik Serah (Wajib jika 'Ditemukan') */}
          {type === 'ditemukan' && (
            <div className="p-3 bg-amber-50 border border-posis-gold rounded-[2px] space-y-1.5">
              <label className="block text-xs font-mono uppercase font-bold text-amber-900">
                Tempat Penyimpanan Fisik (Wajib untuk Barang Ditemukan)
              </label>
              <select
                value={formData.handover_point}
                onChange={(e) => setFormData({ ...formData, handover_point: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-posis-gold focus:border-posis-blue rounded-[2px] outline-none"
              >
                {SITE_CONFIG.handoverLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label} ({loc.hours})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-amber-800">
                Harap segera titipkan barang fisik ke petugas piket/satpam agar aman saat pemilik datang mengklaim.
              </p>
            </div>
          )}

          {/* Unggah Foto / Gambar Barang (Sangat Dianjurkan untuk Barang Ditemukan) */}
          <div className="space-y-1.5 p-3 bg-stone-50 border border-stone-300 rounded-[2px]">
            <label className="block text-xs font-mono uppercase font-bold text-posis-blue flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-posis-blue" />
                Foto / Dokumentasi Barang {type === 'ditemukan' ? '(Sangat Dianjurkan untuk Temuan)' : '(Opsional)'}
              </span>
              <span className="text-[10px] text-stone-500 font-normal">Maks. 5MB (JPG/PNG/WEBP)</span>
            </label>

            {photoPreview ? (
              <div className="relative mt-2 border border-posis-blue/40 rounded-[2px] overflow-hidden bg-stone-100 flex items-center justify-center max-h-48 group">
                <img
                  src={photoPreview}
                  alt="Pratinjau Foto Barang"
                  className="max-h-48 w-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-[2px] text-xs font-mono flex items-center gap-1 hover:bg-red-700 shadow-sm"
                  title="Hapus foto ini"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Hapus Foto</span>
                </button>
              </div>
            ) : (
              <label className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 hover:border-posis-blue rounded-[2px] cursor-pointer bg-white transition-colors">
                <UploadCloud className="w-6 h-6 text-stone-400 mb-1" />
                <span className="text-xs text-stone-700 font-medium">Klik untuk memilih file foto barang</span>
                <span className="text-[11px] text-stone-400 font-mono mt-0.5">Format JPG, PNG, atau WEBP</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Deskripsi Umum */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Deskripsi Umum Barang <span className="text-posis-lost">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan kondisi dan ciri umum. Jangan cantumkan ciri rahasia yang spesifik agar bisa diverifikasi saat klaim."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-300">
            <Button variant="ghost" onClick={handleResetAndClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Menerbitkan...' : 'Terbitkan Laporan'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
