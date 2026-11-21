-- ============================================================
-- SKEMA RESMI SUPABASE (POSTGRESQL): db_posis
-- PORTAL LAYANAN INFORMASI & SUARA SISWA (POSIS)
-- SMK NEGERI 1 CIOMAS
--
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Klik menu "SQL Editor" di bilah kiri
-- 3. Klik "New query" -> Paste seluruh isi file ini -> Klik "Run"
-- ============================================================

-- ------------------------------------------------------------
-- 0. BERSIHKAN TABEL LAMA JIKA ADA (Aman Dependency Cascade)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS migrations CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS personal_access_tokens CASCADE;
DROP TABLE IF EXISTS daily_submissions CASCADE;
DROP TABLE IF EXISTS content_reports CASCADE;
DROP TABLE IF EXISTS status_logs CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS aspiration_votes CASCADE;
DROP TABLE IF EXISTS aspirations CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 1. TABEL PENGGUNA & KELOLA SISWA (users)
-- ============================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    nisn VARCHAR(10) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMPTZ,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'siswa' CHECK (role IN ('admin','siswa','osis','piket','guru_pembina')),
    class_or_division VARCHAR(50),
    avatar_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    remember_token VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_nisn ON users(nisn);

-- ============================================================
-- 2. TABEL KELOLA LOST & FOUND (items)
-- ============================================================
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(32) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('hilang','ditemukan')),
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('alat_tulis','elektronik','pakaian','berkas','lainnya')),
    location VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    description TEXT NOT NULL,
    photo_path VARCHAR(255),
    handover_point VARCHAR(50) CHECK (handover_point IN ('ruang_piket','ruang_bk','pos_satpam')),
    service_hours VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia','diklaim','selesai','arsip')),
    moderation_status VARCHAR(50) NOT NULL DEFAULT 'menunggu' CHECK (moderation_status IN ('menunggu','disetujui','ditolak')),
    reject_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_event_date ON items(event_date);

