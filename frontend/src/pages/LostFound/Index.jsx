import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Calendar, Tag } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';
import { itemsService } from '../../services/itemsService';
import { ItemCard } from '../../components/lost-found/ItemCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { CharacterSearching } from '../../components/motion/CharacterSearching';
import { ItemReportModal } from '../../components/lost-found/ItemReportModal';
import { ItemClaimModal } from '../../components/lost-found/ItemClaimModal';

export function LostFoundIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'semua',
    category: 'semua',
    q: '',
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await itemsService.getItems(filters);
      const itemsList = Array.isArray(res) ? res : (res?.data || []);
      setItems(itemsList);
    } catch (err) {
      console.error("Gagal memuat barang:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters.type, filters.category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleOpenClaim = (item) => {
    setSelectedClaimItem(item);
    setClaimModalOpen(true);
  };

  return (
    <div className="py-8 md:py-12 bg-posis-bone min-h-screen">
      <div className="container mx-auto px-4">
        {/* Module Header (Section 9C: Karakter Mencari Kecil + Tanda Tanya) */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 sm:p-8 editorial-shadow mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-posis-blue text-white font-mono text-xs font-bold rounded-[2px]">
                MODUL 01
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
                PAPAN PENGUMUMAN DIGITAL
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-posis-ink tracking-tight">
              Katalog Lost &amp; Found Sekolah
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Cari barang yang hilang atau laporkan barang temuan di lingkungan SMK Negeri 1 Ciomas. Seluruh data diverifikasi oleh petugas piket demi keamanan serah terima.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Karakter Kecil Header */}
            <div className="hidden sm:block">
              <CharacterSearching size="small" showFrame={false} />
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setReportModalOpen(true)}
              icon={Plus}
            >
              Lapor Barang
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-4 sm:p-5 mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            {/* Input Pencarian Teks */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                placeholder="Cari nama barang, ciri khusus, atau lokasi (cth: Kunci Beat, Kantin, Lab RPL)..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-posis-bone border border-stone-400 focus:border-posis-blue rounded-[2px] outline-none"
              />
            </div>
            <Button type="submit" variant="blue" size="md">
              Cari Barang
            </Button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
            {/* Jenis: Semua, Hilang, Ditemukan */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs text-stone-500 mr-1 uppercase font-semibold">Jenis:</span>
              {[
                { id: 'semua', label: 'Semua' },
                { id: 'hilang', label: 'Barang Hilang' },
                { id: 'ditemukan', label: 'Barang Ditemukan' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilters({ ...filters, type: t.id })}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded-[2px] border transition-all ${
                    filters.type === t.id
                      ? 'bg-posis-blue text-white border-posis-blue font-bold shadow-sm'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-posis-blue'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Dropdown Kategori */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500 uppercase font-semibold">Kategori:</span>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-1.5 text-xs font-mono bg-white border border-stone-400 focus:border-posis-blue rounded-[2px] outline-none cursor-pointer"
              >
                {SITE_CONFIG.categories.items.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard count={6} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            type="lost-found"
            title="Tidak Ada Barang Ditemukan"
            message={`Tidak ada barang yang cocok dengan kriteria filter "${filters.q || filters.type}". Anda dapat membuat laporan baru jika Anda yang kehilangan atau menemukan.`}
            actionText="+ Terbitkan Laporan Baru"
            onAction={() => setReportModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <ItemCard
                key={item.id}
                item={item}
                index={idx}
                onClaimClick={handleOpenClaim}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ItemReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccess={fetchItems}
      />

      <ItemClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={selectedClaimItem}
      />
    </div>
  );
}
