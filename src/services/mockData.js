export const MOCK_STATS = {
  itemsReturned: 0,
  aspirationsSubmitted: 0,
  aspirationsCompleted: 0,
  activeLostItems: 0,
  activeFoundItems: 0,
};

export const MOCK_USERS = [
  {
    id: 0,
    name: "Administrator POSIS",
    email: "admin@smkn1ciomas.sch.id",
    role: "admin",
    class: "Pengelola Sistem Informasi SMKN 1 Ciomas",
    password: "admin123",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AdminPOSIS"
  },
  {
    id: 1,
    name: "Muhammad Rizky Pratama",
    nisn: "0067823910",
    email: "siswa@smkn1ciomas.sch.id",
    role: "siswa",
    class: "XII Rekayasa Perangkat Lunak 1",
    password: "siswa123",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rizky"
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    nisn: "0071293845",
    email: "osis@smkn1ciomas.sch.id",
    role: "osis",
    class: "XI Desain Komunikasi Visual 2 (Ketua OSIS)",
    password: "adminosis123",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Siti"
  },
  {
    id: 3,
    name: "Pak Suryono",
    email: "piket@smkn1ciomas.sch.id",
    role: "piket",
    class: "Petugas Piket & Ketertiban",
    password: "adminpiket123",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Suryono"
  },
  {
    id: 4,
    name: "Ahmad Fauzi, S.Pd.",
    email: "guru@smkn1ciomas.sch.id",
    role: "guru_pembina",
    class: "Pembina Kesiswaan & OSIS",
    password: "adminguru123",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Fauzi"
  }
];

export const MOCK_ITEMS = [
  {
    id: 1,
    ticket_number: "POSIS-LF-202610-001",
    title: "Kunci Motor Honda Beat Hitam dengan Gantungan Akrilik Ciomas",
    type: "ditemukan",
    category: "lainnya",
    location: "Kantin Sehat Sekolah (Meja Pojok Kanan)",
    event_date: "2026-10-05",
    description: "Ditemukan kunci kontak motor beserta remote alarm kecil dan gantungan kunci anime. Telah diserahkan ke ruang piket.",
    photo_path: null,
    handover_point: "ruang_piket",
    service_hours: "Senin–Jumat 07:00 – 15:30 WIB",
    status: "tersedia",
    moderation_status: "disetujui",
    reported_by: "Siti Rahmawati (XI DKV 2)",
    created_at: "2026-10-05T09:40:00Z"
  },
  {
    id: 2,
    ticket_number: "POSIS-LF-202610-002",
    title: "Kartu Pelajar & Kartu Perpustakaan a.n. Fajar Nugraha",
    type: "ditemukan",
    category: "berkas",
    location: "Laboratorium Komputer RPL 2 Lantai 2",
    event_date: "2026-10-06",
    description: "Tertinggal di dekat meja instruktur setelah jam praktik pemrograman web. Disimpan sementara di Ruang BK.",
    photo_path: null,
    handover_point: "ruang_bk",
    service_hours: "Senin–Jumat 07:30 – 15:00 WIB",
    status: "tersedia",
    moderation_status: "disetujui",
    reported_by: "Muhammad Rizky Pratama (XII RPL 1)",
    created_at: "2026-10-06T11:15:00Z"
  },
  {
    id: 3,
    ticket_number: "POSIS-LF-202610-003",
    title: "Kalkulator Ilmiah Casio fx-991EX ClassWiz Hitam",
    type: "hilang",
    category: "elektronik",
    location: "Ruang Kelas X Teknik Kendaraan Ringan 1",
    event_date: "2026-10-04",
    description: "Hilang setelah mata pelajaran Matematika. Casing belakang terdapat stiker kecil inisial 'DN'.",
    photo_path: null,
    handover_point: null,
    service_hours: null,
    status: "tersedia",
    moderation_status: "disetujui",
    reported_by: "Dimas Nugraha (X TKR 1)",
    created_at: "2026-10-04T14:20:00Z"
  },
  {
    id: 4,
    ticket_number: "POSIS-LF-202610-004",
    title: "Jaket Almamater Jurusan RPL Warna Biru Dongker Size L",
    type: "hilang",
    category: "pakaian",
    location: "Tribun Lapangan Basket Utama",
    event_date: "2026-10-03",
    description: "Tertinggal saat kegiatan ekstrakurikuler basket sore hari. Ada bordir nama 'Bagus' di saku dada kiri.",
    photo_path: null,
    handover_point: null,
    service_hours: null,
    status: "tersedia",
    moderation_status: "disetujui",
    reported_by: "Bagus Setiawan (XI RPL 3)",
    created_at: "2026-10-03T17:00:00Z"
  },
  {
    id: 5,
    ticket_number: "POSIS-LF-202609-089",
    title: "Tumbler Minum Stainless Steel Biru Merk Lock&Lock",
    type: "ditemukan",
    category: "lainnya",
    location: "Musholla As-Salam Area Wudhu Ikhwan",
    event_date: "2026-09-28",
    description: "Ditemukan setelah sholat Dzuhur berjamaah. Sudah diserahkan ke Pos Satpam.",
    photo_path: null,
    handover_point: "pos_satpam",
    service_hours: "Setiap Hari 06:30 – 17:00 WIB",
    status: "selesai",
    moderation_status: "disetujui",
    reported_by: "Rian Hidayat (X TKJ 2)",
    created_at: "2026-09-28T13:00:00Z"
  }
];

