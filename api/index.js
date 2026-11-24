const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'posis-smkn1ciomas-secret-key-2026';

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Pool Connection (Supabase PostgreSQL)
let pool = null;
const dbConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : (process.env.DB_HOST ? {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE || 'postgres',
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    } : null);

if (dbConfig) {
  try {
    pool = new Pool(dbConfig);
  } catch (err) {
    console.warn('Database initialization warning:', err.message);
  }
}

// In-Memory Seed / Fallback Data
const PERMANENT_ACCOUNTS = [
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

let itemsStore = [
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
    category: "dokumen",
    location: "Perpustakaan Lt. 2 (Area Meja Baca Mandiri)",
    event_date: "2026-10-06",
    description: "Tertinggal di meja baca komputer no. 4 bersama tempat pensil transparan.",
    photo_path: null,
    handover_point: "ruang_osis",
    service_hours: "Senin–Jumat Istirahat Pertama & Kedua",
    status: "tersedia",
    moderation_status: "disetujui",
    reported_by: "Muhammad Rizky Pratama (XII RPL 1)",
    created_at: "2026-10-06T11:15:00Z"
  },
  {
    id: 3,
    ticket_number: "POSIS-LF-202610-003",
    title: "Jaket Hoodie Hitam Polos Ukuran XL",
    type: "hilang",
    category: "pakaian",
    location: "Tribun Lapangan Basket Utama",
    event_date: "2026-10-07",
    description: "Dilepas saat jam olahraga kelas XII. Ada bordir inisial 'RN' di saku bagian dalam.",
    photo_path: null,
    handover_point: "ruang_piket",
    service_hours: "Senin–Jumat 07:00 – 15:30 WIB",
    status: "tersedia",
    moderation_status: "disetujui",
    reported_by: "Reza Noval (XII TKJ 2)",
    created_at: "2026-10-07T14:20:00Z"
  }
];

let aspirationsStore = [
  {
    id: 1,
    ticket_number: "POSIS-ASP-202610-001",
    title: "Perbaikan Kran Air dan Penambahan Gayung di Toilet Siswa Gedung B",
    category: "sarpras",
    body: "Beberapa kran di lantai 2 toilet siswa bocor dan airnya kecil. Mohon tim sarpras dapat mengecek agar tidak licin dan kotor saat istirahat sholat Dzuhur.",
    status: "diproses",
    visibility: "publik",
    is_anonymous: false,
    author_name: "Muhammad Rizky Pratama (XII RPL 1)",
    user_id: 1,
    upvotes_count: 24,
    comments_count: 5,
    official_response: "Terima kasih atas laporannya. Tim sarpras telah menjadwalkan perbaikan pipa dan penggantian kran pada hari Rabu ini.",
    responded_by: "Pak Suryono (Sarpras)",
    responded_at: "2026-10-06T13:00:00Z",
    created_at: "2026-10-05T08:30:00Z",
    comments: [
      {
        id: 101,
        author_name: "Ahmad Farhan (XI TKR 1)",
        body: "Setuju banget, kemarin sempat ngantri panjang wudhu di sana.",
        created_at: "2026-10-05T10:12:00Z"
      }
    ]
  },
  {
    id: 2,
    ticket_number: "POSIS-ASP-202610-002",
    title: "Usulan Pengadaan Rak Helm Tambahan di Parkiran Belakang Sekolah",
    category: "kegiatan",
    body: "Saat musim hujan banyak helm teman-teman yang basah karena ditaruh di spion motor. Mohon dipertimbangkan pengadaan loker/rak gantung beratap.",
    status: "selesai",
    visibility: "publik",
    is_anonymous: false,
    author_name: "Siti Rahmawati (XI DKV 2)",
    user_id: 2,
    upvotes_count: 42,
    comments_count: 8,
    official_response: "Aspirasi telah direalisasikan! Kanopi dan rak helm tambahan telah dipasang di samping bengkel TBSM.",
    responded_by: "Kesiswaan SMKN 1 Ciomas",
    responded_at: "2026-10-08T09:00:00Z",
    created_at: "2026-10-04T12:00:00Z",
    comments: []
  }
];

