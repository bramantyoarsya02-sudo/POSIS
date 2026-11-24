'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SITE_CONFIG } from '../../config/site';
import { aspirationsService } from '../../services/aspirationsService';
import { CheckCircle2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export function AspirationFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'wifi',
    body: '',
    is_anonymous: false,
    is_emergency: false,
  });
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      setErrorMsg('Mohon lengkapi judul dan uraian aspirasi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await aspirationsService.createAspiration(formData);
      setSuccessTicket(res.ticket_number || 'POSIS-ASP-BERHASIL');
      if (onSuccess) onSuccess(res);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirim aspirasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessTicket(null);
    setFormData({
      title: '',
      category: 'wifi',
      body: '',
      is_anonymous: false,
      is_emergency: false,
    });
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={successTicket ? "Aspirasi Diterima" : "Kotak Aspirasi & Suara Siswa"}
      maxWidth="max-w-xl"
    >
      {successTicket ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-blue-100 text-posis-blue border-2 border-posis-blue rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-serif text-2xl font-bold text-posis-blue">Aspirasi Anda Berhasil Dicatat</h4>
            <p className="text-sm text-stone-600 mt-1">
              Nomor tiket pemantauan transparansi:
            </p>
            <div className="inline-block mt-3 px-4 py-2 bg-posis-gold text-posis-ink font-mono text-base font-bold tracking-wider rounded-[2px] editorial-shadow-dark">
              {successTicket}
            </div>
          </div>
          <div className="p-3 bg-stone-100 border border-stone-300 text-xs text-stone-600 rounded-[2px] text-left space-y-1">
            <p className="font-bold text-posis-ink flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-posis-blue" />
              Komitmen Waktu Respons {SITE_CONFIG.slaDays} Hari Kerja:
            </p>
            <p>
              Aspirasi Anda akan diverifikasi oleh Pengurus OSIS dan diajukan ke jajaran Guru Pembina / Wakasek Sarana &amp; Prasarana. Perkembangan tindak lanjut dapat Anda pantau langsung di papan aspirasi.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" onClick={handleClose} className="w-full sm:w-auto">
              Selesai &amp; Kembali
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-posis-lost text-posis-lost text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Jalur Laporan Darurat Checkbox */}
          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-[2px] flex items-start gap-2.5">
            <input
              type="checkbox"
              id="emergency-toggle"
              checked={formData.is_emergency}
              onChange={(e) => setFormData({ ...formData, is_emergency: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-posis-lost border-red-400 focus:ring-posis-lost rounded-[2px] cursor-pointer"
            />
            <label htmlFor="emergency-toggle" className="text-xs text-stone-800 cursor-pointer">
              <span className="font-bold text-posis-lost font-mono uppercase block">
                JALUR FASILITAS DARURAT / BERBAHAYA
              </span>
              Centang jika menyangkut korsleting listrik, kebocoran besar, kaca pecah, atau potensi bahaya fisik yang butuh tindakan cepat hari ini.
            </label>
          </div>

          {/* Judul Aspirasi */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Pokok Aspirasi / Usulan <span className="text-posis-lost">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Perbaikan Saklar Lampu & Stop Kontak di Lab RPL 1"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Bidang Fasilitas Sekolah <span className="text-posis-lost">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            >
              {SITE_CONFIG.categories.aspirations
                .filter((c) => c.id !== 'semua')
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Uraian Lengkap */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Uraian Masalah &amp; Usul Solusi <span className="text-posis-lost">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Sampaikan kondisi saat ini, ruangan/titik spesifik, dan usulan Anda demi kebaikan fasilitas bersama..."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            />
          </div>

          {/* Toggle Anonim & Kebijakan Jujur */}
          <div className="p-3 bg-stone-100 border border-stone-300 rounded-[2px] space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="anon-toggle" className="text-xs font-mono font-bold uppercase text-posis-ink cursor-pointer">
                Kirim Secara Anonim
              </label>
              <input
                type="checkbox"
                id="anon-toggle"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                className="w-4 h-4 text-posis-blue border-stone-400 rounded-[2px] cursor-pointer"
              />
            </div>
            {/* Teks Kebijakan Anonim yang Jujur dari Config */}
            <div className="flex items-start gap-2 pt-1 border-t border-stone-200 text-[11px] text-stone-600">
              <Info className="w-4 h-4 text-posis-blue shrink-0 mt-0.5" />
              <p>{SITE_CONFIG.anonymousPolicyExplanation}</p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-300">
            <Button variant="ghost" onClick={handleClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Mengirim Aspirasi...' : 'Kirim Aspirasi'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
