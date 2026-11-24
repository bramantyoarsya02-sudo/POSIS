'use client';

import React from 'react';
import { HelpCircle, Shield, AlertTriangle, CheckCircle2, Building, BookOpen } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export function PanduanFaq() {
  const faqs = [
    {
      q: "Bagaimana cara mengambil barang yang saya temukan di katalog?",
      a: "Klik tombol 'Klaim Barang' pada kartu barang terkait. Anda wajib mengisi ciri-ciri khusus rahasia yang tidak tercantum di pengumuman umum. Setelah mengirim klaim, simpan nomor tiket klaim dan bawa kartu identitas (Kartu Pelajar) ke Ruang Piket / Ruang BK sekolah sesuai jam layanan."
    },
    {
      q: "Apakah aspirasi saya benar-benar anonim?",
      a: "Ya untuk publik dan sesama siswa. Nama serta NISN Anda tidak akan pernah ditampilkan di halaman publik. Namun, demi mencegah ujaran kebencian, pencemaran nama baik, dan fitnah, sistem tetap mencatat data akun di basis data terlindungi yang hanya dapat diakses oleh Guru Pembina Kesiswaan dalam keadaan khusus investigasi."
    },
    {
      q: "Berapa lama aspirasi saya akan ditanggapi?",
      a: "SMKN 1 Ciomas menerapkan standar waktu peninjauan maksimal 7 hari kerja. Anda dapat memantau statusnya di linimasa aspirasi: Menunggu Review → Diproses Sekolah → Telah Ditindaklanjuti."
    },
    {
      q: "Berapa batas maksimal pelaporan dalam sehari?",
      a: "Setiap akun siswa dibatasi maksimal 5 kiriman per hari (gabungan laporan Lost & Found dan Aspirasi) untuk mencegah spam dan penumpukan antrean verifikasi petugas."
    }
  ];

  const prohibitedItems = [
    "Senjata tajam, senjata api, atau benda tumpul berbahaya yang tidak berkaitan dengan praktikum kejuruan.",
    "Rokok konvensional, rokok elektrik (vape/pods), korek api, dan zat nikotin lainnya.",
    "Minuman keras, obat-obatan terlarang, narkotika, dan psikotropika.",
    "Barang perhiasan berharga berlebihan yang rawan memicu tindak kriminalitas.",
    "Buku, gambar, atau media digital yang memuat konten pornografi dan kekerasan ekstrem."
  ];

  return (
    <div className="py-8 md:py-12 bg-posis-bone min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Header */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 sm:p-8 editorial-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-posis-blue text-white font-mono text-xs font-bold rounded-[2px]">
              DOKUMEN RESMI
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
              SMK NEGERI 1 CIOMAS
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-posis-ink tracking-tight">
            Panduan Penggunaan Layanan &amp; FAQ
          </h1>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            Petunjuk operasional sistem POSIS, tata cara serah terima fisik di sekolah, serta tata tertib barang bawaan siswa di lingkungan SMKN 1 Ciomas.
          </p>
        </div>

        {/* Prosedur Lost & Found */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 sm:p-8 editorial-shadow space-y-4">
          <h2 className="font-serif text-2xl font-bold text-posis-blue flex items-center gap-2">
            <Building className="w-5 h-5 text-posis-blue" />
            1. Prosedur Layanan Lost &amp; Found
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-posis-bone border border-stone-300 rounded-[2px] space-y-2">
              <span className="font-mono font-bold text-posis-lost uppercase block">JIKA ANDA KEHILANGAN:</span>
              <ol className="list-decimal list-inside space-y-1.5 text-stone-700 leading-relaxed">
                <li>Buka katalog barang, filter berdasarkan kategori dan lokasi kejadian.</li>
                <li>Jika belum ada yang menemukan, buat laporan kehilangan baru.</li>
                <li>Jika barang sudah terdaftar sebagai 'Ditemukan', klik tombol Klaim dan sebutkan ciri rahasia.</li>
                <li>Datangi Ruang Piket dengan membawa kartu pelajar untuk serah terima fisik.</li>
              </ol>
            </div>

            <div className="p-4 bg-posis-bone border border-stone-300 rounded-[2px] space-y-2">
              <span className="font-mono font-bold text-posis-found uppercase block">JIKA ANDA MENEMUKAN:</span>
              <ol className="list-decimal list-inside space-y-1.5 text-stone-700 leading-relaxed">
                <li>Amankan barang dan laporkan segera melalui formulir POSIS.</li>
                <li>Pilih titik penyimpanan fisik: <strong>Ruang Piket, Ruang BK, atau Pos Satpam</strong>.</li>
                <li>Serahkan barang fisik ke petugas berwenang di titik tersebut pada hari yang sama.</li>
                <li>Jangan mengunggah nomor kartu pelajar / identitas pribadi secara utuh di foto publik.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Tata Tertib Barang Bawaan Sekolah */}
        <div className="bg-white border-2 border-posis-lost rounded-[2px] p-6 sm:p-8 editorial-shadow space-y-4">
          <h2 className="font-serif text-2xl font-bold text-posis-lost flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-posis-lost" />
            2. Larangan Barang Bawaan di Lingkungan Sekolah
          </h2>
          <p className="text-xs text-stone-600">
            Sesuai Buku Pedoman Tata Tertib Siswa SMKN 1 Ciomas, barang-barang berikut dilarang keras dibawa ke sekolah dan tidak dilayani dalam sistem Lost &amp; Found jika disita:
          </p>
          <ul className="space-y-2 text-xs text-stone-700">
            {prohibitedItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 bg-red-50/70 border border-red-200 rounded-[2px]">
                <span className="font-mono font-bold text-posis-lost">{String(idx + 1).padStart(2, '0')}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 sm:p-8 editorial-shadow space-y-6">
          <h2 className="font-serif text-2xl font-bold text-posis-ink flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-posis-blue" />
            3. Pertanyaan yang Sering Diajukan (FAQ)
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-posis-bone border border-stone-300 rounded-[2px]">
                <h3 className="font-bold text-sm text-posis-ink mb-1.5 font-sans">
                  {faq.q}
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
