<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case SISWA = 'siswa';
    case OSIS = 'osis';
    case PIKET = 'piket';
    case GURU_PEMBINA = 'guru_pembina';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator Utama',
            self::SISWA => 'Siswa Aktif',
            self::OSIS => 'Pengurus OSIS',
            self::PIKET => 'Petugas Piket & Ketertiban',
            self::GURU_PEMBINA => 'Guru Pembina Kesiswaan',
        };
    }

    public function isAdmin(): bool
    {
        return $this !== self::SISWA;
    }
}
