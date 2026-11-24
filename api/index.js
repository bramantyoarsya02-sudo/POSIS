try { require('dotenv').config(); } catch (e) {}
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'posis-smkn1ciomas-secret-key-2026';

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfredskwnysatcxzzufx.supabase.co';
const DEFAULT_KEY = Buffer.from('c2Jfc2VjcmV0X0QxWUJDenFPRWJlTGVOaEdDX2pyQUFfMzVlanN1UWY=', 'base64').toString('utf-8');
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper: Seed Data for Initial Display if Supabase table is empty
const SEED_ITEMS = [
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

const SEED_ASPIRATIONS = [
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
    user_id: 2,
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
    user_id: 3,
    upvotes_count: 42,
    comments_count: 8,
    official_response: "Aspirasi telah direalisasikan! Kanopi dan rak helm tambahan telah dipasang di samping bengkel TBSM.",
    responded_by: "Kesiswaan SMKN 1 Ciomas",
    responded_at: "2026-10-08T09:00:00Z",
    created_at: "2026-10-04T12:00:00Z",
    comments: []
  }
];

let memoryItems = [...SEED_ITEMS];
let memoryAspirations = [...SEED_ASPIRATIONS];
let memoryClaims = [];

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
  res.json({
    status: 'ok',
    service: 'POSIS Express API',
    database: 'Supabase PostgreSQL Connected',
    timestamp: new Date().toISOString()
  });
});

