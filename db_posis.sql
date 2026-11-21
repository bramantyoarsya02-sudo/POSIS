-- ============================================================
-- DATABASE RESMI: db_posis (POSIS SMKN 1 CIOMAS)
-- Disesuaikan dengan menu Admin: Kelola Siswa, Lost & Found,
-- Aspirasi, serta Panduan & FAQ.
-- Kompatibel: MySQL 5.7+ / 8.0+ / MariaDB (Laragon phpMyAdmin)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
START TRANSACTION;
SET time_zone = '+07:00';

CREATE DATABASE IF NOT EXISTS `db_posis` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_posis`;

-- ------------------------------------------------------------
-- Bersihkan tabel lama jika sudah ada (Aman Foreign Key)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `migrations`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `daily_submissions`;
DROP TABLE IF EXISTS `content_reports`;
DROP TABLE IF EXISTS `status_logs`;
DROP TABLE IF EXISTS `faqs`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `aspiration_votes`;
DROP TABLE IF EXISTS `aspirations`;
DROP TABLE IF EXISTS `claims`;
DROP TABLE IF EXISTS `items`;
DROP TABLE IF EXISTS `users`;

-- ============================================================
-- 1. TABEL PENGGUNA & KELOLA SISWA (users)
-- ============================================================
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nisn` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nomor Induk Siswa Nasional',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','siswa','osis','piket','guru_pembina') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'siswa',
  `class_or_division` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kelas Siswa / Bidang Tugas Guru',
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_nisn_unique` (`nisn`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `users`
INSERT INTO `users` (`id`, `nisn`, `name`, `email`, `email_verified_at`, `password`, `role`, `class_or_division`, `avatar_url`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
('1', NULL, 'Administrator POSIS', 'admin@smkn1ciomas.sch.id', NULL, 'y$VyR5Q378mBn3fIAYU/8nfu9PTwebYceqshL6wu03PvRlrbzS3aDiu', 'admin', 'Pengelola Sistem Informasi SMKN 1 Ciomas', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminPOSIS', '1', NULL, NOW(), NOW()),
('2', '0067823910', 'Muhammad Rizky Pratama', 'siswa@smkn1ciomas.sch.id', NULL, 'y$O11zRiqcBRjIpU8g3NKrT.2C53kdjlRO.oen1NqiEIfw6QdOGL.4u', 'siswa', 'XII Rekayasa Perangkat Lunak 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizky', '1', NULL, NOW(), NOW()),
('3', '0071293845', 'Siti Rahmawati', 'osis@smkn1ciomas.sch.id', NULL, 'y$s295468OpHoKb0Kt4svlHOQrTT40ZmtQWx5pOUpTu7ALrvbE7OFoi', 'osis', 'XI Desain Komunikasi Visual 2 (Ketua OSIS)', 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti', '1', NULL, NOW(), NOW()),
('4', NULL, 'Pak Suryono', 'piket@smkn1ciomas.sch.id', NULL, 'y$DqaqaHiFCBYVYkzVeFhCzurdfXrc1EQU3boTm6Bj7373uS/wDHAhm', 'piket', 'Petugas Piket & Ketertiban', 'https://api.dicebear.com/7.x/bottts/svg?seed=Suryono', '1', NULL, NOW(), NOW()),
('5', NULL, 'Ahmad Fauzi, S.Pd.', 'guru@smkn1ciomas.sch.id', NULL, 'y$B6H7.qd2A1UtQg6Fjyls8.If9FX5GOEz1FRcM51RiSib9zK.qlyFO', 'guru_pembina', 'Pembina Kesiswaan & OSIS', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fauzi', '1', NULL, NOW(), NOW()),
('6', '0078912345', 'Nabila Azzahra Putri', 'nabila@smkn1ciomas.sch.id', NULL, 'y$O11zRiqcBRjIpU8g3NKrT.2C53kdjlRO.oen1NqiEIfw6QdOGL.4u', 'siswa', 'X Desain Komunikasi Visual 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nabila', '1', NULL, NOW(), NOW()),
('7', '0081234567', 'Fajar Ramadhan Pratama', 'fajar@smkn1ciomas.sch.id', NULL, 'y$O11zRiqcBRjIpU8g3NKrT.2C53kdjlRO.oen1NqiEIfw6QdOGL.4u', 'siswa', 'XI Teknik Komputer & Jaringan 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fajar', '1', NULL, NOW(), NOW()),
('8', '0070001001', 'Aditya Pratama Putra', 'siswa01@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Aditya+Pratama+Putra', '1', NULL, NOW(), NOW()),
('9', '0070001002', 'Aisyah Putri Maharani', 'siswa02@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Aisyah+Putri+Maharani', '1', NULL, NOW(), NOW()),
('10', '0070001003', 'Alif Bayu Nugroho', 'siswa03@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Alif+Bayu+Nugroho', '1', NULL, NOW(), NOW()),
('11', '0070001004', 'Amanda Dwi Lestari', 'siswa04@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Amanda+Dwi+Lestari', '1', NULL, NOW(), NOW()),
('12', '0070001005', 'Andhika Arya Prasetya', 'siswa05@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Andhika+Arya+Prasetya', '1', NULL, NOW(), NOW()),
('13', '0070001006', 'Anggita Sekar Wangi', 'siswa06@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Anggita+Sekar+Wangi', '1', NULL, NOW(), NOW()),
('14', '0070001007', 'Anisa Tri Wahyuni', 'siswa07@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Anisa+Tri+Wahyuni', '1', NULL, NOW(), NOW()),
('15', '0070001008', 'Ardiansyah Rahman', 'siswa08@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Ardiansyah+Rahman', '1', NULL, NOW(), NOW()),
('16', '0070001009', 'Aulia Rahmawati', 'siswa09@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Aulia+Rahmawati', '1', NULL, NOW(), NOW()),
('17', '0070001010', 'Bagas Satria Pratama', 'siswa10@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bagas+Satria+Pratama', '1', NULL, NOW(), NOW()),
('18', '0070001011', 'Bela Nur Safitri', 'siswa11@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bela+Nur+Safitri', '1', NULL, NOW(), NOW()),
('19', '0070001012', 'Bima Sakti Pangestu', 'siswa12@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bima+Sakti+Pangestu', '1', NULL, NOW(), NOW()),
('20', '0070001013', 'Cantika Indah Permata', 'siswa13@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Cantika+Indah+Permata', '1', NULL, NOW(), NOW()),
('21', '0070001014', 'Daffa Ihsan Firdaus', 'siswa14@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Daffa+Ihsan+Firdaus', '1', NULL, NOW(), NOW()),
('22', '0070001015', 'Danendra Arya Wibowo', 'siswa15@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Danendra+Arya+Wibowo', '1', NULL, NOW(), NOW()),
('23', '0070001016', 'Dea Ananda Kusuma', 'siswa16@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Dea+Ananda+Kusuma', '1', NULL, NOW(), NOW()),
('24', '0070001017', 'Dimas Fauzi Nugraha', 'siswa17@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Dimas+Fauzi+Nugraha', '1', NULL, NOW(), NOW()),
('25', '0070001018', 'Dina Kartika Sari', 'siswa18@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Dina+Kartika+Sari', '1', NULL, NOW(), NOW()),
('26', '0070001019', 'Eka Maulana Saputra', 'siswa19@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Eka+Maulana+Saputra', '1', NULL, NOW(), NOW()),
('27', '0070001020', 'Fahri Ramadhan', 'siswa20@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fahri+Ramadhan', '1', NULL, NOW(), NOW()),
('28', '0070001021', 'Farhan Maulana Hakim', 'siswa21@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Farhan+Maulana+Hakim', '1', NULL, NOW(), NOW()),
('29', '0070001022', 'Fauzan Fadlilah', 'siswa22@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fauzan+Fadlilah', '1', NULL, NOW(), NOW()),
('30', '0070001023', 'Fitri Handayani', 'siswa23@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fitri+Handayani', '1', NULL, NOW(), NOW()),
('31', '0070001024', 'Galang Raditya Putra', 'siswa24@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Galang+Raditya+Putra', '1', NULL, NOW(), NOW()),
('32', '0070001025', 'Gilang Ramadhan', 'siswa25@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI TKR 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Gilang+Ramadhan', '1', NULL, NOW(), NOW()),
('33', '0070001026', 'Hafizh Shidqi Robbani', 'siswa26@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Hafizh+Shidqi+Robbani', '1', NULL, NOW(), NOW()),
('34', '0070001027', 'Hanifah Nur Azizah', 'siswa27@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Hanifah+Nur+Azizah', '1', NULL, NOW(), NOW()),
('35', '0070001028', 'Ilham Wahyu Hidayat', 'siswa28@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Ilham+Wahyu+Hidayat', '1', NULL, NOW(), NOW()),
('36', '0070001029', 'Indah Permatasari', 'siswa29@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Indah+Permatasari', '1', NULL, NOW(), NOW()),
('37', '0070001030', 'Intan Nur Aini', 'siswa30@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Intan+Nur+Aini', '1', NULL, NOW(), NOW()),
('38', '0070001031', 'Irfan Maulana Yusuf', 'siswa31@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Irfan+Maulana+Yusuf', '1', NULL, NOW(), NOW()),
('39', '0070001032', 'Kevin Julio Pratama', 'siswa32@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Kevin+Julio+Pratama', '1', NULL, NOW(), NOW()),
('40', '0070001033', 'Laras Salsabila', 'siswa33@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Laras+Salsabila', '1', NULL, NOW(), NOW()),
('41', '0070001034', 'Mochamad Revaldi', 'siswa34@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Mochamad+Revaldi', '1', NULL, NOW(), NOW()),
('42', '0070001035', 'Muhammad Alief Zaki', 'siswa35@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Muhammad+Alief+Zaki', '1', NULL, NOW(), NOW()),
('43', '0070001036', 'Muhammad Farhan Syah', 'siswa36@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Muhammad+Farhan+Syah', '1', NULL, NOW(), NOW()),
('44', '0070001037', 'Muhammad Iqbal Tawakal', 'siswa37@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Muhammad+Iqbal+Tawakal', '1', NULL, NOW(), NOW()),
('45', '0070001038', 'Nabila Zahra Putri', 'siswa38@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nabila+Zahra+Putri', '1', NULL, NOW(), NOW()),
('46', '0070001039', 'Nadhif Arya Sena', 'siswa39@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadhif+Arya+Sena', '1', NULL, NOW(), NOW()),
('47', '0070001040', 'Nadya Putri Utami', 'siswa40@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X RPL 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadya+Putri+Utami', '1', NULL, NOW(), NOW()),
('48', '0070001041', 'Rafi Ahmad Fauzan', 'siswa41@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X Animasi 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rafi+Ahmad+Fauzan', '1', NULL, NOW(), NOW()),
('49', '0070001042', 'Rangga Dwi Putra', 'siswa42@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'X TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rangga+Dwi+Putra', '1', NULL, NOW(), NOW()),
('50', '0070001043', 'Reza Aditya Maulana', 'siswa43@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Reza+Aditya+Maulana', '1', NULL, NOW(), NOW()),
('51', '0070001044', 'Rian Hidayatullah', 'siswa44@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rian+Hidayatullah', '1', NULL, NOW(), NOW()),
('52', '0070001045', 'Rizka Nur Azizah', 'siswa45@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XI TKJ 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizka+Nur+Azizah', '1', NULL, NOW(), NOW()),
('53', '0070001046', 'Salma Fauziyyah', 'siswa46@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII RPL 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Salma+Fauziyyah', '1', NULL, NOW(), NOW()),
('54', '0070001047', 'Sandi Kurniawan', 'siswa47@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII Animasi 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=Sandi+Kurniawan', '1', NULL, NOW(), NOW()),
('55', '0070001048', 'Syahrul Ramadhan', 'siswa48@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII TKJ 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Syahrul+Ramadhan', '1', NULL, NOW(), NOW()),
('56', '0070001049', 'Taufik Hidayat', 'siswa49@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII BCF 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Taufik+Hidayat', '1', NULL, NOW(), NOW()),
('57', '0070001050', 'Zahra Aulia Rahmah', 'siswa50@smkn1ciomas.sch.id', NULL, 'y$exM876BIk/uNw7VHcglaMuQ7.XKwYyal4owy9L9z21XrV.hQ/gS3u', 'siswa', 'XII DKV 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=Zahra+Aulia+Rahmah', '1', NULL, NOW(), NOW());

-- ============================================================
-- 2. TABEL KELOLA LOST & FOUND (items)
-- ============================================================
CREATE TABLE `items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nomor tiket resmi misal POSIS-LF-202610-001',
  `user_id` bigint unsigned NOT NULL,
  `type` enum('hilang','ditemukan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('alat_tulis','elektronik','pakaian','berkas','lainnya') COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` date NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handover_point` enum('ruang_piket','ruang_bk','pos_satpam') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_hours` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('tersedia','diklaim','selesai','arsip') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tersedia',
  `moderation_status` enum('menunggu','disetujui','ditolak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `reject_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `items_ticket_number_unique` (`ticket_number`),
  KEY `items_user_id_foreign` (`user_id`),
  KEY `items_type_index` (`type`),
  KEY `items_category_index` (`category`),
  KEY `items_event_date_index` (`event_date`),
  KEY `items_status_index` (`status`),
  KEY `items_moderation_status_index` (`moderation_status`),
  CONSTRAINT `items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `items`
INSERT INTO `items` (`id`, `ticket_number`, `user_id`, `type`, `title`, `category`, `location`, `event_date`, `description`, `photo_path`, `handover_point`, `service_hours`, `status`, `moderation_status`, `reject_reason`, `created_at`, `updated_at`, `deleted_at`) VALUES
('1', 'POSIS-LF-202610-001', '2', 'ditemukan', 'Kunci Motor Honda Beat Hitam dengan Gantungan Akrilik Ciomas', 'lainnya', 'Kantin Sehat Sekolah (Meja Pojok Kanan)', '2026-10-05', 'Ditemukan kunci kontak motor beserta remote alarm kecil dan gantungan kunci anime. Telah diserahkan ke ruang piket.', NULL, 'ruang_piket', 'Senin–Jumat 07:00 – 15:30 WIB', 'tersedia', 'disetujui', NULL, '2026-10-11 18:05:55', '2026-10-11 18:05:55', NULL),
('2', 'POSIS-LF-202610-002', '2', 'hilang', 'Kalkulator Ilmiah Casio fx-991EX ClassWiz', 'elektronik', 'Lab Komputer RPL 2 Lantai 2', '2026-10-06', 'Tertinggal saat praktikum pemrograman database jam ke 5-6. Di bagian belakang ada stiker logo SMKN 1 Ciomas.', NULL, NULL, NULL, 'tersedia', 'disetujui', NULL, '2026-10-11 18:05:55', '2026-10-11 18:05:55', NULL),
('3', 'POSIS-LF-202610-003', '3', 'ditemukan', 'Kartu Tanda Pelajar (KTP Pelajar) a.n Nabila Azzahra', 'berkas', 'Depan Ruang Perpustakaan', '2026-10-06', 'Ditemukan kartu pelajar kelas X Animasi 1 jatuh di koridor depan perpus. Dititipkan di loker ruang BK.', NULL, 'ruang_bk', 'Senin–Jumat 07:30 – 15:00 WIB', 'tersedia', 'disetujui', NULL, '2026-10-11 18:05:55', '2026-10-11 18:05:55', NULL);

-- ============================================================
-- 3. TABEL VERIFIKASI KLAIM BARANG (claims)
-- ============================================================
CREATE TABLE `claims` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `claim_number` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nomor klaim resmi misal POSIS-CLM-202610-001',
  `item_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `claimant_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nama lengkap siswa/pengklaim',
  `proof_description` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ciri-ciri khusus rahasia',
  `proof_photo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('menunggu','terverifikasi','ditolak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `verified_by` bigint unsigned DEFAULT NULL,
  `verification_note` text COLLATE utf8mb4_unicode_ci,
  `verified_at` timestamp NULL DEFAULT NULL,
  `handover_at` timestamp NULL DEFAULT NULL COMMENT 'Waktu serah-terima fisik dilakukan',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `claims_claim_number_unique` (`claim_number`),
  KEY `claims_item_id_foreign` (`item_id`),
  KEY `claims_user_id_foreign` (`user_id`),
  KEY `claims_verified_by_foreign` (`verified_by`),
  KEY `claims_status_index` (`status`),
  CONSTRAINT `claims_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `claims_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `claims_verified_by_foreign` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. TABEL KELOLA ASPIRASI & SUARA SISWA (aspirations)
-- ============================================================
CREATE TABLE `aspirations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nomor tiket resmi misal POSIS-ASP-202610-001',
  `user_id` bigint unsigned NOT NULL,
  `is_anonymous` tinyint(1) NOT NULL DEFAULT '0',
  `category` enum('toilet','perpustakaan','lapangan','wifi','kantin','lainnya') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_emergency` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Jalur fasilitas darurat / berbahaya',
  `status` enum('menunggu_review','diproses','ditindaklanjuti','ditolak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu_review',
  `due_date` date NOT NULL COMMENT 'Target penyelesaian SLA 7 hari kerja',
  `admin_reply` text COLLATE utf8mb4_unicode_ci COMMENT 'Jawaban dan tindakan resmi sekolah',
  `reject_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upvotes_count` int unsigned NOT NULL DEFAULT '0',
  `comments_count` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aspirations_ticket_number_unique` (`ticket_number`),
  KEY `aspirations_user_id_foreign` (`user_id`),
  KEY `aspirations_is_anonymous_index` (`is_anonymous`),
  KEY `aspirations_category_index` (`category`),
  KEY `aspirations_is_emergency_index` (`is_emergency`),
  KEY `aspirations_status_index` (`status`),
  KEY `aspirations_upvotes_count_index` (`upvotes_count`),
  CONSTRAINT `aspirations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `aspirations`
INSERT INTO `aspirations` (`id`, `ticket_number`, `user_id`, `is_anonymous`, `category`, `title`, `body`, `photo_path`, `is_emergency`, `status`, `due_date`, `admin_reply`, `reject_reason`, `upvotes_count`, `comments_count`, `created_at`, `updated_at`, `deleted_at`) VALUES
('1', 'POSIS-ASP-202610-001', '2', '0', 'toilet', 'Kran Air dan Gayung di Toilet Siswa Gedung B Sering Mati dan Bocor', 'Mohon bantuan perbaikan instalasi pipa air di toilet pria gedung B lantai 1. Saat jam istirahat kedua air sering mati sehingga siswa kesulitan berwudhu dan buang air.', NULL, '0', 'diproses', '2026-10-16', NULL, NULL, '42', '5', '2026-10-11 18:05:55', '2026-10-11 18:05:55', NULL),
('2', 'POSIS-ASP-202610-002', '2', '1', 'wifi', 'Penambahan Bandwidth dan Access Point WiFi di Area Belajar Mandiri Perpustakaan', 'Koneksi WiFi SMKN1Ciomas-Edu di perpustakaan sering timeout saat 20+ siswa mengakses e-book dan modul pembelajaran digital secara bersamaan.', NULL, '0', 'ditindaklanjuti', '2026-10-09', NULL, NULL, '88', '12', '2026-10-11 18:05:55', '2026-10-11 18:05:55', NULL),
('3', 'POSIS-ASP-202610-003', '2', '0', 'lainnya', 'Perbaikan Lampu Koridor Gedung C Lantai 2', 'Lampu di lorong depan kelas XI TKJ padam sejak 3 hari yang lalu, mohon bantuan penggantian bohlam agar tidak gelap saat sore hari.', NULL, '0', 'menunggu_review', '2026-10-20', NULL, NULL, '1', '0', '2026-10-11 18:08:22', '2026-10-11 18:08:22', NULL);

-- ============================================================
-- 5. TABEL DUKUNGAN / VOTE ASPIRASI (aspiration_votes)
-- ============================================================
CREATE TABLE `aspiration_votes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `aspiration_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_aspiration_vote` (`aspiration_id`,`user_id`),
  KEY `aspiration_votes_user_id_foreign` (`user_id`),
  CONSTRAINT `aspiration_votes_aspiration_id_foreign` FOREIGN KEY (`aspiration_id`) REFERENCES `aspirations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `aspiration_votes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `aspiration_votes`
INSERT INTO `aspiration_votes` (`id`, `aspiration_id`, `user_id`, `created_at`, `updated_at`) VALUES
('1', '1', '2', '2026-10-11 18:05:55', '2026-10-11 18:05:55'),
('2', '2', '2', '2026-10-11 18:05:56', '2026-10-11 18:05:56'),
('3', '3', '2', '2026-10-11 18:08:22', '2026-10-11 18:08:22');

-- ============================================================
-- 6. TABEL KOMENTAR & BALASAN RESMI SEKOLAH (comments)
-- ============================================================
CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `aspiration_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_official_reply` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Apakah ditulis pengurus OSIS / Guru',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_aspiration_id_foreign` (`aspiration_id`),
  KEY `comments_user_id_foreign` (`user_id`),
  CONSTRAINT `comments_aspiration_id_foreign` FOREIGN KEY (`aspiration_id`) REFERENCES `aspirations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. TABEL KELOLA PANDUAN & FAQ (faqs)
-- ============================================================
CREATE TABLE `faqs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `faqs`
INSERT INTO `faqs` (`id`, `question`, `answer`, `category`, `created_at`, `updated_at`) VALUES
('1', 'Bagaimana jika saya menemukan barang di lingkungan sekolah?', 'Segera serahkan barang temuan ke Pos Petugas Piket atau Ruang Bimbingan Konseling (BK), lalu buat laporan pada menu Lost & Found agar pemilik dapat mengenali barangnya.', 'lost_found', '2026-10-11 18:05:56', '2026-10-11 18:05:56'),
('2', 'Apakah aspirasi yang dikirim dengan mode Anonim tetap ditindaklanjuti?', 'Ya, seluruh aspirasi yang memenuhi tata tertib sekolah akan diverifikasi dan diproses oleh pihak kesiswaan tanpa membedakan status pengirim.', 'aspiration', '2026-10-11 18:05:56', '2026-10-11 18:05:56'),
('3', 'Berapa batas waktu penanganan aspirasi (SLA) di SMKN 1 Ciomas?', 'Standar Layanan Aspirasi (SLA) resmi sekolah adalah 7 hari kerja sejak laporan diverifikasi oleh pengurus OSIS atau guru pembina.', 'general', '2026-10-11 18:05:56', '2026-10-11 18:05:56');

-- ============================================================
-- 8. TABEL LOG LINIMASA & RIWAYAT STATUS (status_logs)
-- ============================================================
CREATE TABLE `status_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `trackable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trackable_id` bigint unsigned NOT NULL,
  `actor_id` bigint unsigned DEFAULT NULL,
  `old_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status_logs_trackable_type_trackable_id_index` (`trackable_type`,`trackable_id`),
  KEY `status_logs_actor_id_foreign` (`actor_id`),
  CONSTRAINT `status_logs_actor_id_foreign` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `status_logs`
INSERT INTO `status_logs` (`id`, `trackable_type`, `trackable_id`, `actor_id`, `old_status`, `new_status`, `note`, `created_at`, `updated_at`) VALUES
('1', 'App\\Models\\Aspiration', '3', '2', NULL, 'dikirim', 'Aspirasi masuk ke sistem POSIS SMKN 1 Ciomas.', '2026-10-11 18:08:22', '2026-10-11 18:08:22');

-- ============================================================
-- 9. TABEL LAPORAN KONTEN BERMASALAH (content_reports)
-- ============================================================
CREATE TABLE `content_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reportable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reportable_id` bigint unsigned NOT NULL,
  `reporter_id` bigint unsigned NOT NULL,
  `reason` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `status` enum('menunggu','ditinjau','diabaikan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `content_reports_reportable_type_reportable_id_index` (`reportable_type`,`reportable_id`),
  KEY `content_reports_reporter_id_foreign` (`reporter_id`),
  CONSTRAINT `content_reports_reporter_id_foreign` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. TABEL PEMBATASAN KIRIMAN HARIAN SISWA (daily_submissions)
-- ============================================================
CREATE TABLE `daily_submissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `submission_date` date NOT NULL,
  `count` tinyint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_daily_submission` (`user_id`,`submission_date`),
  CONSTRAINT `daily_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `daily_submissions`
INSERT INTO `daily_submissions` (`id`, `user_id`, `submission_date`, `count`, `created_at`, `updated_at`) VALUES
('1', '2', '2026-10-11', '1', '2026-10-11 18:07:07', '2026-10-11 18:08:22');

-- ============================================================
-- 11. TABEL TOKEN AUTENTIKASI SANCTUM (personal_access_tokens)
-- ============================================================
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `personal_access_tokens`
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
('1', 'App\\Models\\User', '1', 'posis-token', '091dafe53386e3a663770080f6991247ee785babdcefbdcd1ad13a1d75db77ce', '[\"*\"]', '2026-10-11 18:06:26', NULL, '2026-10-11 18:06:25', '2026-10-11 18:06:26'),
('2', 'App\\Models\\User', '1', 'posis-token', 'b23a9ccdac074d39529d83b9ee1925cc60d04c1bcd52f6603000a00f7bb513b7', '[\"*\"]', '2026-10-11 18:08:32', NULL, '2026-10-11 18:08:30', '2026-10-11 18:08:32');

-- ============================================================
-- 12. TABEL SESI AKTIF PENGGUNA (sessions)
-- ============================================================
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. TABEL RESET KATA SANDI (password_reset_tokens)
-- ============================================================
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. TABEL METADATA MIGRASI LARAVEL (migrations)
-- ============================================================
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data awal untuk tabel `migrations`
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
('1', '0001_01_01_000000_create_users_table', '1'),
('2', '2026_10_06_000001_create_items_table', '1'),
('3', '2026_10_06_000002_create_claims_table', '1'),
('4', '2026_10_06_000003_create_aspirations_table', '1'),
('5', '2026_10_06_000004_create_aspiration_votes_table', '1'),
('6', '2026_10_06_000005_create_comments_table', '1'),
('7', '2026_10_06_000006_create_status_logs_table', '1'),
('8', '2026_10_06_000007_create_content_reports_table', '1'),
('9', '2026_10_06_000008_create_daily_submissions_table', '1'),
('10', '2026_10_07_103737_create_personal_access_tokens_table', '1'),
('11', '2026_10_07_200000_create_faqs_table', '1');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
