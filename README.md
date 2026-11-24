# POSIS — Pusat Olah Suara & Informasi Siswa
### Portal Resmi SMK Negeri 1 Ciomas

Aplikasi Lost & Found (Barang Hilang / Ditemukan) dan Kotak Saran / Aspirasi Siswa berbasis Web Modern (React + Node.js Express + Supabase PostgreSQL).

---

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, React Router v7, Lucide Icons
- **Backend:** Node.js, Express.js (Vercel Serverless Function)
- **Database:** Supabase PostgreSQL (57 Akun Siswa & Guru terintegrasi)
- **Hosting:** Vercel (Frontend & Serverless Backend dalam 1 Proyek)

---

## 🔑 Environment Variables untuk Vercel:

Tambahkan 2 variabel ini di **Project Settings -> Environment Variables** di Vercel:

| Key | Value |
| :--- | :--- |
| `SUPABASE_URL` | `https://xfredskwnysatcxzzufx.supabase.co` |
| `SUPABASE_KEY` | *(Gunakan sb_secret_... Supabase Anda)* |

---

## 👥 Akun yang Siap Digunakan (57 Siswa Terdaftar):

- **Administrator:** `admin@smkn1ciomas.sch.id` | Kata Sandi: `admin123`
- **Siswa Uji Coba 1:** `siswa@smkn1ciomas.sch.id` (atau NISN: `0067823910`) | Kata Sandi: `siswa123`
- **Pengurus OSIS:** `osis@smkn1ciomas.sch.id` (atau NISN: `0071293845`) | Kata Sandi: `adminosis123` / `siswa123`
- **Petugas Piket:** `piket@smkn1ciomas.sch.id` | Kata Sandi: `adminpiket123` / `siswa123`
- **Guru Pembina:** `guru@smkn1ciomas.sch.id` | Kata Sandi: `adminguru123` / `siswa123`
- **Seluruh 50+ Siswa Lainnya:** Bisa login langsung menggunakan **NISN** atau **Email Siswa** (misal: `siswa01@smkn1ciomas.sch.id`, `0070001001`) dengan kata sandi: `siswa123`.

---

## 🛠️ Jalankan Secara Lokal (Development)

1. **Install Dependensi:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Jalankan Aplikasi:**
   - Terminal 1 (Backend API):
     ```bash
     npm start
     ```
   - Terminal 2 (Frontend React):
     ```bash
     cd frontend
     npm run dev
     ```