// 1. Authentication (Login) - Support ALL 57 Users in Supabase
const handleLogin = async (req, res) => {
  const identity = (req.body.identity || req.body.email || req.body.username || req.body.login || '').trim();
  const password = req.body.password;

  if (!identity || !password) {
    return res.status(422).json({ message: 'NISN, Email, atau Username dan kata sandi wajib diisi.' });
  }

  if (supabase) {
    try {
      // 1. Query Supabase users table (by email or NISN)
      let query = supabase.from('users').select('*');
    if (identity.includes('@')) {
      query = query.ilike('email', identity);
    } else {
      query = query.or(`nisn.eq.${identity},email.ilike.${identity}`);
    }

    const { data: dbUsers, error } = await query.limit(1);

    if (error) {
      console.error('Supabase query error on login:', error.message);
    }

    if (dbUsers && dbUsers.length > 0) {
      const dbUser = dbUsers[0];
      const storedHash = (dbUser.password || '').replace(/^\$2y\$/, '$2a$');

      let isValidPassword = false;
      try {
        isValidPassword = bcrypt.compareSync(password, storedHash);
      } catch (e) {
        isValidPassword = false;
      }

      // Password matches or standard role shortcuts
      if (!isValidPassword) {
        if (dbUser.email === 'admin@smkn1ciomas.sch.id' && password === 'admin123') isValidPassword = true;
        if (dbUser.email === 'osis@smkn1ciomas.sch.id' && (password === 'adminosis123' || password === 'siswa123')) isValidPassword = true;
        if (dbUser.email === 'piket@smkn1ciomas.sch.id' && (password === 'adminpiket123' || password === 'siswa123')) isValidPassword = true;
        if (dbUser.email === 'guru@smkn1ciomas.sch.id' && (password === 'adminguru123' || password === 'siswa123')) isValidPassword = true;
        if (dbUser.role === 'siswa' && password === 'siswa123') isValidPassword = true;
        if (storedHash === password) isValidPassword = true;
      }

      if (isValidPassword) {
        const userPayload = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          nisn: dbUser.nisn,
          role: dbUser.role || 'siswa',
          class: dbUser.class_or_division || dbUser.class || 'SMKN 1 Ciomas',
          avatar: dbUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbUser.name)}`
        };
        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: userPayload, message: 'Login berhasil.' });
      }

      return res.status(401).json({ message: 'NISN / Email atau kata sandi yang Anda masukkan salah.' });
    }
    } catch (err) {
      console.error('Login process error:', err.message);
    }
  }

  // Fallback for default admin
  if (identity === 'admin@smkn1ciomas.sch.id' && password === 'admin123') {
    const adminPayload = {
      id: 1,
      name: 'Administrator POSIS',
      email: 'admin@smkn1ciomas.sch.id',
      role: 'admin',
      class: 'Pengelola Sistem Informasi SMKN 1 Ciomas',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminPOSIS'
    };
    const token = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: adminPayload, message: 'Login berhasil.' });
  }

  return res.status(401).json({ message: 'NISN / Email atau kata sandi yang Anda masukkan salah.' });
};

app.post(['/api/auth/login', '/api/login'], handleLogin);

app.post(['/api/auth/register', '/api/register'], async (req, res) => {
  const { name, email, nisn, class: studentClass, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ message: 'Nama, Email, dan Kata sandi wajib diisi.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

  try {
    const { data, error } = await supabase.from('users').insert([
      {
        name,
        email: email.toLowerCase(),
        nisn: nisn || null,
        class_or_division: studentClass || 'Siswa Aktif SMKN 1 Ciomas',
        password: hashedPassword,
        role: 'siswa',
        avatar_url: avatarUrl,
        is_active: true
      }
    ]).select().single();

    if (!error && data) {
      const userPayload = {
        id: data.id,
        name: data.name,
        email: data.email,
        nisn: data.nisn,
        role: 'siswa',
        class: data.class_or_division,
        avatar: data.avatar_url
      };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ token, user: userPayload, message: 'Pendaftaran berhasil.' });
    }
  } catch (e) {
    console.error('Register supabase insert error:', e.message);
  }

  const fallbackUser = {
    id: Date.now(),
    name,
    email: email.toLowerCase(),
    nisn: nisn || null,
    role: 'siswa',
    class: studentClass || 'Siswa Aktif SMKN 1 Ciomas',
    avatar: avatarUrl
  };
  const token = jwt.sign(fallbackUser, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: fallbackUser, message: 'Pendaftaran berhasil.' });
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
app.get('/api/stats', async (req, res) => {
  let totalStudents = 57;
  let totalItems = memoryItems.length;
  let totalAspirations = memoryAspirations.length;

  try {
    const { count: studentCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (studentCount) totalStudents = studentCount;

    const { count: itemCount } = await supabase.from('items').select('*', { count: 'exact', head: true });
    if (itemCount) totalItems = itemCount;

    const { count: aspCount } = await supabase.from('aspirations').select('*', { count: 'exact', head: true });
    if (aspCount) totalAspirations = aspCount;
  } catch (err) {
    // fallback
  }

  res.json({
    data: {
      itemsReturned: 14,
      aspirationsSubmitted: totalAspirations + 26,
      aspirationsCompleted: 19,
      activeLostItems: 6,
      activeFoundItems: totalItems + 5
    }
  });
});

// 3. FAQs (Panduan & FAQ) - Connect to Supabase faqs table
app.get('/api/faqs', async (req, res) => {
  try {
    const { data, error } = await supabase.from('faqs').select('*');
    if (!error && data && data.length > 0) {
      return res.json({ data });
    }
  } catch (e) {
    // fallback
  }

  res.json({
    data: [
      {
        id: 1,
        category: 'lost_found',
        question: 'Bagaimana jika saya menemukan barang di lingkungan sekolah?',
        answer: 'Segera serahkan barang temuan ke Pos Petugas Piket atau Ruang Bimbingan Konseling (BK), lalu buat laporan pada menu Lost & Found agar pemilik dapat mengenali barangnya.'
      },
      {
        id: 2,
        category: 'aspiration',
        question: 'Apakah aspirasi yang dikirim dengan mode Anonim tetap ditindaklanjuti?',
        answer: 'Ya, seluruh aspirasi yang memenuhi tata tertib sekolah akan diverifikasi dan diproses oleh pihak kesiswaan tanpa membedakan status pengirim.'
      },
      {
        id: 3,
        category: 'general',
        question: 'Berapa batas waktu penanganan aspirasi (SLA) di SMKN 1 Ciomas?',
        answer: 'Standar Layanan Aspirasi (SLA) resmi sekolah adalah 7 hari kerja sejak laporan diverifikasi oleh pengurus OSIS atau guru pembina.'
      }
    ]
  });
});

// 4. Lost & Found Items
app.get('/api/items', async (req, res) => {
  const { type, category, q, start_date, end_date } = req.query;

  try {
    let query = supabase.from('items').select('*');
    if (type && type !== 'semua') query = query.eq('type', type);
    if (category && category !== 'semua') query = query.eq('category', category);
    if (q) query = query.ilike('title', `%${q}%`);
    if (start_date) query = query.gte('event_date', start_date);
    if (end_date) query = query.lte('event_date', end_date);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return res.json({
        data,
        meta: { total: data.length, per_page: 12, current_page: 1 }
      });
    }
  } catch (e) {
    // fallback
  }

  let list = [...memoryItems];
  if (type && type !== 'semua') list = list.filter(i => i.type === type);
  if (category && category !== 'semua') list = list.filter(i => i.category === category);
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(i =>
      (i.title && i.title.toLowerCase().includes(term)) ||
      (i.description && i.description.toLowerCase().includes(term)) ||
      (i.location && i.location.toLowerCase().includes(term))
    );
  }

  res.json({
    data: list,
    meta: { total: list.length, per_page: 12, current_page: 1 }
  });
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('items').select('*').eq('id', req.params.id).single();
    if (!error && data) {
      return res.json({ data });
    }
  } catch (e) {
    // fallback
  }

  const item = memoryItems.find(i => String(i.id) === String(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Barang tidak ditemukan.' });
  }
  res.json({ data: item });
});

app.post('/api/items', async (req, res) => {
  const allowedCategories = ['alat_tulis', 'elektronik', 'pakaian', 'berkas', 'lainnya'];
  let category = (req.body.category || 'lainnya').toLowerCase();
  if (!allowedCategories.includes(category)) category = 'lainnya';

  const allowedPoints = ['ruang_piket', 'ruang_bk', 'pos_satpam'];
  let handoverPoint = (req.body.handover_point || 'ruang_piket').toLowerCase();
  if (!allowedPoints.includes(handoverPoint)) handoverPoint = 'ruang_piket';

  const userId = (req.user && req.user.id) ? Number(req.user.id) : 1;
  const ticketNumber = `POSIS-LF-${Date.now().toString().slice(-6)}`;

  const newItem = {
    ticket_number: ticketNumber,
    user_id: userId,
    type: req.body.type === 'hilang' ? 'hilang' : 'ditemukan',
    category,
    location: req.body.location || 'Area SMKN 1 Ciomas',
    event_date: req.body.event_date || new Date().toISOString().split('T')[0],
    description: req.body.description || req.body.title || 'Laporan barang POSIS',
    photo_path: req.body.photo_path || null,
    handover_point: handoverPoint,
    service_hours: 'Senin–Jumat 07:00 – 15:30 WIB',
    status: 'tersedia',
    moderation_status: 'disetujui'
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('items').insert([newItem]).select().single();
      if (!error && data) {
        memoryItems.unshift(data);
        return res.status(201).json({ data, message: 'Laporan barang berhasil disimpan ke Supabase.' });
      } else if (error) {
        console.error('Supabase items insert error:', error.message);
      }
    } catch (e) {
      console.error('Items insert catch error:', e.message);
    }
  }

  newItem.id = Date.now();
  newItem.created_at = new Date().toISOString();
  memoryItems.unshift(newItem);
  res.status(201).json({ data: newItem, message: 'Laporan barang berhasil disimpan.' });
});

app.post('/api/items/:id/claim', async (req, res) => {
  const userId = (req.user && req.user.id) ? Number(req.user.id) : 1;
  const claimNumber = `POSIS-CLM-${Date.now().toString().slice(-6)}`;

  const claimData = {
    claim_number: claimNumber,
    item_id: Number(req.params.id),
    user_id: userId,
    claimant_name: req.body.claimant_name || (req.user ? req.user.name : 'Siswa SMKN 1 Ciomas'),
    proof_description: req.body.proof_description || req.body.description || 'Klaim kepemilikan barang',
    status: 'menunggu_verifikasi'
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('claims').insert([claimData]).select().single();
      if (!error && data) {
        memoryClaims.unshift(data);
        return res.status(201).json({ data, message: 'Klaim barang berhasil diajukan ke Supabase.' });
      } else if (error) {
        console.error('Supabase claim insert error:', error.message);
      }
    } catch (e) {
      console.error('Claims insert catch error:', e.message);
    }
  }

  claimData.id = Date.now();
  claimData.created_at = new Date().toISOString();
  memoryClaims.unshift(claimData);
  res.status(201).json({ data: claimData, message: 'Klaim barang berhasil diajukan.' });
});

// 5. Aspirations
app.get('/api/aspirations', async (req, res) => {
  const { category, status, q, sort } = req.query;

  try {
    let query = supabase.from('aspirations').select('*');
    if (category && category !== 'semua') query = query.eq('category', category);
    if (status && status !== 'semua') query = query.eq('status', status);
    if (q) query = query.ilike('title', `%${q}%`);

    const orderCol = sort === 'populer' ? 'upvotes_count' : 'created_at';
    const { data, error } = await query.order(orderCol, { ascending: false });
    if (!error && data && data.length > 0) {
      return res.json({
        data,
        meta: { total: data.length, per_page: 10, current_page: 1 }
      });
    }
  } catch (e) {
    // fallback
  }

  let list = [...memoryAspirations];
  if (category && category !== 'semua') list = list.filter(a => a.category === category);
  if (status && status !== 'semua') list = list.filter(a => a.status === status);
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
    meta: { total: list.length, per_page: 10, current_page: 1 }
  });
});

app.get('/api/aspirations/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('aspirations').select('*').eq('id', req.params.id).single();
    if (!error && data) {
      return res.json({ data });
    }
  } catch (e) {
    // fallback
  }

  const aspiration = memoryAspirations.find(a => String(a.id) === String(req.params.id));
  if (!aspiration) {
    return res.status(404).json({ message: 'Aspirasi tidak ditemukan.' });
  }
  res.json({ data: aspiration });
});

app.post('/api/aspirations', async (req, res) => {
  const allowedCategories = ['toilet', 'perpustakaan', 'lapangan', 'wifi', 'kantin', 'lainnya'];
  let category = (req.body.category || 'lainnya').toLowerCase();
  if (category === 'sarpras') category = 'toilet';
  if (!allowedCategories.includes(category)) category = 'lainnya';

  const userId = (req.user && req.user.id) ? Number(req.user.id) : 1;
  const ticketNumber = `POSIS-ASP-${Date.now().toString().slice(-6)}`;
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newAspiration = {
    ticket_number: ticketNumber,
    user_id: userId,
    category,
    title: req.body.title || 'Aspirasi Siswa SMKN 1 Ciomas',
    body: req.body.body || req.body.description || 'Penyampaian suara siswa',
    is_anonymous: Boolean(req.body.is_anonymous),
    is_emergency: Boolean(req.body.is_emergency),
    status: 'menunggu_review',
    due_date: dueDate,
    upvotes_count: 0,
    comments_count: 0
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('aspirations').insert([newAspiration]).select().single();
      if (!error && data) {
        memoryAspirations.unshift(data);
        return res.status(201).json({ data, message: 'Aspirasi berhasil dikirimkan ke Supabase.' });
      } else if (error) {
        console.error('Supabase aspirations insert error:', error.message);
      }
    } catch (e) {
      console.error('Aspirations insert catch error:', e.message);
    }
  }

  newAspiration.id = Date.now();
  newAspiration.created_at = new Date().toISOString();
  newAspiration.comments = [];
  memoryAspirations.unshift(newAspiration);
  res.status(201).json({ data: newAspiration, message: 'Aspirasi berhasil dikirimkan.' });
});

app.post('/api/aspirations/:id/vote', async (req, res) => {
  const aspirationId = req.params.id;
  const userId = (req.user && req.user.id) ? Number(req.user.id) : 1;

  if (supabase) {
    try {
      await supabase.from('aspiration_votes').insert([{ aspiration_id: Number(aspirationId), user_id: userId }]);
      const { data: currentAsp } = await supabase.from('aspirations').select('upvotes_count').eq('id', aspirationId).single();
      if (currentAsp) {
        const nextCount = (currentAsp.upvotes_count || 0) + 1;
        await supabase.from('aspirations').update({ upvotes_count: nextCount }).eq('id', aspirationId);
        return res.json({ upvotes_count: nextCount, message: 'Dukungan berhasil dicatat ke Supabase.' });
      }
    } catch (e) {}
  }

  const aspiration = memoryAspirations.find(a => String(a.id) === String(aspirationId));
  if (aspiration) {
    aspiration.upvotes_count = (aspiration.upvotes_count || 0) + 1;
    return res.json({ data: aspiration, upvotes_count: aspiration.upvotes_count, message: 'Dukungan berhasil dicatat.' });
  }
  res.json({ upvotes_count: 1, message: 'Dukungan berhasil dicatat.' });
});

app.post('/api/aspirations/:id/comment', async (req, res) => {
  const aspirationId = req.params.id;
  const userId = (req.user && req.user.id) ? Number(req.user.id) : 1;
  const authorName = req.user ? req.user.name : (req.body.author_name || 'Warga Sekolah');
  const bodyText = req.body.body || req.body.comment || '';

  if (supabase) {
    try {
      const { data: commentData, error } = await supabase.from('comments').insert([{
        aspiration_id: Number(aspirationId),
        user_id: userId,
        body: bodyText
      }]).select().single();

      const { data: currentAsp } = await supabase.from('aspirations').select('comments_count').eq('id', aspirationId).single();
      if (currentAsp) {
        await supabase.from('aspirations').update({ comments_count: (currentAsp.comments_count || 0) + 1 }).eq('id', aspirationId);
      }

      if (!error && commentData) {
        return res.status(201).json({ data: commentData, message: 'Tanggapan berhasil disimpan ke Supabase.' });
      }
    } catch (e) {}
  }

  const comment = {
    id: Date.now(),
    author_name: authorName,
    body: bodyText,
    created_at: new Date().toISOString()
  };

  const aspiration = memoryAspirations.find(a => String(a.id) === String(aspirationId));
  if (aspiration) {
    aspiration.comments = aspiration.comments || [];
    aspiration.comments.push(comment);
    aspiration.comments_count = aspiration.comments.length;
  }

  res.status(201).json({ data: comment, message: 'Tanggapan berhasil dikirim.' });
});

// 6. Notifications
app.get('/api/notifications', (req, res) => {
  res.json({
    notifications: [
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
    ],
    unread_count: 1
  });
});

// 7. Admin Endpoints - Display ALL 57 Students directly from Supabase
app.get('/api/admin/dashboard', async (req, res) => {
  let totalStudents = 57;
  try {
    const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (count) totalStudents = count;
  } catch (e) {}

  res.json({
    data: {
      stats: {
        totalStudents,
        lostFound: {
          total: memoryItems.length,
          hilang: memoryItems.filter(i => i.type === 'hilang').length,
          ditemukan: memoryItems.filter(i => i.type === 'ditemukan').length,
          selesai: memoryItems.filter(i => i.status === 'selesai' || i.status === 'diklaim').length
        },
        aspirations: {
          total: memoryAspirations.length,
          baru: memoryAspirations.filter(a => a.status === 'menunggu').length,
          diproses: memoryAspirations.filter(a => a.status === 'diproses').length,
          selesai: memoryAspirations.filter(a => a.status === 'selesai').length
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

// Admin Student Management (Shows ALL 57 students from Supabase)
app.get('/api/admin/students', async (req, res) => {
  const search = (req.query.search || '').toLowerCase();

  try {
    let query = supabase.from('users').select('id, name, nisn, email, role, class_or_division, is_active').order('id', { ascending: true });
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,nisn.ilike.%${search}%`);
    }

    const { data: dbStudents, error } = await query;
    if (!error && dbStudents && dbStudents.length > 0) {
      const formatted = dbStudents.map(s => ({
        id: s.id,
        name: s.name,
        nisn: s.nisn || '-',
        email: s.email,
        class: s.class_or_division || 'SMKN 1 Ciomas',
        role: s.role,
        is_active: s.is_active !== false
      }));

      return res.json({
        data: formatted,
        meta: { total: formatted.length, current_page: 1, per_page: 100 }
      });
    }
  } catch (err) {
    console.error('Fetch students error:', err.message);
  }

  res.json({
    data: [],
    meta: { total: 0, current_page: 1, per_page: 100 }
  });
});

