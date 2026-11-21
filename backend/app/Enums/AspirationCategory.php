<?php

namespace App\Enums;

enum AspirationCategory: string
{
    case TOILET = 'toilet';
    case PERPUSTAKAAN = 'perpustakaan';
    case LAPANGAN = 'lapangan';
    case WIFI = 'wifi';
    case KANTIN = 'kantin';
    case LAINNYA = 'lainnya';

    public function label(): string
    {
        return match($this) {
            self::TOILET => 'Sanitasi & Toilet',
            self::PERPUSTAKAAN => 'Perpustakaan',
            self::LAPANGAN => 'Lapangan Olahraga',
            self::WIFI => 'Jaringan & Wi-Fi',
            self::KANTIN => 'Kantin Sehat',
            self::LAINNYA => 'Fasilitas Lainnya',
        };
    }
}
