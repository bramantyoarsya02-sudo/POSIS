<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Item;
use App\Models\Aspiration;
use App\Models\AspirationVote;
use App\Enums\UserRole;
use App\Enums\ItemType;
use App\Enums\ItemStatus;
use App\Enums\ModerationStatus;
use App\Enums\HandoverPoint;
use App\Enums\AspirationStatus;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Akun Utama: Administrator POSIS SMKN 1 Ciomas
        $admin = User::firstOrCreate(
            ['email' => 'admin@smkn1ciomas.sch.id'],
            [
                'nisn' => null,
                'name' => 'Administrator POSIS',
                'password' => Hash::make('admin123'),
                'role' => UserRole::ADMIN,
                'class_or_division' => 'Pengelola Sistem Informasi SMKN 1 Ciomas',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminPOSIS',
                'is_active' => true,
            ]
        );

        // 1. Akun Uji Coba: Siswa Aktif
        $siswa = User::firstOrCreate(
            ['email' => 'siswa@smkn1ciomas.sch.id'],
            [
                'nisn' => '0067823910',
                'name' => 'Muhammad Rizky Pratama',
                'password' => Hash::make('siswa123'),
                'role' => UserRole::SISWA,
                'class_or_division' => 'XII Rekayasa Perangkat Lunak 1',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizky',
                'is_active' => true,
            ]
        );

        // 2. Akun Uji Coba: Admin 1 - Pengurus OSIS
        $osis = User::firstOrCreate(
            ['email' => 'osis@smkn1ciomas.sch.id'],
            [
                'nisn' => '0071293845',
                'name' => 'Siti Rahmawati',
                'password' => Hash::make('adminosis123'),
                'role' => UserRole::OSIS,
                'class_or_division' => 'XI Desain Komunikasi Visual 2 (Ketua OSIS)',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti',
                'is_active' => true,
            ]
        );

        // 3. Akun Uji Coba: Admin 2 - Petugas Piket
        $piket = User::firstOrCreate(
            ['email' => 'piket@smkn1ciomas.sch.id'],
            [
                'nisn' => null,
                'name' => 'Pak Suryono',
                'password' => Hash::make('adminpiket123'),
                'role' => UserRole::PIKET,
                'class_or_division' => 'Petugas Piket & Ketertiban',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Suryono',
                'is_active' => true,
            ]
        );

        // 4. Akun Uji Coba: Admin 3 - Guru Pembina Kesiswaan
        $guru = User::firstOrCreate(
            ['email' => 'guru@smkn1ciomas.sch.id'],
            [
                'nisn' => null,
                'name' => 'Ahmad Fauzi, S.Pd.',
                'password' => Hash::make('adminguru123'),
                'role' => UserRole::GURU_PEMBINA,
                'class_or_division' => 'Pembina Kesiswaan & OSIS',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Fauzi',
                'is_active' => true,
            ]
        );

        // 5. Seed Items (Lost & Found)
        $itemsToSeed = [
            [
                'ticket_number' => 'POSIS-LF-202610-001',
                'user_id' => $siswa->id,
                'type' => ItemType::DITEMUKAN->value,
                'category' => 'lainnya',
                'title' => 'Kunci Motor Honda Beat Hitam dengan Gantungan Akrilik Ciomas',
                'location' => 'Kantin Sehat Sekolah (Meja Pojok Kanan)',
                'event_date' => '2026-10-05',
                'description' => 'Ditemukan kunci kontak motor beserta remote alarm kecil dan gantungan kunci anime. Telah diserahkan ke ruang piket.',
                'photo_path' => null,
                'handover_point' => HandoverPoint::RUANG_PIKET->value,
                'service_hours' => HandoverPoint::RUANG_PIKET->serviceHours(),
                'status' => ItemStatus::TERSEDIA,
                'moderation_status' => ModerationStatus::DISETUJUI,
            ],
            [
                'ticket_number' => 'POSIS-LF-202610-002',
                'user_id' => $siswa->id,
                'type' => ItemType::HILANG->value,
                'category' => 'elektronik',
                'title' => 'Kalkulator Ilmiah Casio fx-991EX ClassWiz',
                'location' => 'Lab Komputer RPL 2 Lantai 2',
                'event_date' => '2026-10-06',
                'description' => 'Tertinggal saat praktikum pemrograman database jam ke 5-6. Di bagian belakang ada stiker logo SMKN 1 Ciomas.',
                'photo_path' => null,
                'handover_point' => null,
                'service_hours' => null,
                'status' => ItemStatus::TERSEDIA,
                'moderation_status' => ModerationStatus::DISETUJUI,
            ],
            [
                'ticket_number' => 'POSIS-LF-202610-003',
                'user_id' => $osis->id,
                'type' => ItemType::DITEMUKAN->value,
                'category' => 'berkas',
                'title' => 'Kartu Tanda Pelajar (KTP Pelajar) a.n Nabila Azzahra',
                'location' => 'Depan Ruang Perpustakaan',
                'event_date' => '2026-10-06',
                'description' => 'Ditemukan kartu pelajar kelas X Animasi 1 jatuh di koridor depan perpus. Dititipkan di loker ruang BK.',
                'photo_path' => null,
                'handover_point' => HandoverPoint::RUANG_BK->value,
                'service_hours' => HandoverPoint::RUANG_BK->serviceHours(),
                'status' => ItemStatus::TERSEDIA,
                'moderation_status' => ModerationStatus::DISETUJUI,
            ],
        ];

        foreach ($itemsToSeed as $itemData) {
            $existing = Item::withTrashed()->where('ticket_number', $itemData['ticket_number'])->first();
            if ($existing) {
                $existing->restore();
                $existing->update($itemData);
            } else {
                Item::create($itemData);
            }
        }

        // 6. Seed Aspirations
        $asp1 = Aspiration::firstOrCreate(
            ['ticket_number' => 'POSIS-ASP-202610-001'],
            [
                'user_id' => $siswa->id,
                'is_anonymous' => false,
                'category' => 'toilet',
                'title' => 'Kran Air dan Gayung di Toilet Siswa Gedung B Sering Mati dan Bocor',
                'body' => 'Mohon bantuan perbaikan instalasi pipa air di toilet pria gedung B lantai 1. Saat jam istirahat kedua air sering mati sehingga siswa kesulitan berwudhu dan buang air.',
                'photo_path' => null,
                'is_emergency' => false,
                'status' => AspirationStatus::DIPROSES,
                'due_date' => now()->addDays(5)->toDateString(),
                'upvotes_count' => 42,
                'comments_count' => 5,
            ]
        );

        AspirationVote::firstOrCreate([
            'aspiration_id' => $asp1->id,
            'user_id' => $siswa->id,
        ]);

        $asp2 = Aspiration::firstOrCreate(
            ['ticket_number' => 'POSIS-ASP-202610-002'],
            [
                'user_id' => $siswa->id,
                'is_anonymous' => true,
                'category' => 'wifi',
                'title' => 'Penambahan Bandwidth dan Access Point WiFi di Area Belajar Mandiri Perpustakaan',
                'body' => 'Koneksi WiFi SMKN1Ciomas-Edu di perpustakaan sering timeout saat 20+ siswa mengakses e-book dan modul pembelajaran digital secara bersamaan.',
                'photo_path' => null,
                'is_emergency' => false,
                'status' => AspirationStatus::DITINDAKLANJUTI,
                'due_date' => now()->subDays(2)->toDateString(),
                'upvotes_count' => 88,
                'comments_count' => 12,
            ]
        );

        // 1b. Akun Uji Coba: Siswa 2
        $siswa2 = User::firstOrCreate(
            ['email' => 'nabila@smkn1ciomas.sch.id'],
            [
                'nisn' => '0078912345',
                'name' => 'Nabila Azzahra Putri',
                'password' => Hash::make('siswa123'),
                'role' => UserRole::SISWA,
                'class_or_division' => 'X Desain Komunikasi Visual 1',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Nabila',
                'is_active' => true,
            ]
        );

        // 1c. Akun Uji Coba: Siswa 3
        $siswa3 = User::firstOrCreate(
            ['email' => 'fajar@smkn1ciomas.sch.id'],
            [
                'nisn' => '0081234567',
                'name' => 'Fajar Ramadhan Pratama',
                'password' => Hash::make('siswa123'),
                'role' => UserRole::SISWA,
                'class_or_division' => 'XI Teknik Komputer & Jaringan 2',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Fajar',
                'is_active' => true,
            ]
        );

        AspirationVote::firstOrCreate([
            'aspiration_id' => $asp2->id,
            'user_id' => $siswa->id,
        ]);

        // 7. Seed FAQs (Panduan & FAQ)
        $faqsToSeed = [
            [
                'question' => 'Bagaimana jika saya menemukan barang di lingkungan sekolah?',
                'answer' => 'Segera serahkan barang temuan ke Pos Petugas Piket atau Ruang Bimbingan Konseling (BK), lalu buat laporan pada menu Lost & Found agar pemilik dapat mengenali barangnya.',
                'category' => 'lost_found',
            ],
            [
                'question' => 'Apakah aspirasi yang dikirim dengan mode Anonim tetap ditindaklanjuti?',
                'answer' => 'Ya, seluruh aspirasi yang memenuhi tata tertib sekolah akan diverifikasi dan diproses oleh pihak kesiswaan tanpa membedakan status pengirim.',
                'category' => 'aspiration',
            ],
            [
                'question' => 'Berapa batas waktu penanganan aspirasi (SLA) di SMKN 1 Ciomas?',
                'answer' => 'Standar Layanan Aspirasi (SLA) resmi sekolah adalah 7 hari kerja sejak laporan diverifikasi oleh pengurus OSIS atau guru pembina.',
                'category' => 'general',
            ],
        ];

        foreach ($faqsToSeed as $faqData) {
            \App\Models\Faq::firstOrCreate(
                ['question' => $faqData['question']],
                $faqData
            );
        }
    }
}
