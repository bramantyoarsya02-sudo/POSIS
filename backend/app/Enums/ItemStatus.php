<?php

namespace App\Enums;

enum ItemStatus: string
{
    case TERSEDIA = 'tersedia';
    case DIKLAIM = 'diklaim';
    case SELESAI = 'selesai';
    case ARSIP = 'arsip';

    public function label(): string
    {
        return match($this) {
            self::TERSEDIA => 'Tersedia / Aktif',
            self::DIKLAIM => 'Dalam Proses Klaim',
            self::SELESAI => 'Selesai / Telah Diserahterimakan',
            self::ARSIP => 'Diarsipkan',
        };
    }
}
