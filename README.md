# POSIS — Pusat Olah Suara & Informasi Siswa
**SMK Negeri 1 Ciomas, Kabupaten Bogor**

Aplikasi web full-stack berbasis **Next.js (App Router)** dan **Supabase PostgreSQL** untuk layanan **Lost & Found Sekolah** dan **Kotak Saran / Aspirasi Siswa**.

## Struktur Utama
- `src/app/` — Halaman Next.js App Router (`/`, `/beranda`, `/lost-found`, `/aspirasi`, `/panduan-faq`, `/admin/dashboard`)
- `src/app/api/` — Next.js API Route Handlers (`/api/auth/*`, `/api/items/*`, `/api/aspirations/*`, `/api/admin/*`, `/api/stats`, `/api/faqs`)
- `src/lib/supabase/` — Klien Supabase (`client.js` & `server.js`)
- `src/components/`, `src/views/`, `src/services/`, `src/contexts/` — Komponen UI & integrasi API

## Menjalankan Secara Lokal
```bash
npm install
npm run dev
```

## Konfigurasi Environment Variable (`.env.local` / Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xfredskwnysatcxzzufx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_eyuWXvBfjG7j2CzOcYPhWQ_I8jM2bBJ
```
*(Opsional untuk server)* `SUPABASE_SERVICE_ROLE_KEY` dapat ditambahkan di Environment Variables Vercel.