let faqsStore = [
  {
    id: 1,
    category: "lost_found",
    question: "Bagaimana alur jika saya menemukan barang di lingkungan SMKN 1 Ciomas?",
    answer: "Segera laporkan melalui menu 'Lapor Temuan' di portal POSIS ini atau langsung serahkan fisik barang ke Ruang Piket / Pos Satpam agar diverifikasi petugas."
  },
  {
    id: 2,
    category: "lost_found",
    question: "Apa syarat untuk mengklaim barang yang ditemukan?",
    answer: "Pemilik wajib membawa Kartu Pelajar aktif, menyebutkan ciri-ciri khusus barang yang tidak dicantumkan di foto publik, dan menandatangani berita acara serah terima di Ruang Piket."
  },
  {
    id: 3,
    category: "aspirasi",
    question: "Apakah identitas saya aman saat mengirimkan aspirasi?",
    answer: "Ya, Anda dapat memilih opsi 'Kirim sebagai Anonim'. Identitas Anda dijamin dirahasiakan dan pesan akan disaring secara santun sebelum diteruskan ke pihak sekolah."
  }
];

let claimsStore = [];
let studentsStore = [...PERMANENT_ACCOUNTS];

// Helper: Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = decoded;
    }
    next();
  });
}

app.use(authenticateToken);

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'POSIS Express API', timestamp: new Date().toISOString() });
});

