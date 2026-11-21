# POSIS — Pusat Olah Suara & Informasi Siswa
### Portal Resmi SMK Negeri 1 Ciomas · Kabupaten Bogor

Aplikasi web terpadu untuk tata kelola kesiswaan, aspirasi fasilitas sekolah, dan pengelolaan barang hilang & temuan (*Lost & Found*) resmi SMK Negeri 1 Ciomas.

---

## 🔐 Kredensial Akun (Login Credentials)

Semua pengguna wajib login terlebih dahulu di portal utama (`/`). 
Sistem menerapkan **keamanan tertutup khusus warga sekolah**: pendaftaran akun publik mandiri telah ditiadakan untuk mencegah penyalahgunaan oleh pihak luar. Sistem mengenali peran (**Administrator**, **Petugas Piket**, **Pengurus OSIS**, **Guru Pembina**, atau **Siswa Aktif**) secara otomatis.

---

### 1. Akun Pengelola & Staf Sekolah (Akun Permanen)
> **Akses Admin/Staf**: Otomatis diarahkan ke **Dashboard Admin** (`/admin/dashboard`). Memiliki kewenangan mengelola akun siswa, verifikasi klaim Lost & Found, menanggapi aspirasi, dan moderasi laporan.

| No | Nama Akun | Peran | Email Resmi | Kata Sandi | Tugas / Keterangan |
| :-: | :--- | :---: | :--- | :--- | :--- |
| **1** | **Administrator POSIS** | `admin` | `admin@smkn1ciomas.sch.id` | `admin123` | Administrator Sistem Informasi SMKN 1 Ciomas |
| **2** | **Siti Rahmawati** | `osis` | `osis@smkn1ciomas.sch.id` | `adminosis123` | Ketua OSIS (XI DKV 2) — Moderasi Suara Siswa |
| **3** | **Pak Suryono** | `piket` | `piket@smkn1ciomas.sch.id` | `adminpiket123` | Petugas Piket & Ketertiban (Verifikasi Klaim Fisik) |
| **4** | **Ahmad Fauzi, S.Pd.** | `guru_pembina` | `guru@smkn1ciomas.sch.id` | `adminguru123` | Pembina Kesiswaan & Bimbingan Konseling |

---

### 2. Daftar 50 Akun Siswa Penguji Resmi (Test Accounts)
> **Akses Siswa**: Otomatis diarahkan ke **Beranda** (`/beranda`). Dapat mengirim laporan kehilangan/temuan barang, mengajukan klaim barang, mengirim aspirasi perbaikan fasilitas, memberi dukungan suara (*upvote*), serta menerima pembaruan real-time di **Lonceng Notifikasi**.
>
> **Kata Sandi Seragam Seluruh Akun Siswa**: `siswa123`  
> *(Siswa dapat login menggunakan NISN maupun Email resmi di bawah ini)*

