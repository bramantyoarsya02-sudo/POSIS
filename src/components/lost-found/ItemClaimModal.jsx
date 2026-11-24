'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { itemsService } from '../../services/itemsService';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export function ItemClaimModal({ isOpen, onClose, item, onSuccess }) {
  const [claimantName, setClaimantName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('posis_user') || '{}');
      return u.name || '';
    } catch {
      return '';
    }
  });
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimResult, setClaimResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claimantName.trim()) {
      setErrorMsg('Mohon isi nama lengkap Anda sebagai pihak yang mengajukan klaim.');
      return;
    }
    if (!proof.trim()) {
      setErrorMsg('Mohon isi ciri-ciri khusus barang Anda.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await itemsService.submitClaim(item.id, {
        claimant_name: claimantName.trim(),
        proof: proof.trim(),
      });
      setClaimResult(res);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengajukan klaim.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClaimResult(null);
    setProof('');
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={claimResult ? "Klaim Diajukan" : "Formulir Klaim Kepemilikan Barang"}
      maxWidth="max-w-lg"
    >
      {claimResult ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-blue-100 text-posis-blue border-2 border-posis-blue rounded-full mx-auto flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 stroke-[2]" />
          </div>
          <div>
            <h4 className="font-serif text-2xl font-bold text-posis-blue">Klaim Anda Berhasil Dicatat</h4>
            <p className="text-sm text-stone-600 mt-1">
              Nomor Verifikasi Klaim:
            </p>
            <div className="inline-block mt-3 px-4 py-2 bg-posis-blue text-white font-mono text-base font-bold tracking-wider rounded-[2px] editorial-shadow-gold">
              {claimResult.claim_number}
            </div>
          </div>
          <div className="p-3 bg-stone-100 border border-stone-300 text-left text-xs space-y-2 rounded-[2px]">
            <p className="font-bold text-posis-ink">Langkah Selanjutnya:</p>
            <ol className="list-decimal list-inside space-y-1 text-stone-600">
              <li>Tunjukkan nomor verifikasi ini ke petugas di <strong>{item.handover_point ? item.handover_point.replace('_', ' ').toUpperCase() : 'Ruang Piket Sekolah'}</strong>.</li>
              <li>Bawa kartu pelajar atau bukti pendukung untuk verifikasi identitas.</li>
              <li>Petugas piket akan mencocokkan ciri khusus rahasia sebelum serah-terima fisik dilakukan.</li>
            </ol>
          </div>
          <div className="pt-2">
            <Button variant="primary" onClick={handleClose} className="w-full sm:w-auto">
              Mengerti &amp; Tutup
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

          {/* Info Barang yang Diklaim */}
          <div className="p-3 bg-stone-100 border border-stone-300 rounded-[2px]">
            <span className="font-mono text-[10px] text-posis-blue uppercase font-bold tracking-wider">
              BARANG YANG INGIN DIKLAIM
            </span>
            <h5 className="font-bold text-sm text-posis-ink mt-0.5">{item.title}</h5>
            <p className="font-mono text-xs text-stone-600 mt-1">
              Tiket: {item.ticket_number} · Ditemukan di {item.location}
            </p>
          </div>

          {/* Petunjuk Pengisian */}
          <div className="p-3 bg-amber-50 border border-posis-gold rounded-[2px] text-xs text-amber-900 leading-relaxed">
            <p className="font-bold mb-1">PENTING (Prosedur Keamanan Piket):</p>
            Sebutkan detail atau ciri khusus yang <strong>hanya diketahui oleh Anda sebagai pemilik asli</strong> dan sengaja tidak disebutkan pada pengumuman umum (misalnya: gantungan kunci kecil tertentu, goresan di sudut, isi dompet, atau foto wallpaper).
          </div>

          {/* Nama Lengkap Pengklaim */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Nama Lengkap Pengklaim <span className="text-posis-lost">*</span>
            </label>
            <input
              type="text"
              required
              value={claimantName}
              onChange={(e) => setClaimantName(e.target.value)}
              placeholder="Contoh: Muhammad Rizky Pratama"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Wajib menyertakan nama lengkap sesuai Kartu Pelajar atau Buku Induk Siswa.
            </p>
          </div>

          {/* Ciri Khusus */}
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Ciri Khusus Rahasia <span className="text-posis-lost">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="Contoh: Di balik kartu pelajar ada stiker klub sepak bola warna merah, dan di gantungan kunci ada inisial 'R' kecil."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-400 focus:border-posis-blue focus:ring-1 focus:ring-posis-blue rounded-[2px] outline-none"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-300">
            <Button variant="ghost" onClick={handleClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Mengirim Klaim...' : 'Ajukan Klaim ke Piket'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