-- ============================================================
-- 3. TABEL VERIFIKASI KLAIM BARANG (claims)
-- ============================================================
CREATE TABLE claims (
    id BIGSERIAL PRIMARY KEY,
    claim_number VARCHAR(32) UNIQUE NOT NULL,
    item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claimant_name VARCHAR(150),
    proof_description TEXT NOT NULL,
    proof_photo_path VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu','terverifikasi','ditolak')),
    verified_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    verification_note TEXT,
    verified_at TIMESTAMPTZ,
    handover_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claims_status ON claims(status);

-- ============================================================
-- 4. TABEL KELOLA ASPIRASI & SUARA SISWA (aspirations)
-- ============================================================
CREATE TABLE aspirations (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(32) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('toilet','perpustakaan','lapangan','wifi','kantin','lainnya')),
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    photo_path VARCHAR(255),
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'menunggu_review' CHECK (status IN ('menunggu_review','diproses','ditindaklanjuti','ditolak')),
    due_date DATE NOT NULL,
    admin_reply TEXT,
    reject_reason VARCHAR(255),
    upvotes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_aspirations_category ON aspirations(category);
CREATE INDEX idx_aspirations_status ON aspirations(status);
CREATE INDEX idx_aspirations_is_emergency ON aspirations(is_emergency);

-- ============================================================
-- 5. TABEL DUKUNGAN / VOTE ASPIRASI (aspiration_votes)
-- ============================================================
CREATE TABLE aspiration_votes (
    id BIGSERIAL PRIMARY KEY,
    aspiration_id BIGINT NOT NULL REFERENCES aspirations(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (aspiration_id, user_id)
);

-- ============================================================
-- 6. TABEL KOMENTAR & BALASAN RESMI SEKOLAH (comments)
-- ============================================================
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    aspiration_id BIGINT NOT NULL REFERENCES aspirations(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_official_reply BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_aspiration ON comments(aspiration_id);

-- ============================================================
-- 7. TABEL KELOLA PANDUAN & FAQ (faqs)
-- ============================================================
CREATE TABLE faqs (
    id BIGSERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. TABEL LOG LINIMASA & RIWAYAT STATUS (status_logs)
-- ============================================================
CREATE TABLE status_logs (
    id BIGSERIAL PRIMARY KEY,
    trackable_type VARCHAR(255) NOT NULL,
    trackable_id BIGINT NOT NULL,
    actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_logs_trackable ON status_logs(trackable_type, trackable_id);

-- ============================================================
-- 9. TABEL LAPORAN KONTEN BERMASALAH (content_reports)
-- ============================================================
CREATE TABLE content_reports (
    id BIGSERIAL PRIMARY KEY,
    reportable_type VARCHAR(255) NOT NULL,
    reportable_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu','ditinjau','diabaikan')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. TABEL PEMBATASAN KIRIMAN HARIAN SISWA (daily_submissions)
-- ============================================================
CREATE TABLE daily_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_date DATE NOT NULL,
    count SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, submission_date)
);

-- ============================================================
-- 11. TABEL TOKEN AUTENTIKASI SANCTUM (personal_access_tokens)
-- ============================================================
CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_personal_access_tokens_tokenable ON personal_access_tokens(tokenable_type, tokenable_id);

-- ============================================================
-- 12. TABEL SESI AKTIF PENGGUNA (sessions)
-- ============================================================
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity);

-- ============================================================
-- 13. TABEL RESET KATA SANDI (password_reset_tokens)
-- ============================================================
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 14. TABEL METADATA MIGRASI LARAVEL (migrations)
-- ============================================================
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

-- ============================================================
-- SEED DATA AWAL (USER, BARANG, ASPIRASI, FAQ)
-- ============================================================

-- Data Users: Password Admin = admin123, Siswa = siswa123, OSIS = adminosis123, Piket = adminpiket123, Guru = adminguru123
INSERT INTO users (id, nisn, name, email, password, role, class_or_division, avatar_url, is_active, created_at, updated_at) VALUES
(1, NULL, 'Administrator POSIS', 'admin@smkn1ciomas.sch.id', '$2y$10$lfr8yuWpMTzmoBThym3P8OvXl/MN69f7Jz98pl5EGx.5xuOjfUKEC', 'admin', 'Pengelola Sistem Informasi SMKN 1 Ciomas', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminPOSIS', TRUE, NOW(), NOW()),
(2, '0067823910', 'Muhammad Rizky Pratama', 'siswa@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII Rekayasa Perangkat Lunak 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizky', TRUE, NOW(), NOW()),
(3, '0071293845', 'Siti Rahmawati', 'osis@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'osis', 'XI Desain Komunikasi Visual 2 (Ketua OSIS)', 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti', TRUE, NOW(), NOW()),
(4, NULL, 'Pak Suryono', 'piket@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'piket', 'Petugas Piket & Ketertiban', 'https://api.dicebear.com/7.x/bottts/svg?seed=Suryono', TRUE, NOW(), NOW()),
(5, NULL, 'Ahmad Fauzi, S.Pd.', 'guru@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'guru_pembina', 'Pembina Kesiswaan & OSIS', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fauzi', TRUE, NOW(), NOW()),
(6, '0078912345', 'Nabila Azzahra Putri', 'nabila@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X Desain Komunikasi Visual 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nabila', TRUE, NOW(), NOW()),
(7, '0081234567', 'Fajar Ramadhan Pratama', 'fajar@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI Teknik Komputer & Jaringan 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fajar', TRUE, NOW(), NOW()),
(8, '0070001001', 'Aditya Pratama Putra', 'siswa01@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Aditya+Pratama+Putra', TRUE, NOW(), NOW()),
(9, '0070001002', 'Aisyah Putri Maharani', 'siswa02@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Aisyah+Putri+Maharani', TRUE, NOW(), NOW()),
(10, '0070001003', 'Alif Bayu Nugroho', 'siswa03@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Alif+Bayu+Nugroho', TRUE, NOW(), NOW()),
(11, '0070001004', 'Amanda Dwi Lestari', 'siswa04@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Amanda+Dwi+Lestari', TRUE, NOW(), NOW()),
(12, '0070001005', 'Andhika Arya Prasetya', 'siswa05@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Andhika+Arya+Prasetya', TRUE, NOW(), NOW()),
(13, '0070001006', 'Anggita Sekar Wangi', 'siswa06@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Anggita+Sekar+Wangi', TRUE, NOW(), NOW()),
(14, '0070001007', 'Anisa Tri Wahyuni', 'siswa07@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Anisa+Tri+Wahyuni', TRUE, NOW(), NOW()),
(15, '0070001008', 'Ardiansyah Rahman', 'siswa08@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Ardiansyah+Rahman', TRUE, NOW(), NOW()),
(16, '0070001009', 'Aulia Rahmawati', 'siswa09@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Aulia+Rahmawati', TRUE, NOW(), NOW()),
(17, '0070001010', 'Bagas Satria Pratama', 'siswa10@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bagas+Satria+Pratama', TRUE, NOW(), NOW()),
(18, '0070001011', 'Bela Nur Safitri', 'siswa11@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bela+Nur+Safitri', TRUE, NOW(), NOW()),
(19, '0070001012', 'Bima Sakti Pangestu', 'siswa12@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bima+Sakti+Pangestu', TRUE, NOW(), NOW()),
(20, '0070001013', 'Cantika Indah Permata', 'siswa13@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Cantika+Indah+Permata', TRUE, NOW(), NOW()),
(21, '0070001014', 'Daffa Ihsan Firdaus', 'siswa14@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Daffa+Ihsan+Firdaus', TRUE, NOW(), NOW()),
(22, '0070001015', 'Danendra Arya Wibowo', 'siswa15@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Danendra+Arya+Wibowo', TRUE, NOW(), NOW()),
(23, '0070001016', 'Dea Ananda Kusuma', 'siswa16@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Dea+Ananda+Kusuma', TRUE, NOW(), NOW()),
(24, '0070001017', 'Dimas Fauzi Nugraha', 'siswa17@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Dimas+Fauzi+Nugraha', TRUE, NOW(), NOW()),
(25, '0070001018', 'Dina Kartika Sari', 'siswa18@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Dina+Kartika+Sari', TRUE, NOW(), NOW()),
(26, '0070001019', 'Eka Maulana Saputra', 'siswa19@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Eka+Maulana+Saputra', TRUE, NOW(), NOW()),
(27, '0070001020', 'Fahri Ramadhan', 'siswa20@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fahri+Ramadhan', TRUE, NOW(), NOW()),
(28, '0070001021', 'Farhan Maulana Hakim', 'siswa21@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Farhan+Maulana+Hakim', TRUE, NOW(), NOW()),
(29, '0070001022', 'Fauzan Fadlilah', 'siswa22@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fauzan+Fadlilah', TRUE, NOW(), NOW()),
(30, '0070001023', 'Fitri Handayani', 'siswa23@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fitri+Handayani', TRUE, NOW(), NOW()),
(31, '0070001024', 'Galang Raditya Putra', 'siswa24@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Galang+Raditya+Putra', TRUE, NOW(), NOW()),
(32, '0070001025', 'Gilang Ramadhan', 'siswa25@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI TKR 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Gilang+Ramadhan', TRUE, NOW(), NOW()),
(33, '0070001026', 'Hafizh Shidqi Robbani', 'siswa26@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Hafizh+Shidqi+Robbani', TRUE, NOW(), NOW()),
(34, '0070001027', 'Hanifah Nur Azizah', 'siswa27@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Hanifah+Nur+Azizah', TRUE, NOW(), NOW()),
(35, '0070001028', 'Ilham Wahyu Hidayat', 'siswa28@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Ilham+Wahyu+Hidayat', TRUE, NOW(), NOW()),
(36, '0070001029', 'Indah Permatasari', 'siswa29@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Indah+Permatasari', TRUE, NOW(), NOW()),
(37, '0070001030', 'Intan Nur Aini', 'siswa30@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Intan+Nur+Aini', TRUE, NOW(), NOW()),
(38, '0070001031', 'Irfan Maulana Yusuf', 'siswa31@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Irfan+Maulana+Yusuf', TRUE, NOW(), NOW()),
(39, '0070001032', 'Kevin Julio Pratama', 'siswa32@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Kevin+Julio+Pratama', TRUE, NOW(), NOW()),
(40, '0070001033', 'Laras Salsabila', 'siswa33@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Laras+Salsabila', TRUE, NOW(), NOW()),
(41, '0070001034', 'Mochamad Revaldi', 'siswa34@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Mochamad+Revaldi', TRUE, NOW(), NOW()),
(42, '0070001035', 'Muhammad Alief Zaki', 'siswa35@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Muhammad+Alief+Zaki', TRUE, NOW(), NOW()),
(43, '0070001036', 'Muhammad Farhan Syah', 'siswa36@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Muhammad+Farhan+Syah', TRUE, NOW(), NOW()),
(44, '0070001037', 'Muhammad Iqbal Tawakal', 'siswa37@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Muhammad+Iqbal+Tawakal', TRUE, NOW(), NOW()),
(45, '0070001038', 'Nabila Zahra Putri', 'siswa38@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nabila+Zahra+Putri', TRUE, NOW(), NOW()),
(46, '0070001039', 'Nadhif Arya Sena', 'siswa39@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadhif+Arya+Sena', TRUE, NOW(), NOW()),
(47, '0070001040', 'Nadya Putri Utami', 'siswa40@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadya+Putri+Utami', TRUE, NOW(), NOW()),
(48, '0070001041', 'Rafi Ahmad Fauzan', 'siswa41@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rafi+Ahmad+Fauzan', TRUE, NOW(), NOW()),
(49, '0070001042', 'Rangga Dwi Putra', 'siswa42@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'X TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rangga+Dwi+Putra', TRUE, NOW(), NOW()),
(50, '0070001043', 'Reza Aditya Maulana', 'siswa43@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Reza+Aditya+Maulana', TRUE, NOW(), NOW()),
(51, '0070001044', 'Rian Hidayatullah', 'siswa44@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rian+Hidayatullah', TRUE, NOW(), NOW()),
(52, '0070001045', 'Rizka Nur Azizah', 'siswa45@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XI TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizka+Nur+Azizah', TRUE, NOW(), NOW()),
(53, '0070001046', 'Salma Fauziyyah', 'siswa46@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Salma+Fauziyyah', TRUE, NOW(), NOW()),
(54, '0070001047', 'Sandi Kurniawan', 'siswa47@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Sandi+Kurniawan', TRUE, NOW(), NOW()),
(55, '0070001048', 'Syahrul Ramadhan', 'siswa48@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Syahrul+Ramadhan', TRUE, NOW(), NOW()),
(56, '0070001049', 'Taufik Hidayat', 'siswa49@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Taufik+Hidayat', TRUE, NOW(), NOW()),
(57, '0070001050', 'Zahra Aulia Rahmah', 'siswa50@smkn1ciomas.sch.id', '$2y$10$/tfhZmCbt.axE1Zg6DwrVuQSiPFgKEHMW.Jbd9ZQACAJaSUxV.h5i', 'siswa', 'XII DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Zahra+Aulia+Rahmah', TRUE, NOW(), NOW());

-- Data Items (Lost & Found)
INSERT INTO items (id, ticket_number, user_id, type, title, category, location, event_date, description, photo_path, handover_point, service_hours, status, moderation_status, reject_reason, created_at, updated_at) VALUES
(1, 'POSIS-LF-202610-001', 2, 'ditemukan', 'Kunci Motor Honda Beat Hitam dengan Gantungan Akrilik Ciomas', 'lainnya', 'Kantin Sehat Sekolah (Meja Pojok Kanan)', '2026-10-05', 'Ditemukan kunci kontak motor beserta remote alarm kecil dan gantungan kunci anime. Telah diserahkan ke ruang piket.', NULL, 'ruang_piket', 'Senin–Jumat 07:00 – 15:30 WIB', 'tersedia', 'disetujui', NULL, NOW(), NOW()),
(2, 'POSIS-LF-202610-002', 2, 'hilang', 'Kalkulator Ilmiah Casio fx-991EX ClassWiz', 'elektronik', 'Lab Komputer RPL 2 Lantai 2', '2026-10-06', 'Tertinggal saat praktikum pemrograman database jam ke 5-6. Di bagian belakang ada stiker logo SMKN 1 Ciomas.', NULL, NULL, NULL, 'tersedia', 'disetujui', NULL, NOW(), NOW()),
(3, 'POSIS-LF-202610-003', 3, 'ditemukan', 'Kartu Tanda Pelajar (KTP Pelajar) a.n Nabila Azzahra', 'berkas', 'Depan Ruang Perpustakaan', '2026-10-06', 'Ditemukan kartu pelajar kelas X Animasi 1 jatuh di koridor depan perpus. Dititipkan di loker ruang BK.', NULL, 'ruang_bk', 'Senin–Jumat 07:30 – 15:00 WIB', 'tersedia', 'disetujui', NULL, NOW(), NOW());

-- Data Aspirasi
INSERT INTO aspirations (id, ticket_number, user_id, is_anonymous, category, title, body, photo_path, is_emergency, status, due_date, admin_reply, reject_reason, upvotes_count, comments_count, created_at, updated_at) VALUES
(1, 'POSIS-ASP-202610-001', 2, FALSE, 'toilet', 'Kran Air dan Gayung di Toilet Siswa Gedung B Sering Mati dan Bocor', 'Mohon bantuan perbaikan instalasi pipa air di toilet pria gedung B lantai 1. Saat jam istirahat kedua air sering mati sehingga siswa kesulitan berwudhu dan buang air.', NULL, FALSE, 'diproses', '2026-10-16', NULL, NULL, 42, 5, NOW(), NOW()),
(2, 'POSIS-ASP-202610-002', 2, TRUE, 'wifi', 'Penambahan Bandwidth dan Access Point WiFi di Area Belajar Mandiri Perpustakaan', 'Koneksi WiFi SMKN1Ciomas-Edu di perpustakaan sering timeout saat 20+ siswa mengakses e-book dan modul pembelajaran digital secara bersamaan.', NULL, FALSE, 'ditindaklanjuti', '2026-10-09', NULL, NULL, 88, 12, NOW(), NOW()),
(3, 'POSIS-ASP-202610-003', 2, FALSE, 'lainnya', 'Perbaikan Lampu Koridor Gedung C Lantai 2', 'Lampu di lorong depan kelas XI TKJ padam sejak 3 hari yang lalu, mohon bantuan penggantian bohlam agar tidak gelap saat sore hari.', NULL, FALSE, 'menunggu_review', '2026-10-20', NULL, NULL, 1, 0, NOW(), NOW());

-- Data Votes
INSERT INTO aspiration_votes (id, aspiration_id, user_id, created_at, updated_at) VALUES
(1, 1, 2, NOW(), NOW()),
(2, 2, 2, NOW(), NOW()),
(3, 3, 2, NOW(), NOW());

-- Data FAQs
INSERT INTO faqs (id, question, answer, category, created_at, updated_at) VALUES
(1, 'Bagaimana jika saya menemukan barang di lingkungan sekolah?', 'Segera serahkan barang temuan ke Pos Petugas Piket atau Ruang Bimbingan Konseling (BK), lalu buat laporan pada menu Lost & Found agar pemilik dapat mengenali barangnya.', 'lost_found', NOW(), NOW()),
(2, 'Apakah aspirasi yang dikirim dengan mode Anonim tetap ditindaklanjuti?', 'Ya, seluruh aspirasi yang memenuhi tata tertib sekolah akan diverifikasi dan diproses oleh pihak kesiswaan tanpa membedakan status pengirim.', 'aspiration', NOW(), NOW()),
(3, 'Berapa batas waktu penanganan aspirasi (SLA) di SMKN 1 Ciomas?', 'Standar Layanan Aspirasi (SLA) resmi sekolah adalah 7 hari kerja sejak laporan diverifikasi oleh pengurus OSIS atau guru pembina.', 'general', NOW(), NOW());

-- Data Status Logs
INSERT INTO status_logs (id, trackable_type, trackable_id, actor_id, old_status, new_status, note, created_at, updated_at) VALUES
(1, 'App\Models\Aspiration', 3, 2, NULL, 'dikirim', 'Aspirasi masuk ke sistem POSIS SMKN 1 Ciomas.', NOW(), NOW());

-- Data Daily Submissions
INSERT INTO daily_submissions (id, user_id, submission_date, count, created_at, updated_at) VALUES
(1, 2, CURRENT_DATE, 1, NOW(), NOW());

-- Data Migrations (Agar php artisan migrate mendeteksi semua tabel sudah siap)
INSERT INTO migrations (id, migration, batch) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '2026_10_06_000001_create_items_table', 1),
(3, '2026_10_06_000002_create_claims_table', 1),
(4, '2026_10_06_000003_create_aspirations_table', 1),
(5, '2026_10_06_000004_create_aspiration_votes_table', 1),
(6, '2026_10_06_000005_create_comments_table', 1),
(7, '2026_10_06_000006_create_status_logs_table', 1),
(8, '2026_10_06_000007_create_content_reports_table', 1),
(9, '2026_10_06_000008_create_daily_submissions_table', 1),
(10, '2026_10_07_103737_create_personal_access_tokens_table', 1),
(11, '2026_10_07_200000_create_faqs_table', 1);

-- Sinkronisasi Serial Sequence PostgreSQL (Supabase) agar Auto-Increment Berjalan Normal
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM items));
SELECT setval('claims_id_seq', (SELECT COALESCE(MAX(id), 1) FROM claims));
SELECT setval('aspirations_id_seq', (SELECT COALESCE(MAX(id), 1) FROM aspirations));
SELECT setval('aspiration_votes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM aspiration_votes));
SELECT setval('comments_id_seq', (SELECT COALESCE(MAX(id), 1) FROM comments));
SELECT setval('faqs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM faqs));
SELECT setval('status_logs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM status_logs));
SELECT setval('daily_submissions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM daily_submissions));
SELECT setval('personal_access_tokens_id_seq', (SELECT COALESCE(MAX(id), 1) FROM personal_access_tokens));
SELECT setval('migrations_id_seq', (SELECT COALESCE(MAX(id), 1) FROM migrations));

