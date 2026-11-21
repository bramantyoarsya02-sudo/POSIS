import React, { useState, useEffect } from 'react';
import { Plus, Search, Flame, Clock } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';
import { aspirationsService } from '../../services/aspirationsService';
import { AspirationCard } from '../../components/aspiration/AspirationCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { CharacterAspiration } from '../../components/motion/CharacterAspiration';
import { AspirationFormModal } from '../../components/aspiration/AspirationFormModal';

export function AspirasiIndex() {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'semua',
    status: 'semua',
    sort: 'populer',
    q: '',
  });

  const [modalOpen, setModalOpen] = useState(false);

  const fetchAspirations = async () => {
    setLoading(true);
    try {
      const res = await aspirationsService.getAspirations(filters);
      const list = Array.isArray(res) ? res : (res?.data || []);
      setAspirations(list);
    } catch (err) {
      console.error("Gagal memuat aspirasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirations();
  }, [filters.category, filters.status, filters.sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAspirations();
  };

  return (
    <div className="py-8 md:py-12 bg-posis-bone min-h-screen">
      <div className="container mx-auto px-4">
        {/* Module Header (Section 9C: Karakter Aspirasi Kecil + Toa) */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 sm:p-8 editorial-shadow mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-posis-gold text-posis-ink font-mono text-xs font-bold rounded-[2px]">
                MODUL 02
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
                WADAH DEMOKRASI SEKOLAH
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-posis-ink tracking-tight">
              Kotak Suara &amp; Aspirasi Siswa
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Sampaikan usulan perbaikan ruang kelas, laboratorium, sanitasi toilet, dan sarana belajar lainnya di SMKN 1 Ciomas. Terbuka atau dengan opsi anonim yang terlindungi.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Karakter Kecil Header */}
            <div className="hidden sm:block">
              <CharacterAspiration size="small" showFrame={false} />
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setModalOpen(true)}
              icon={Plus}
            >
              Tulis Aspirasi
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-4 sm:p-5 mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                placeholder="Cari pokok aspirasi fasilitas (cth: Stop Kontak Lab, Wi-Fi, Kran Toilet Gedung B)..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-posis-bone border border-stone-400 focus:border-posis-blue rounded-[2px] outline-none"
              />
            </div>
            <Button type="submit" variant="blue" size="md">
              Cari Aspirasi
            </Button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
            {/* Urutan: Terpopuler / Terbaru */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500 uppercase font-semibold">Urutkan:</span>
              <div className="flex items-center border border-stone-300 rounded-[2px] overflow-hidden">
                <button
                  onClick={() => setFilters({ ...filters, sort: 'populer' })}
                  className={`px-3 py-1 text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    filters.sort === 'populer'
                      ? 'bg-posis-blue text-white font-bold'
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Dukungan Terbanyak
                </button>
                <button
                  onClick={() => setFilters({ ...filters, sort: 'terbaru' })}
                  className={`px-3 py-1 text-xs font-mono flex items-center gap-1.5 transition-colors border-l border-stone-300 ${
                    filters.sort === 'terbaru'
                      ? 'bg-posis-blue text-white font-bold'
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Terbaru
                </button>
              </div>
            </div>

            {/* Kategori Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500 uppercase font-semibold">Bidang:</span>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-1.5 text-xs font-mono bg-white border border-stone-400 focus:border-posis-blue rounded-[2px] outline-none cursor-pointer"
              >
                {SITE_CONFIG.categories.aspirations.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Aspirations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard count={4} />
          </div>
        ) : aspirations.length === 0 ? (
          <EmptyState
            type="aspiration"
            title="Belum Ada Aspirasi Terdaftar"
            message="Jadilah pelopor perbaikan fasilitas sekolah. Sampaikan aspirasi atau usulan konstruktif Anda untuk SMKN 1 Ciomas."
            actionText="+ Tulis Aspirasi Pertama"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aspirations.map((asp, idx) => (
              <AspirationCard
                key={asp.id}
                aspiration={asp}
                index={idx}
                onVoteUpdate={(id, newCount, newVoted) => {
                  setAspirations((prev) =>
                    prev.map((a) =>
                      a.id === id ? { ...a, upvotes_count: newCount, has_voted: newVoted } : a
                    )
                  );
                  if (filters.sort === 'populer') fetchAspirations();
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AspirationFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAspirations}
      />
    </div>
  );
}