export const MOCK_ASPIRATIONS = [
  {
    id: 1,
    ticket_number: "POSIS-ASP-202610-001",
    title: "Perbaikan Stop Kontak dan Jalur Kabel di Lab Komputer RPL 1 & 2",
    category: "wifi",
    body: "Terdapat 6 titik stop kontak di baris tengah meja siswa yang sering longgar dan memercikkan bunga api kecil saat charger laptop dipasang. Hal ini mengganggu saat jam praktik kejuruan dan berpotensi merusak perangkat siswa maupun memicu korsleting.",
    is_anonymous: false,
    author_name: "Muhammad Rizky Pratama (XII RPL 1)",
    is_emergency: true,
    status: "diproses",
    created_at: "2026-10-03T08:30:00Z",
    due_date: "2026-10-12",
    upvotes_count: 54,
    comments_count: 12,
    has_voted: true,
    admin_reply: "Laporan diteruskan ke bagian Sarana & Prasarana. Teknisi kelistrikan dijadwalkan memeriksa dan mengganti modul colokan pada hari Jumat pukul 14:00 WIB.",
    timeline: [
      { status: "dikirim", label: "Aspirasi Diterima", date: "2026-10-03 08:30 WIB", note: "Aspirasi masuk dengan label darurat kelistrikan." },
      { status: "ditinjau", label: "Ditinjau Pengurus OSIS", date: "2026-10-03 10:15 WIB", note: "Diverifikasi dan diteruskan ke Wakasek Sarpras." },
      { status: "diproses", label: "Penugasan Teknisi Sarpras", date: "2026-10-04 09:00 WIB", note: "Pengadaan komponen stop kontak industri baru sedang disiapkan." },
    ]
  },
  {
    id: 2,
    ticket_number: "POSIS-ASP-202610-002",
    title: "Penambahan Debit Air dan Perbaikan Handle Pintu Toilet Siswa Gedung B",
    category: "toilet",
    body: "Aliran air di toilet lantai 2 gedung B sangat kecil setelah pukul 11:30 WIB, sehingga sering antre panjang menjelang sholat Dzuhur. Selain itu kait kunci di pintu bilik nomor 2 lepas.",
    is_anonymous: true,
    author_name: "Siswa SMKN 1 Ciomas (Anonim)",
    is_emergency: false,
    status: "ditindaklanjuti",
    created_at: "2026-09-29T10:00:00Z",
    due_date: "2026-10-08",
    upvotes_count: 88,
    comments_count: 19,
    has_voted: false,
    admin_reply: "Pipa pendorong toren air sudah dibersihkan dari endapan sedimen dan debit air telah normal kembali. Grendel pintu telah diganti baru oleh tim pemeliharaan.",
    timeline: [
      { status: "dikirim", label: "Aspirasi Terkirim", date: "2026-09-29 10:00 WIB", note: "Kategori Sanitasi & Toilet." },
      { status: "ditinjau", label: "Ditinjau Guru Pembina", date: "2026-09-30 08:00 WIB", note: "Diteruskan ke petugas kebersihan dan pemeliharaan gedung." },
      { status: "diproses", label: "Perbaikan Pipa Toren", date: "2026-10-01 13:00 WIB", note: "Pengerjaan sistem perpipaan dan penggantian handle pintu." },
      { status: "ditindaklanjuti", label: "Selesai Ditindaklanjuti", date: "2026-10-03 16:30 WIB", note: "Fasilitas telah diuji coba dan berfungsi dengan baik." },
    ]
  },
  {
    id: 3,
    ticket_number: "POSIS-ASP-202610-003",
    title: "Perluasan Bandwidth Wi-Fi Khusus Ruang Baca Perpustakaan",
    category: "perpustakaan",
    body: "Banyak siswa yang mengerjakan tugas modul digital dan mengakses e-book di perpustakaan mengalami kendala 'No Internet Access' ketika ruangan terisi lebih dari 20 orang. Mohon access point ditambah khusus area perpustakaan.",
    is_anonymous: false,
    author_name: "Nabila Ayu (XI DKV 1)",
    is_emergency: false,
    status: "menunggu_review",
    created_at: "2026-10-06T07:20:00Z",
    due_date: "2026-10-15",
    upvotes_count: 31,
    comments_count: 5,
    has_voted: false,
    admin_reply: null,
    timeline: [
      { status: "dikirim", label: "Aspirasi Terkirim", date: "2026-10-06 07:20 WIB", note: "Menunggu verifikasi pengurus OSIS seksi IT/Sarpras." }
    ]
  },
  {
    id: 4,
    ticket_number: "POSIS-ASP-202610-004",
    title: "Penambahan Garis Pembatas Lapangan dan Jaring Gawang Futsal Baru",
    category: "lapangan",
    body: "Garis cat putih di lapangan serbaguna sudah pudar sehingga sering membingungkan saat penilaian ujian praktik PJOK dan classmeeting. Jaring gawang sisi barat juga robek di bagian atas.",
    is_anonymous: false,
    author_name: "Faris Maulana (XI TKR 2)",
    is_emergency: false,
    status: "diproses",
    created_at: "2026-10-02T13:10:00Z",
    due_date: "2026-10-11",
    upvotes_count: 42,
    comments_count: 8,
    has_voted: false,
    admin_reply: "Usulan pengecatan ulang telah disetujui. Pengecatan akan dikerjakan pada hari Sabtu saat kegiatan belajar-mengajar libur agar cat cepat kering.",
    timeline: [
      { status: "dikirim", label: "Aspirasi Terkirim", date: "2026-10-02 13:10 WIB", note: "Kategori Sarana Lapangan Olahraga." },
      { status: "ditinjau", label: "Ditinjau Koordinator Sarpras", date: "2026-10-03 11:00 WIB", note: "Pembelian cat lapangan dan jaring baru telah diproses." },
      { status: "diproses", label: "Jadwal Pengecatan Ditentukan", date: "2026-10-05 10:00 WIB", note: "Pelaksanaan hari Sabtu mendatang." }
    ]
  }
];