| No | NISN | Nama Lengkap Siswa | Kelas & Jurusan | Email Siswa | Kata Sandi |
| :-: | :---: | :--- | :--- | :--- | :---: |
| 1 | `0070001001` | Aditya Pratama Putra | X RPL 1 | `siswa01@smkn1ciomas.sch.id` | `siswa123` |
| 2 | `0070001002` | Aisyah Putri Maharani | X RPL 1 | `siswa02@smkn1ciomas.sch.id` | `siswa123` |
| 3 | `0070001003` | Alif Bayu Nugroho | X RPL 2 | `siswa03@smkn1ciomas.sch.id` | `siswa123` |
| 4 | `0070001004` | Amanda Dwi Lestari | X RPL 2 | `siswa04@smkn1ciomas.sch.id` | `siswa123` |
| 5 | `0070001005` | Andhika Arya Prasetya | X Animasi 1 | `siswa05@smkn1ciomas.sch.id` | `siswa123` |
| 6 | `0070001006` | Anggita Sekar Wangi | X Animasi 1 | `siswa06@smkn1ciomas.sch.id` | `siswa123` |
| 7 | `0070001007` | Anisa Tri Wahyuni | X Animasi 2 | `siswa07@smkn1ciomas.sch.id` | `siswa123` |
| 8 | `0070001008` | Ardiansyah Rahman | X TKJ 1 | `siswa08@smkn1ciomas.sch.id` | `siswa123` |
| 9 | `0070001009` | Aulia Rahmawati | X TKJ 1 | `siswa09@smkn1ciomas.sch.id` | `siswa123` |
| 10 | `0070001010` | Bagas Satria Pratama | X TKJ 2 | `siswa10@smkn1ciomas.sch.id` | `siswa123` |
| 11 | `0070001011` | Bela Nur Safitri | X BCF 1 | `siswa11@smkn1ciomas.sch.id` | `siswa123` |
| 12 | `0070001012` | Bima Sakti Pangestu | X DKV 1 | `siswa12@smkn1ciomas.sch.id` | `siswa123` |
| 13 | `0070001013` | Cantika Indah Permata | XI RPL 1 | `siswa13@smkn1ciomas.sch.id` | `siswa123` |
| 14 | `0070001014` | Daffa Ihsan Firdaus | XI RPL 1 | `siswa14@smkn1ciomas.sch.id` | `siswa123` |
| 15 | `0070001015` | Danendra Arya Wibowo | XI RPL 2 | `siswa15@smkn1ciomas.sch.id` | `siswa123` |
| 16 | `0070001016` | Dea Ananda Kusuma | XI RPL 2 | `siswa16@smkn1ciomas.sch.id` | `siswa123` |
| 17 | `0070001017` | Dimas Fauzi Nugraha | XI Animasi 1 | `siswa17@smkn1ciomas.sch.id` | `siswa123` |
| 18 | `0070001018` | Dina Kartika Sari | XI Animasi 1 | `siswa18@smkn1ciomas.sch.id` | `siswa123` |
| 19 | `0070001019` | Eka Maulana Saputra | XI Animasi 2 | `siswa19@smkn1ciomas.sch.id` | `siswa123` |
| 20 | `0070001020` | Fahri Ramadhan | XI TKJ 1 | `siswa20@smkn1ciomas.sch.id` | `siswa123` |
| 21 | `0070001021` | Farhan Maulana Hakim | XI TKJ 1 | `siswa21@smkn1ciomas.sch.id` | `siswa123` |
| 22 | `0070001022` | Fauzan Fadlilah | XI TKJ 2 | `siswa22@smkn1ciomas.sch.id` | `siswa123` |
| 23 | `0070001023` | Fitri Handayani | XI BCF 1 | `siswa23@smkn1ciomas.sch.id` | `siswa123` |
| 24 | `0070001024` | Galang Raditya Putra | XI DKV 1 | `siswa24@smkn1ciomas.sch.id` | `siswa123` |
| 25 | `0070001025` | Gilang Ramadhan | XI TKR 1 | `siswa25@smkn1ciomas.sch.id` | `siswa123` |
| 26 | `0070001026` | Hafizh Shidqi Robbani | XII RPL 1 | `siswa26@smkn1ciomas.sch.id` | `siswa123` |
| 27 | `0070001027` | Hanifah Nur Azizah | XII RPL 1 | `siswa27@smkn1ciomas.sch.id` | `siswa123` |
| 28 | `0070001028` | Ilham Wahyu Hidayat | XII RPL 2 | `siswa28@smkn1ciomas.sch.id` | `siswa123` |
| 29 | `0070001029` | Indah Permatasari | XII RPL 2 | `siswa29@smkn1ciomas.sch.id` | `siswa123` |
| 30 | `0070001030` | Intan Nur Aini | XII Animasi 1 | `siswa30@smkn1ciomas.sch.id` | `siswa123` |
| 31 | `0070001031` | Irfan Maulana Yusuf | XII Animasi 1 | `siswa31@smkn1ciomas.sch.id` | `siswa123` |
| 32 | `0070001032` | Kevin Julio Pratama | XII Animasi 2 | `siswa32@smkn1ciomas.sch.id` | `siswa123` |
| 33 | `0070001033` | Laras Salsabila | XII TKJ 1 | `siswa33@smkn1ciomas.sch.id` | `siswa123` |
| 34 | `0070001034` | Mochamad Revaldi | XII TKJ 1 | `siswa34@smkn1ciomas.sch.id` | `siswa123` |
| 35 | `0070001035` | Muhammad Alief Zaki | XII TKJ 2 | `siswa35@smkn1ciomas.sch.id` | `siswa123` |
| 36 | `0070001036` | Muhammad Farhan Syah | XII TKJ 2 | `siswa36@smkn1ciomas.sch.id` | `siswa123` |
| 37 | `0070001037` | Muhammad Iqbal Tawakal | XII BCF 1 | `siswa37@smkn1ciomas.sch.id` | `siswa123` |
| 38 | `0070001038` | Nabila Zahra Putri | XII DKV 1 | `siswa38@smkn1ciomas.sch.id` | `siswa123` |
| 39 | `0070001039` | Nadhif Arya Sena | X RPL 1 | `siswa39@smkn1ciomas.sch.id` | `siswa123` |
| 40 | `0070001040` | Nadya Putri Utami | X RPL 2 | `siswa40@smkn1ciomas.sch.id` | `siswa123` |
| 41 | `0070001041` | Rafi Ahmad Fauzan | X Animasi 1 | `siswa41@smkn1ciomas.sch.id` | `siswa123` |
| 42 | `0070001042` | Rangga Dwi Putra | X TKJ 1 | `siswa42@smkn1ciomas.sch.id` | `siswa123` |
| 43 | `0070001043` | Reza Aditya Maulana | XI RPL 1 | `siswa43@smkn1ciomas.sch.id` | `siswa123` |
| 44 | `0070001044` | Rian Hidayatullah | XI Animasi 2 | `siswa44@smkn1ciomas.sch.id` | `siswa123` |
| 45 | `0070001045` | Rizka Nur Azizah | XI TKJ 2 | `siswa45@smkn1ciomas.sch.id` | `siswa123` |
| 46 | `0070001046` | Salma Fauziyyah | XII RPL 1 | `siswa46@smkn1ciomas.sch.id` | `siswa123` |
| 47 | `0070001047` | Sandi Kurniawan | XII Animasi 2 | `siswa47@smkn1ciomas.sch.id` | `siswa123` |
| 48 | `0070001048` | Syahrul Ramadhan | XII TKJ 1 | `siswa48@smkn1ciomas.sch.id` | `siswa123` |
| 49 | `0070001049` | Taufik Hidayat | XII BCF 1 | `siswa49@smkn1ciomas.sch.id` | `siswa123` |
| 50 | `0070001050` | Zahra Aulia Rahmah | XII DKV 1 | `siswa50@smkn1ciomas.sch.id` | `siswa123` |