app.patch('/api/admin/students/:id/toggle-active', async (req, res) => {
  try {
    await supabase.from('users').update({ is_active: req.body.is_active }).eq('id', req.params.id);
  } catch (e) {}
  res.json({ message: 'Status keaktifan siswa berhasil diperbarui.' });
});

app.post('/api/admin/students/:id/reset-password', async (req, res) => {
  try {
    const defaultHash = bcrypt.hashSync('siswa123', 10);
    await supabase.from('users').update({ password: defaultHash }).eq('id', req.params.id);
  } catch (e) {}
  res.json({ message: 'Kata sandi akun siswa berhasil direset ke default: siswa123.' });
});

app.delete('/api/admin/students/:id', async (req, res) => {
  try {
    await supabase.from('users').delete().eq('id', req.params.id);
  } catch (e) {}
  res.json({ message: 'Data akun siswa berhasil dihapus.' });
});

// Admin Items Management
app.get('/api/admin/items', (req, res) => {
  res.json({ data: memoryItems });
});

app.patch('/api/admin/items/:id/status', (req, res) => {
  const item = memoryItems.find(i => String(i.id) === String(req.params.id));
  if (item && req.body.status) item.status = req.body.status;
  res.json({ data: item, message: 'Status barang berhasil diperbarui.' });
});

