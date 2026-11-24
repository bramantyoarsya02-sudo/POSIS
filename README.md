# POSIS — Pusat Olah Suara & Informasi Siswa
### Portal Resmi SMK Negeri 1 Ciomas

Aplikasi Lost & Found (Barang Hilang / Ditemukan) dan Kotak Saran / Aspirasi Siswa berbasis Web Modern.

---

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, React Router v7, Lucide Icons
- **Backend:** Node.js, Express.js (Serverless API ready for Vercel)
- **Database:** Supabase PostgreSQL
- **Hosting:** Vercel (Frontend SPA + Serverless Backend API dalam satu proyek)

---

## 🛠️ Panduan Menjalankan Secara Lokal (Development)

1. **Clone Repository:**
   ```bash
   git clone https://github.com/bramantyoarsya02-sudo/POSIS.git
   cd POSIS
   ```

2. **Install Dependensi:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Jalankan Backend & Frontend:**
   - Terminal 1 (Backend API Port 8000):
     ```bash
     node api/index.js
     ```
   - Terminal 2 (Frontend React):
     ```bash
     cd frontend
     npm run dev
     ```

---

## ☁️ Panduan Deploy ke Vercel (100% Gratis & Otomatis)

1. Buka dashboard [Vercel](https://vercel.com/) dan klik **Add New...** -> **Project**.
2. Pilih repository: `bramantyoarsya02-sudo/POSIS`.
3. Biarkan **Root Directory** tetap `./`.
4. (Opsional) Tambahkan Environment Variable di Vercel jika ingin menghubungkan ke Supabase:
   - `DATABASE_URL`: `postgresql://postgres:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`
   *(Jika tidak diisi, backend otomatis menggunakan in-memory seed data sehingga aplikasi tetap berjalan 100% lancar).*
5. Klik **Deploy**!
6. Selesai! Web Anda langsung aktif dan dapat diakses publik.

---

## 👤 Akun Uji Coba Default:
- **Admin:** `admin@smkn1ciomas.sch.id` / `admin123`
- **Siswa:** `siswa@smkn1ciomas.sch.id` / `siswa123` (NISN: `0067823910`)
- **OSIS:** `osis@smkn1ciomas.sch.id` / `adminosis123`
- **Piket:** `piket@smkn1ciomas.sch.id` / `adminpiket123`
