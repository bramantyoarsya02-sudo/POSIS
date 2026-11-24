export const SITE_CONFIG = {
  name: "POSIS",
  fullName: "Pusat Olah Suara & Informasi Siswa",
  school: "SMK Negeri 1 Ciomas",
  district: "Kabupaten Bogor",
  tagline: "Suara dan informasi siswa, di satu tempat.",
  address: "Jl. Raya Laladon No. 1, Ciomas, Kabupaten Bogor, Jawa Barat 16610",
  email: "posis@smkn1ciomas.sch.id",
  phone: "(0251) 863-1234",
  slaDays: 7, // Komitmen respons 7 hari kerja
  maxDailyPosts: 5,
  anonymousPolicyVisibleToAdmin: true, // Konfigurasi kebijakan anonim
  anonymousPolicyExplanation: 
    "Identitas Anda (nama dan NISN) disembunyikan sepenuhnya dari publik dan sesama siswa. Pengurus OSIS dan Guru Pembina tetap dapat melihat asal akun untuk mencegah ujaran kebencian dan menjaga pertanggungjawaban tata tertib sekolah.",
  handoverLocations: [
    { id: 'ruang_piket', label: 'Ruang Piket Sekolah', hours: 'Senin–Jumat 07:00 – 15:30 WIB' },
    { id: 'ruang_bk', label: 'Ruang Bimbingan Konseling (BK)', hours: 'Senin–Jumat 07:30 – 15:00 WIB' },
    { id: 'pos_satpam', label: 'Pos Satpam Gerbang Utama', hours: 'Setiap Hari 06:30 – 17:00 WIB' }
  ],
  categories: {
    items: [
      { id: 'semua', label: 'Semua Kategori' },
      { id: 'alat_tulis', label: 'Alat Tulis & Buku' },
      { id: 'elektronik', label: 'Elektronik & Gadget' },
      { id: 'pakaian', label: 'Pakaian & Seragam' },
      { id: 'berkas', label: 'Berkas & Kartu Pelajar' },
      { id: 'lainnya', label: 'Lain-lain' },
    ],
    aspirations: [
      { id: 'semua', label: 'Semua Bidang' },
      { id: 'toilet', label: 'Sanitasi & Toilet' },
      { id: 'perpustakaan', label: 'Perpustakaan' },
      { id: 'lapangan', label: 'Lapangan Olahraga' },
      { id: 'wifi', label: 'Jaringan & Wi-Fi' },
      { id: 'kantin', label: 'Kantin Sehat' },
      { id: 'lainnya', label: 'Fasilitas Lainnya' },
    ]
  }
};
