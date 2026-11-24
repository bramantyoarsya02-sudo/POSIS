'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, MessageSquare, ShieldCheck, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { statsService } from '../services/statsService';
import { itemsService } from '../services/itemsService';
import { aspirationsService } from '../services/aspirationsService';
import { Button } from '../components/common/Button';
import { HeroMotifSVG } from '../components/motion/HeroMotifSVG';
import { CharacterSearching } from '../components/motion/CharacterSearching';
import { CharacterAspiration } from '../components/motion/CharacterAspiration';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import { ItemCard } from '../components/lost-found/ItemCard';
import { AspirationCard } from '../components/aspiration/AspirationCard';
import { ItemReportModal } from '../components/lost-found/ItemReportModal';
import { ItemClaimModal } from '../components/lost-found/ItemClaimModal';
import { AspirationFormModal } from '../components/aspiration/AspirationFormModal';

export function Home() {
  const [stats, setStats] = useState({
    itemsReturned: 0,
    aspirationsSubmitted: 0,
    aspirationsCompleted: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentAspirations, setRecentAspirations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [aspirationModalOpen, setAspirationModalOpen] = useState(false);

  const reloadStats = async () => {
    try {
      const statsData = await statsService.getStats();
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error("Gagal memperbarui statistik:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, itemsData, aspData] = await Promise.all([
          statsService.getStats(),
          itemsService.getItems({ per_page: 3 }),
          aspirationsService.getAspirations({ per_page: 2 })
        ]);
        if (statsData) setStats(statsData);
        const itemsList = Array.isArray(itemsData) ? itemsData : (itemsData?.data || []);
        setRecentItems(itemsList.slice(0, 3));
        const aspList = Array.isArray(aspData) ? aspData : (aspData?.data || []);
        setRecentAspirations(aspList.slice(0, 2));
      } catch (err) {
        console.error("Gagal memuat data beranda:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Auto-refresh saat kembali ke tab beranda setelah admin melakukan tindakan
    const handleFocus = () => {
      reloadStats();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleOpenClaim = (item) => {
    setSelectedClaimItem(item);
    setClaimModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden">
      {/* =========================================================
          SECTION 1: HERO SECTION
      ========================================================= */}
      <section className="relative min-h-[82vh] flex items-center border-b-2 border-posis-blue overflow-hidden py-12 md:py-20 bg-posis-bone">
        {/* Latar Hero Motif Garis Logo SVG */}
        <HeroMotifSVG />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-left">
            {/* Logo SMKN 1 Ciomas di Hero (Tinggi min 72px di desktop) */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white p-2 border-2 border-posis-blue rounded-[2px] editorial-shadow flex items-center justify-center">
                <img
                  src="/assets/logo-smkn1-ciomas.png"
                  alt="Logo Resmi SMK Negeri 1 Ciomas"
                  width="80"
                  height="80"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-posis-blue uppercase block">
                  SMK NEGERI 1 CIOMAS · KABUPATEN BOGOR
                </span>
                <span className="font-mono text-[11px] text-stone-500 uppercase tracking-wider">
                  SISTEM INFORMASI KESISWAAN TERPADU
                </span>
              </div>
            </motion.div>

            {/* Heading Serif Besar Fluid */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold text-posis-ink tracking-tight leading-[1.05]"
            >
              Suara dan informasi siswa, di satu tempat.
            </motion.h1>

            {/* Paragraf Resmi */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-stone-700 leading-relaxed max-w-3xl"
            >
              POSIS (Pusat Olah Suara &amp; Informasi Siswa) adalah layanan SMK Negeri 1 Ciomas untuk membantu siswa menemukan barang yang hilang dan menyampaikan aspirasi demi fasilitas sekolah yang lebih baik. Setiap laporan ditinjau oleh pengurus OSIS dan guru, dan perkembangannya dapat dipantau terbuka.
            </motion.p>

            {/* Dua Tombol CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
            >
              {/* CTA Utama Kuning */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => setReportModalOpen(true)}
                icon={Search}
              >
                Lapor Barang
              </Button>

              {/* Tombol Garis Biru */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setAspirationModalOpen(true)}
                icon={MessageSquare}
              >
                Sampaikan Aspirasi
              </Button>

              <Link href="/panduan-faq" className="ml-auto hidden lg:inline-flex items-center text-xs font-mono text-posis-blue font-semibold hover:underline">
                Panduan Penggunaan Layanan →
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Index Dekoratif Pojok Bawah */}
        <div className="hidden lg:block absolute bottom-4 right-8 font-mono text-[11px] text-posis-blue/70 uppercase tracking-widest pointer-events-none">
          INDEX SEC. 01 // OVERVIEW
        </div>
      </section>

      {/* =========================================================
          SECTION 2: CARA KERJA (ASIMETRIS, 3 LANGKAH BERNOMOR)
      ========================================================= */}
      <section className="py-16 md:py-24 border-b-2 border-posis-blue bg-white">
        <div className="container mx-auto px-4">
          {/* Header Section Editorial */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-stone-300 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-posis-blue block mb-1">
                ALUR DAN TATA KELOLA LAYANAN
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-posis-ink tracking-tight">
                Cara Kerja Sistem POSIS
              </h2>
            </div>
            <p className="text-xs md:text-sm text-stone-600 max-w-md font-sans">
              Setiap laporan warga sekolah diproses melalui tiga tahapan akuntabel untuk menjaga keteraturan dan validitas data.
            </p>
          </div>

          {/* 3 Langkah Bernomor Asimetris */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Langkah 01 (Lebar 4 Kolom) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="md:col-span-4 p-6 sm:p-8 bg-posis-bone border-2 border-posis-blue rounded-[2px] editorial-shadow flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-3xl md:text-4xl font-bold text-posis-blue block mb-4">
                  01
                </span>
                <h3 className="font-serif text-2xl font-bold text-posis-ink mb-2">
                  Lapor &amp; Ajukan
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Siswa mengisi data barang yang hilang/ditemukan atau menyampaikan usulan perbaikan sarana sekolah. Pengirim dapat memilih mode publik atau anonim.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-300 font-mono text-[11px] text-posis-blue uppercase font-semibold">
                FORM DIGITAL · TIKET SISTEM
              </div>
            </motion.div>

            {/* Langkah 02 (Lebar 4 Kolom) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="md:col-span-4 p-6 sm:p-8 bg-posis-bone border-2 border-posis-blue rounded-[2px] editorial-shadow flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-3xl md:text-4xl font-bold text-posis-gold block mb-4">
                  02
                </span>
                <h3 className="font-serif text-2xl font-bold text-posis-ink mb-2">
                  Ditinjau &amp; Diverifikasi
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Pengurus OSIS dan Petugas Piket meninjau keabsahan barang dan kelayakan bahasa aspirasi sebelum dipublikasikan ke papan sistem.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-300 font-mono text-[11px] text-amber-800 uppercase font-semibold">
                MODERASI TERTIB · VERIFIKASI BUKTI
              </div>
            </motion.div>

            {/* Langkah 03 (Lebar 4 Kolom) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="md:col-span-4 p-6 sm:p-8 bg-posis-bone border-2 border-posis-blue rounded-[2px] editorial-shadow flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-3xl md:text-4xl font-bold text-posis-blue block mb-4">
                  03
                </span>
                <h3 className="font-serif text-2xl font-bold text-posis-ink mb-2">
                  Ditindaklanjuti
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Barang diserahterimakan fisik di Ruang Piket/BK, dan aspirasi dijawab serta dieksekusi oleh pihak Sarana &amp; Prasarana SMKN 1 Ciomas.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-300 font-mono text-[11px] text-posis-found uppercase font-semibold">
                SERAH TERIMA · SLA 7 HARI KERJA
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: MODUL 01 — LOST & FOUND
      ========================================================= */}
      <section className="py-16 md:py-24 border-b-2 border-posis-blue bg-posis-bone">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Kolom Kiri: Karakter Mencari + Tanda Tanya Animasi (5 Kolom) */}
            <div className="lg:col-span-5 flex justify-center">
              <CharacterSearching size="default" showFrame={true} />
            </div>

            {/* Kolom Kanan: Ringkasan Editorial & Aksi (7 Kolom) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-posis-blue text-white font-mono text-xs font-bold rounded-[2px]">
                    MODUL 01
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
                    PAPAN PENGUMUMAN SEKOLAH
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-posis-ink tracking-tight">
                  Lost &amp; Found Terintegrasi
                </h2>
                <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed">
                  Pernah kehilangan kunci kendaraan, kartu pelajar, helm, atau buku praktikum di lingkungan sekolah? Laporkan segera ke sistem agar petugas piket dan seluruh warga sekolah dapat membantu pencarian secara terorganisir.
                </p>
              </div>

              {/* Titik Serah Fisik Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SITE_CONFIG.handoverLocations.map((loc) => (
                  <div key={loc.id} className="p-3 bg-white border border-stone-300 rounded-[2px]">
                    <span className="font-mono text-[10px] text-posis-blue uppercase font-bold block mb-1">
                      POS TERVERIFIKASI
                    </span>
                    <p className="font-bold text-xs text-posis-ink leading-tight">{loc.label}</p>
                    <p className="font-mono text-[10px] text-stone-500 mt-1">{loc.hours}</p>
                  </div>
                ))}
              </div>

              {/* Tombol Menuju Modul */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/lost-found">
                  <Button variant="blue" size="md" icon={Eye}>
                    Buka Papan Lost &amp; Found
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setReportModalOpen(true)}
                >
                  + Lapor Barang Sekarang
                </Button>
              </div>
            </div>
          </div>

          {/* Pratinjau Barang Terkini */}
          <div className="mt-14 pt-10 border-t border-stone-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-posis-ink">
                Laporan Barang Aktif Terkini
              </h3>
              <Link href="/lost-found" className="text-xs font-mono font-semibold text-posis-blue hover:underline flex items-center gap-1">
                Lihat Semua ({stats.activeLostItems + stats.activeFoundItems} Barang) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentItems.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onClaimClick={handleOpenClaim}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: MODUL 02 — ASPIRASI (TATA LETAK DICERMINKAN)
      ========================================================= */}
      <section className="py-16 md:py-24 border-b-2 border-posis-blue bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Kolom Kiri: Ringkasan Editorial & Aksi (7 Kolom) */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-posis-gold text-posis-ink font-mono text-xs font-bold rounded-[2px]">
                    MODUL 02
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
                    KOTAK SARAN &amp; SUARA SISWA
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-posis-ink tracking-tight">
                  Kotak Aspirasi &amp; Suara Siswa
                </h2>
                <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed">
                  Fasilitas kelas kurang memadai? Stop kontak lab longgar? Atau punya usulan menu sehat di kantin? Suarakan langsung gagasan Anda. Kami menjamin peninjauan berkala dengan komitmen waktu respons <strong>maksimal 7 hari kerja</strong> oleh pihak sekolah.
                </p>
              </div>

              {/* Komitmen 7 Hari & Privasi Anonim */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-posis-bone border border-stone-300 rounded-[2px]">
                  <span className="font-mono text-[10px] text-posis-blue uppercase font-bold block mb-1">
                    STANDAR LAYANAN
                  </span>
                  <p className="font-bold text-xs text-posis-ink">Komitmen Respons 7 Hari Kerja</p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Setiap aspirasi wajib ditanggapi oleh OSIS atau pihak Kesiswaan/Sarpras.
                  </p>
                </div>
                <div className="p-3 bg-posis-bone border border-stone-300 rounded-[2px]">
                  <span className="font-mono text-[10px] text-amber-800 uppercase font-bold block mb-1">
                    PERLINDUNGAN SISWA
                  </span>
                  <p className="font-bold text-xs text-posis-ink">Pilihan Kirim Anonim Aman</p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Identitas disembunyikan penuh dari publik untuk mencegah intimidasi.
                  </p>
                </div>
              </div>

              {/* Tombol Menuju Modul */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/aspirasi">
                  <Button variant="primary" size="md" icon={Eye}>
                    Buka Papan Aspirasi
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setAspirationModalOpen(true)}
                >
                  + Tulis Aspirasi Baru
                </Button>
              </div>
            </div>

            {/* Kolom Kanan: Karakter Aspirasi + Toa Animasi (5 Kolom - Dicerminkan) */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <CharacterAspiration size="default" showFrame={true} />
            </div>
          </div>

          {/* Pratinjau Aspirasi Terkini */}
          <div className="mt-14 pt-10 border-t border-stone-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-posis-ink">
                Aspirasi Fasilitas Terhangat
              </h3>
              <Link href="/aspirasi" className="text-xs font-mono font-semibold text-posis-blue hover:underline flex items-center gap-1">
                Jelajahi Semua Aspirasi →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recentAspirations.map((asp, idx) => (
                <AspirationCard
                  key={asp.id}
                  aspiration={asp}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: ANGKA STATISTIK (MENGHITUNG NAIK SAAT TERLIHAT)
      ========================================================= */}
      <section className="py-16 md:py-20 border-b-2 border-posis-blue bg-posis-ink text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold tracking-widest text-posis-gold uppercase block mb-1">
              DATA AKUNTABILITAS PUBLIK
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight">
              Dampak Nyata Kolaborasi Warga Sekolah
            </h2>
            <p className="mt-2 text-xs md:text-sm text-white/70">
              Setiap angka di bawah ini mewakili barang yang berhasil kembali ke pemiliknya dan pembenahan fasilitas yang dieksekusi sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Metrik 01: Barang Dikembalikan */}
            <div className="p-6 bg-white/5 border-2 border-posis-gold/70 rounded-[2px] text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl text-posis-gold mb-2">
                <AnimatedCounter value={stats.itemsReturned} />
              </div>
              <h4 className="font-serif text-lg text-white font-bold mb-1">
                Barang Dikembalikan
              </h4>
              <p className="font-mono text-xs text-white/60">
                Terverifikasi serah terima di Ruang Piket
              </p>
            </div>

            {/* Metrik 02: Aspirasi Masuk */}
            <div className="p-6 bg-white/5 border-2 border-white/20 rounded-[2px] text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl text-white mb-2">
                <AnimatedCounter value={stats.aspirationsSubmitted} />
              </div>
              <h4 className="font-serif text-lg text-white font-bold mb-1">
                Aspirasi Diterima
              </h4>
              <p className="font-mono text-xs text-white/60">
                Dari siswa lintas jurusan SMKN 1 Ciomas
              </p>
            </div>

            {/* Metrik 03: Aspirasi Ditindaklanjuti */}
            <div className="p-6 bg-white/5 border-2 border-emerald-500/70 rounded-[2px] text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl text-emerald-400 mb-2">
                <AnimatedCounter value={stats.aspirationsCompleted} />
              </div>
              <h4 className="font-serif text-lg text-white font-bold mb-1">
                Telah Ditindaklanjuti
              </h4>
              <p className="font-mono text-xs text-white/60">
                Dikerjakan nyata oleh Tim Sarpras Sekolah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ItemReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccess={() => {
          itemsService.getItems({ per_page: 3 }).then((r) => {
            const list = Array.isArray(r) ? r : (r?.data || []);
            setRecentItems(list.slice(0, 3));
          });
          reloadStats();
        }}
      />

      <ItemClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={selectedClaimItem}
      />

      <AspirationFormModal
        isOpen={aspirationModalOpen}
        onClose={() => setAspirationModalOpen(false)}
        onSuccess={() => {
          aspirationsService.getAspirations({ per_page: 2 }).then((r) => {
            const list = Array.isArray(r) ? r : (r?.data || []);
            setRecentAspirations(list.slice(0, 2));
          });
          reloadStats();
        }}
      />
    </div>
  );
}