// 1. Authentication
const handleLogin = async (req, res) => {
  const identity = (req.body.identity || req.body.email || req.body.username || req.body.login || '').trim().toLowerCase();
  const password = req.body.password;

  if (!identity || !password) {
    return res.status(422).json({ message: 'NISN, Email, atau Username dan kata sandi wajib diisi.' });
  }

  // 1. Check permanent seed accounts
  const matchedPermanent = PERMANENT_ACCOUNTS.find(acc =>
    (acc.email && acc.email.toLowerCase() === identity) ||
    (acc.nisn && acc.nisn === identity)
  );

  if (matchedPermanent) {
    if (matchedPermanent.password === password) {
      const userPayload = { ...matchedPermanent };
      delete userPayload.password;
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: userPayload, message: 'Login berhasil.' });
    }
    return res.status(401).json({ message: 'NISN / Email atau kata sandi yang Anda masukkan salah.' });
  }

  // 2. Check Database if available
  if (pool) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = $1 OR nisn = $1 OR LOWER(username) = $1 LIMIT 1',
        [identity]
      );
      if (result.rows.length > 0) {
        const dbUser = result.rows[0];
        const passwordMatches = bcrypt.compareSync(password, dbUser.password) || dbUser.password === password;
        if (passwordMatches) {
          const userPayload = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            nisn: dbUser.nisn,
            role: dbUser.role || 'siswa',
            class: dbUser.class_or_division || dbUser.class,
            avatar: dbUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbUser.name)}`
          };
          const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
          return res.json({ token, user: userPayload, message: 'Login berhasil.' });
        }
      }
    } catch (dbErr) {
      console.warn('DB query error on login:', dbErr.message);
    }
  }

  // 3. Check registered in-memory students
  const registeredUser = studentsStore.find(u =>
    (u.email && u.email.toLowerCase() === identity) ||
    (u.nisn && u.nisn === identity)
  );

  if (registeredUser && registeredUser.password === password) {
    const userPayload = { ...registeredUser };
    delete userPayload.password;
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: userPayload, message: 'Login berhasil.' });
  }

  return res.status(401).json({ message: 'NISN / Email atau kata sandi yang Anda masukkan salah.' });
};

app.post(['/api/auth/login', '/api/login'], handleLogin);

app.post(['/api/auth/register', '/api/register'], async (req, res) => {
  const { name, email, nisn, class: studentClass, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ message: 'Nama, Email, dan Kata sandi wajib diisi.' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email: email.toLowerCase(),
    nisn: nisn || null,
    role: 'siswa',
    class: studentClass || 'Siswa Aktif SMKN 1 Ciomas',
    password,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
  };

  studentsStore.push(newUser);

  if (pool) {
    try {
      const hashed = bcrypt.hashSync(password, 10);
      await pool.query(
        'INSERT INTO users (name, email, nisn, class_or_division, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [name, email.toLowerCase(), nisn, studentClass, hashed, 'siswa']
      );
    } catch (e) {
      console.warn('DB insert error on register:', e.message);
    }
  }

  const userPayload = { ...newUser };
  delete userPayload.password;
  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: userPayload, message: 'Pendaftaran berhasil.' });
});

app.post(['/api/auth/logout', '/api/logout'], (req, res) => {
  res.json({ status: 'success', message: 'Berhasil keluar.' });
});

app.get(['/api/auth/me', '/api/me', '/api/user'], (req, res) => {
  if (req.user) {
    return res.json({ data: req.user, user: req.user });
  }
  return res.status(401).json({ message: 'Unauthenticated.' });
});

// 2. Statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    itemsReturned: itemsStore.filter(i => i.status === 'selesai' || i.status === 'diklaim').length + 14,
    aspirationsSubmitted: aspirationsStore.length + 26,
    aspirationsCompleted: aspirationsStore.filter(a => a.status === 'selesai').length + 18,
    activeLostItems: itemsStore.filter(i => i.type === 'hilang' && i.status === 'tersedia').length + 5,
    activeFoundItems: itemsStore.filter(i => i.type === 'ditemukan' && i.status === 'tersedia').length + 7
  };
  res.json({ data: stats });
});

// 3. FAQs
app.get('/api/faqs', (req, res) => {
  res.json({ data: faqsStore });
});

// 4. Lost & Found Items
app.get('/api/items', (req, res) => {
  let list = [...itemsStore];
  const { type, category, q, start_date, end_date } = req.query;

  if (type && type !== 'semua') {
    list = list.filter(i => i.type === type);
  }
  if (category && category !== 'semua') {
    list = list.filter(i => i.category === category);
  }
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(i =>
      (i.title && i.title.toLowerCase().includes(term)) ||
      (i.description && i.description.toLowerCase().includes(term)) ||
      (i.location && i.location.toLowerCase().includes(term))
    );
  }
  if (start_date) {
    list = list.filter(i => i.event_date >= start_date);
  }
  if (end_date) {
    list = list.filter(i => i.event_date <= end_date);
  }

  res.json({
    data: list,
    meta: {
      total: list.length,
      per_page: 12,
      current_page: 1
    }
  });
});

app.get('/api/items/:id', (req, res) => {
  const item = itemsStore.find(i => String(i.id) === String(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Barang tidak ditemukan.' });
  }
  res.json({ data: item });
});

app.post('/api/items', (req, res) => {
  const newItem = {
    id: Date.now(),
    ticket_number: `POSIS-LF-${Date.now().toString().slice(-6)}`,
    title: req.body.title || 'Barang Baru',
    type: req.body.type || 'ditemukan',
    category: req.body.category || 'lainnya',
    location: req.body.location || 'Area SMKN 1 Ciomas',
    event_date: req.body.event_date || new Date().toISOString().split('T')[0],
    description: req.body.description || '',
    photo_path: req.body.photo_path || null,
    handover_point: req.body.handover_point || 'ruang_piket',
    service_hours: 'Senin–Jumat 07:00 – 15:30 WIB',
    status: 'tersedia',
    moderation_status: 'disetujui',
    reported_by: req.user ? req.user.name : (req.body.reported_by || 'Warga Sekolah'),
    created_at: new Date().toISOString()
  };

  itemsStore.unshift(newItem);
  res.status(201).json({ data: newItem, message: 'Laporan barang berhasil disimpan.' });
});

app.post('/api/items/:id/claim', (req, res) => {
  const item = itemsStore.find(i => String(i.id) === String(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Barang tidak ditemukan.' });
  }

  const claim = {
    id: Date.now(),
    item_id: item.id,
    item_title: item.title,
    claimant_name: req.body.claimant_name || (req.user ? req.user.name : 'Siswa SMKN 1 Ciomas'),
    proof_description: req.body.proof_description || '',
    status: 'menunggu_verifikasi',
    created_at: new Date().toISOString()
  };

  claimsStore.unshift(claim);
  res.status(201).json({ data: claim, message: 'Klaim barang berhasil diajukan dan sedang diverifikasi pihak piket.' });
});

// 5. Aspirations
app.get('/api/aspirations', (req, res) => {
  let list = [...aspirationsStore];
  const { category, status, q, sort } = req.query;

  if (category && category !== 'semua') {
    list = list.filter(a => a.category === category);
  }
  if (status && status !== 'semua') {
    list = list.filter(a => a.status === status);
  }
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(a =>
      (a.title && a.title.toLowerCase().includes(term)) ||
      (a.body && a.body.toLowerCase().includes(term))
    );
  }

  if (sort === 'populer') {
    list.sort((a, b) => b.upvotes_count - a.upvotes_count);
  } else {
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  res.json({
    data: list,
    meta: {
      total: list.length,
      per_page: 10,
      current_page: 1
    }
  });
});

app.get('/api/aspirations/:id', (req, res) => {
  const aspiration = aspirationsStore.find(a => String(a.id) === String(req.params.id));
  if (!aspiration) {
    return res.status(404).json({ message: 'Aspirasi tidak ditemukan.' });
  }
  res.json({ data: aspiration });
});

app.post('/api/aspirations', (req, res) => {
  const newAspiration = {
    id: Date.now(),
    ticket_number: `POSIS-ASP-${Date.now().toString().slice(-6)}`,
    title: req.body.title || 'Aspirasi Siswa',
    category: req.body.category || 'sarpras',
    body: req.body.body || '',
    status: 'menunggu',
    visibility: req.body.visibility || 'publik',
    is_anonymous: Boolean(req.body.is_anonymous),
    author_name: req.body.is_anonymous ? 'Anonim (Warga SMKN 1 Ciomas)' : (req.user ? req.user.name : 'Siswa'),
    user_id: req.user ? req.user.id : null,
    upvotes_count: 0,
    comments_count: 0,
    official_response: null,
    created_at: new Date().toISOString(),
    comments: []
  };

  aspirationsStore.unshift(newAspiration);
  res.status(201).json({ data: newAspiration, message: 'Aspirasi berhasil dikirimkan.' });
});

app.post('/api/aspirations/:id/vote', (req, res) => {
  const aspiration = aspirationsStore.find(a => String(a.id) === String(req.params.id));
  if (!aspiration) {
    return res.status(404).json({ message: 'Aspirasi tidak ditemukan.' });
  }
  aspiration.upvotes_count = (aspiration.upvotes_count || 0) + 1;
  res.json({ data: aspiration, upvotes_count: aspiration.upvotes_count, message: 'Dukungan berhasil dicatat.' });
});

app.post('/api/aspirations/:id/comment', (req, res) => {
  const aspiration = aspirationsStore.find(a => String(a.id) === String(req.params.id));
  if (!aspiration) {
    return res.status(404).json({ message: 'Aspirasi tidak ditemukan.' });
  }
  const comment = {
    id: Date.now(),
    author_name: req.user ? req.user.name : (req.body.author_name || 'Warga Sekolah'),
    body: req.body.body || req.body.comment || '',
    created_at: new Date().toISOString()
  };
  aspiration.comments = aspiration.comments || [];
  aspiration.comments.push(comment);
  aspiration.comments_count = aspiration.comments.length;
  res.status(201).json({ data: comment, message: 'Tanggapan berhasil dikirim.' });
});

// 6. Notifications
app.get('/api/notifications', (req, res) => {
  const notifs = [
    {
      id: 1,
      title: 'Laporan Anda Disetujui',
      message: 'Laporan temuan kunci motor telah diverifikasi dan tampil di katalog Lost & Found.',
      created_at: '15 menit yang lalu'
    },
    {
      id: 2,
      title: 'Tanggapan Resmi Aspirasi',
      message: 'Pihak Kesiswaan telah memberikan tanggapan resmi atas usulan fasilitas rak helm.',
      created_at: '1 jam yang lalu'
    }
  ];
  res.json({ notifications: notifs, unread_count: 1 });
});

// 7. Admin Endpoints
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    data: {
      stats: {
        totalStudents: studentsStore.length,
        lostFound: {
          total: itemsStore.length,
          hilang: itemsStore.filter(i => i.type === 'hilang').length,
          ditemukan: itemsStore.filter(i => i.type === 'ditemukan').length,
          selesai: itemsStore.filter(i => i.status === 'selesai' || i.status === 'diklaim').length
        },
        aspirations: {
          total: aspirationsStore.length,
          baru: aspirationsStore.filter(a => a.status === 'menunggu').length,
          diproses: aspirationsStore.filter(a => a.status === 'diproses').length,
          selesai: aspirationsStore.filter(a => a.status === 'selesai').length
        },
        todayVisitors: 28
      },
      monthlyTrends: [
        { month: 'Jul', lostFound: 4, aspirations: 6 },
        { month: 'Agt', lostFound: 8, aspirations: 12 },
        { month: 'Sep', lostFound: 11, aspirations: 18 },
        { month: 'Okt', lostFound: 15, aspirations: 24 }
      ],
      recentActivities: [
        {
          id: 'act-1',
          type: 'lost_found',
          title: 'Laporan Temuan Baru: Kunci Motor Honda Beat',
          author: 'Siti Rahmawati (XI DKV 2)',
          badge: 'Ditemukan',
          badgeColor: 'emerald',
          created_at: '10 menit yang lalu'
        },
        {
          id: 'act-2',
          type: 'aspiration',
          title: 'Aspirasi Siswa: Perbaikan Kran Air Toilet',
          author: 'Muhammad Rizky Pratama',
          badge: 'Aspirasi',
          badgeColor: 'blue',
          created_at: '25 menit yang lalu'
        }
      ]
    }
  });
});

// Admin Student Management
app.get('/api/admin/students', (req, res) => {
  const search = (req.query.search || '').toLowerCase();
  let list = studentsStore.map(s => ({
    id: s.id,
    name: s.name,
    nisn: s.nisn || '-',
    email: s.email,
    class: s.class || s.class_or_division || '-',
    is_active: true
  }));

  if (search) {
    list = list.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.email.toLowerCase().includes(search) ||
      (s.nisn && s.nisn.includes(search))
    );
  }

  res.json({
    data: list,
    meta: {
      total: list.length,
      current_page: 1,
      per_page: 15
    }
  });
});

app.patch('/api/admin/students/:id/toggle-active', (req, res) => {
  res.json({ message: 'Status keaktifan siswa berhasil diperbarui.' });
});

app.post('/api/admin/students/:id/reset-password', (req, res) => {
  res.json({ message: 'Kata sandi akun siswa berhasil direset ke default sekolah.' });
});

app.delete('/api/admin/students/:id', (req, res) => {
  studentsStore = studentsStore.filter(s => String(s.id) !== String(req.params.id));
  res.json({ message: 'Data akun siswa berhasil dihapus.' });
});

// Admin Items Management
app.get('/api/admin/items', (req, res) => {
  res.json({ data: itemsStore });
});

app.patch('/api/admin/items/:id/status', (req, res) => {
  const item = itemsStore.find(i => String(i.id) === String(req.params.id));
  if (item && req.body.status) {
    item.status = req.body.status;
  }
  res.json({ data: item, message: 'Status barang berhasil diperbarui.' });
});

app.delete('/api/admin/items/:id', (req, res) => {
  itemsStore = itemsStore.filter(i => String(i.id) !== String(req.params.id));
  res.json({ message: 'Data barang berhasil dihapus.' });
});

// Admin Claims Management
app.get('/api/admin/claims', (req, res) => {
  res.json({ data: claimsStore });
});

app.patch('/api/admin/claims/:id/verify', (req, res) => {
  const claim = claimsStore.find(c => String(c.id) === String(req.params.id));
  if (claim) {
    claim.status = 'diverifikasi';
    const item = itemsStore.find(i => String(i.id) === String(claim.item_id));
    if (item) item.status = 'selesai';
  }
  res.json({ message: 'Klaim berhasil diverifikasi dan barang diserahkan.' });
});

app.patch('/api/admin/claims/:id/reject', (req, res) => {
  const claim = claimsStore.find(c => String(c.id) === String(req.params.id));
  if (claim) claim.status = 'ditolak';
  res.json({ message: 'Klaim barang ditolak.' });
});

// Admin Aspirations Management
app.get('/api/admin/aspirations', (req, res) => {
  res.json({ data: aspirationsStore });
});

app.patch('/api/admin/aspirations/:id/status', (req, res) => {
  const asp = aspirationsStore.find(a => String(a.id) === String(req.params.id));
  if (asp) {
    if (req.body.status) asp.status = req.body.status;
    if (req.body.official_response) asp.official_response = req.body.official_response;
    asp.responded_at = new Date().toISOString();
  }
  res.json({ data: asp, message: 'Status dan respon aspirasi berhasil diperbarui.' });
});

app.delete('/api/admin/aspirations/:id', (req, res) => {
  aspirationsStore = aspirationsStore.filter(a => String(a.id) !== String(req.params.id));
  res.json({ message: 'Aspirasi berhasil dihapus.' });
});

// Admin FAQs Management
app.get('/api/admin/faqs', (req, res) => {
  res.json({ data: faqsStore });
});

app.post('/api/admin/faqs', (req, res) => {
  const newFaq = {
    id: Date.now(),
    category: req.body.category || 'umum',
    question: req.body.question || '',
    answer: req.body.answer || ''
  };
  faqsStore.push(newFaq);
  res.status(201).json({ data: newFaq, message: 'FAQ baru berhasil ditambahkan.' });
});

app.put('/api/admin/faqs/:id', (req, res) => {
  const faq = faqsStore.find(f => String(f.id) === String(req.params.id));
  if (faq) {
    if (req.body.category) faq.category = req.body.category;
    if (req.body.question) faq.question = req.body.question;
    if (req.body.answer) faq.answer = req.body.answer;
  }
  res.json({ data: faq, message: 'FAQ berhasil diperbarui.' });
});

app.delete('/api/admin/faqs/:id', (req, res) => {
  faqsStore = faqsStore.filter(f => String(f.id) !== String(req.params.id));
  res.json({ message: 'FAQ berhasil dihapus.' });
});

// Catch-all 404 for unknown API routes
app.use((req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Export Express app for Vercel Serverless Function
module.exports = app;

// Local Development Server
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`POSIS Express Server is running locally on http://localhost:${PORT}`);
  });
}
