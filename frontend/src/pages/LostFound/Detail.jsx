import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Building, ArrowLeft, Share2, ShieldCheck, AlertCircle } from 'lucide-react';
import { itemsService } from '../../services/itemsService';
import { formatDateIndo, getItemStatusBadge } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { ItemClaimModal } from '../../components/lost-found/ItemClaimModal';

export function LostFoundDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  useEffect(() => {
    async function loadItem() {
      try {
        const data = await itemsService.getItemById(id);
        setItem(data);
      } catch (err) {
        console.error("Gagal memuat barang:", err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center font-mono text-sm">
        Memuat data laporan barang...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold text-posis-lost mb-2">Barang Tidak Ditemukan</h2>
        <p className="text-sm text-stone-600 mb-6">Laporan mungkin telah dihapus atau tiket tidak valid.</p>
        <Link to="/lost-found">
          <Button variant="outline">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = getItemStatusBadge(item.status, item.type);

  const handleShareWa = () => {
    const text = encodeURIComponent(
      `[POSIS SMKN 1 CIOMAS]\nLaporan ${item.type === 'hilang' ? 'Barang Hilang' : 'Barang Ditemukan'}:\n*${item.title}*\nNomor Tiket: ${item.ticket_number}\nLokasi: ${item.location}\nTanggal: ${formatDateIndo(item.event_date)}\nLihat detail di: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="py-8 md:py-12 bg-posis-bone min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link
          to="/lost-found"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-posis-blue uppercase hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          KEMBALI KE KATALOG LOST &amp; FOUND
        </Link>

        {/* Main Editorial Card */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow overflow-hidden">
          {/* Header Banner */}
          <div className="px-6 py-4 bg-stone-100 border-b-2 border-posis-blue flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-stone-500 uppercase">TIKET LAPORAN</span>
              <p className="font-mono text-sm font-bold text-posis-blue">{item.ticket_number}</p>
            </div>
            <div className={`px-3 py-1 border text-xs font-mono font-bold uppercase rounded-[2px] ${statusInfo.bg}`}>
              {statusInfo.label}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-posis-blue tracking-wider block mb-1">
                KATEGORI: {item.category?.toUpperCase()}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-posis-ink leading-tight">
                {item.title}
              </h1>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-posis-bone border border-stone-300 rounded-[2px] font-sans text-xs">
              <div>
                <span className="text-stone-500 font-mono block text-[10px] uppercase">LOKASI KEJADIAN</span>
                <p className="font-bold text-posis-ink flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-posis-blue shrink-0" />
                  {item.location}
                </p>
              </div>
              <div>
                <span className="text-stone-500 font-mono block text-[10px] uppercase">TANGGAL KEJADIAN</span>
                <p className="font-bold text-posis-ink flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-posis-blue shrink-0" />
                  {formatDateIndo(item.event_date)}
                </p>
              </div>
              <div>
                <span className="text-stone-500 font-mono block text-[10px] uppercase">PELAPOR</span>
                <p className="font-bold text-posis-ink mt-0.5 truncate">
                  {item.reported_by || 'Siswa Terdaftar'}
                </p>
              </div>
            </div>

            {/* Foto Fisik Barang Ditemukan */}
            {item.photo_url && (
              <div className="border-2 border-posis-blue/40 rounded-[2px] overflow-hidden bg-stone-50 p-3">
                <span className="font-mono text-[11px] font-bold text-posis-blue uppercase tracking-wider block mb-2">
                  📸 Dokumentasi Foto Fisik Barang:
                </span>
                <div className="max-h-[420px] w-full overflow-hidden rounded-[2px] bg-stone-100 flex items-center justify-center border border-stone-200">
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Deskripsi */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs uppercase font-bold text-stone-700 tracking-wider">
                DESKRIPSI UMUM:
              </h3>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 border border-stone-200 rounded-[2px]">
                {item.description}
              </p>
            </div>

            {/* Titik Serah Fisik (Jika ditemukan) */}
            {item.handover_point && (
              <div className="p-4 bg-amber-50 border-2 border-posis-gold rounded-[2px] space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-mono text-xs font-bold uppercase">
                  <Building className="w-4 h-4 text-amber-800" />
                  TEMPAT PENYIMPANAN FISIK RESMI
                </div>
                <p className="text-sm font-bold text-amber-950">
                  {item.handover_point.replace('_', ' ').toUpperCase()} SMKN 1 CIOMAS
                </p>
                <p className="text-xs text-amber-900">
                  Jam Layanan: <strong>{item.service_hours || 'Senin–Jumat 07:30 – 15:00 WIB'}</strong>
                </p>
                <p className="text-[11px] text-amber-800 pt-1 border-t border-amber-200">
                  Silakan datang ke lokasi di atas dengan menunjukkan bukti verifikasi klaim dari aplikasi POSIS.
                </p>
              </div>
            )}

            {/* Prosedur Pengambilan */}
            <div className="p-4 bg-blue-50/60 border border-posis-blue/30 rounded-[2px] text-xs text-stone-700 space-y-1.5">
              <p className="font-bold text-posis-blue flex items-center gap-1.5 font-mono uppercase">
                <ShieldCheck className="w-4 h-4 text-posis-blue" />
                Tata Cara Serah Terima:
              </p>
              <p>
                Demi mencegah pengambilan barang oleh pihak yang tidak berhak, pemilik wajib menyebutkan ciri-ciri khusus rahasia melalui tombol klaim di bawah, kemudian mencocokkannya langsung di hadapan Petugas Piket / BK.
              </p>
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <Button
                variant="outline"
                size="md"
                onClick={handleShareWa}
                icon={Share2}
              >
                Bagikan ke WhatsApp
              </Button>

              {item.type === 'ditemukan' && item.status === 'tersedia' && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setClaimModalOpen(true)}
                  icon={ShieldCheck}
                >
                  Klaim Barang Ini
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ItemClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={item}
        onSuccess={() => {
          itemsService.getItemById(id).then(setItem);
        }}
      />
    </div>
  );
}