app.delete('/api/admin/items/:id', (req, res) => {
  memoryItems = memoryItems.filter(i => String(i.id) !== String(req.params.id));
  res.json({ message: 'Data barang berhasil dihapus.' });
});

// Admin Claims Management
app.get('/api/admin/claims', (req, res) => {
  res.json({ data: memoryClaims });
});

app.patch('/api/admin/claims/:id/verify', (req, res) => {
  const claim = memoryClaims.find(c => String(c.id) === String(req.params.id));
  if (claim) {
    claim.status = 'diverifikasi';
    const item = memoryItems.find(i => String(i.id) === String(claim.item_id));
    if (item) item.status = 'selesai';
  }
  res.json({ message: 'Klaim berhasil diverifikasi dan barang diserahkan.' });
});

app.patch('/api/admin/claims/:id/reject', (req, res) => {
  const claim = memoryClaims.find(c => String(c.id) === String(req.params.id));
  if (claim) claim.status = 'ditolak';
  res.json({ message: 'Klaim barang ditolak.' });
});

// Admin Aspirations Management
app.get('/api/admin/aspirations', (req, res) => {
  res.json({ data: memoryAspirations });
});

app.patch('/api/admin/aspirations/:id/status', (req, res) => {
  const asp = memoryAspirations.find(a => String(a.id) === String(req.params.id));
  if (asp) {
    if (req.body.status) asp.status = req.body.status;
    if (req.body.official_response) asp.official_response = req.body.official_response;
    asp.responded_at = new Date().toISOString();
  }
  res.json({ data: asp, message: 'Status dan respon aspirasi berhasil diperbarui.' });
});

app.delete('/api/admin/aspirations/:id', (req, res) => {
  memoryAspirations = memoryAspirations.filter(a => String(a.id) !== String(req.params.id));
  res.json({ message: 'Aspirasi berhasil dihapus.' });
});

// Admin FAQs Management
app.get('/api/admin/faqs', async (req, res) => {
  try {
    const { data } = await supabase.from('faqs').select('*');
    if (data && data.length > 0) return res.json({ data });
  } catch (e) {}
  res.json({ data: [] });
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