---

## 🔔 Fitur Lonceng Notifikasi di Navbar Siswa

Di bar navigasi atas (*Header*), telah ditambahkan ikon **Lonceng Notifikasi Interaktif** yang aktif untuk setiap siswa yang masuk:
1. **Pemberitahuan Klaim Barang Diterima / Ditolak**:
   - Menampilkan notifikasi berwarna hijau jika klaim barang telah diverifikasi oleh Petugas Piket beserta instruksi pengambilan di Ruang Piket.
   - Menampilkan notifikasi merah jika klaim ditolak beserta catatan verifikasi dari petugas.
2. **Pembaruan Status Aspirasi Sekolah**:
   - Menampilkan notifikasi saat aspirasi sedang diproses atau berhasil diselesaikan/ditindaklanjuti oleh pihak sekolah lengkap dengan pesan tanggapan resmi administrator.
3. **Badge Counter & Tandai Sudah Dibaca**:
   - Terdapat badge angka merah berdenyut halus menandakan jumlah pemberitahuan yang belum dibaca.
   - Tersedia tombol *"Tandai Semua Dibaca"* serta tautan cepat langsung ke halaman modul terkait (*Lost & Found* atau *Aspirasi*).

---

## 🧭 Alur Sistem & Fitur Utama

### 1. Halaman Masuk Khusus Warga Sekolah (`/`)
- Menampilkan form login terpadu menggunakan NISN atau Email siswa.
- Menu registrasi publik telah ditutup demi privasi dan mencegah data disalahgunakan pihak di luar sekolah.
- Dilengkapi animasi sambutan logo SMKN 1 Ciomas yang berputar 360° secara halus (linear 1.5 detik per rotasi) pada sesi awal.

### 2. Dashboard Admin & Pengelola (`/admin/dashboard`)
- **Kelola Siswa**: Melihat 50 akun siswa, status aktif, pencarian, dan reset kata sandi.
- **Kelola Lost & Found**: Moderasi laporan masuk, pengembalian barang, dan hapus permanen langsung dari database MySQL.
- **Kelola Klaim Barang**: Verifikasi bukti klaim khusus siswa, persetujuan serah terima fisik, dan penolakan klaim.
- **Kelola Aspirasi & Komentar**: Memberikan respon balasan resmi, memperbarui status aspirasi (Diproses / Ditindaklanjuti / Ditolak), dan moderasi komentar aspirasi.
- **Kelola Panduan & FAQ**: Menambah dan memperbarui pusat bantuan sekolah.

---

## 🚀 Panduan Menjalankan Sistem

Sistem POSIS terintegrasi antara **Backend REST API (Laravel 11)** dan **Frontend (React + Vite + Tailwind CSS)** dengan database **MySQL (Laragon / phpMyAdmin `db_posis`)**.

### 1. Menjalankan Backend (Laravel 11)
Buka terminal di folder `backend`:
```powershell
cd backend
php artisan serve --port=8000
```
- Server API aktif di: `http://127.0.0.1:8000`
- Database: MySQL `db_posis` (Host: 127.0.0.1:3306)

### 2. Menjalankan Frontend (React + Vite)
Buka terminal di folder `frontend`:
```powershell
cd frontend
npm run dev
```
- Buka browser di: `http://localhost:5173`

---

## 🏫 Identitas Sekolah
- **Institusi**: SMK Negeri 1 Ciomas
- **Alamat**: Jl. Raya Laladon No. 2, Ciomas, Kabupaten Bogor, Jawa Barat
- **Sistem**: POSIS (Pusat Olah Suara & Informasi Siswa) v1.0
