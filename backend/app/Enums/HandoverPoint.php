<?php

namespace App\Enums;

enum HandoverPoint: string
{
    case RUANG_PIKET = 'ruang_piket';
    case RUANG_BK = 'ruang_bk';
    case POS_SATPAM = 'pos_satpam';

    public function label(): string
    {
        return match($this) {
            self::RUANG_PIKET => 'Ruang Piket Sekolah',
            self::RUANG_BK => 'Ruang Bimbingan Konseling (BK)',
            self::POS_SATPAM => 'Pos Satpam Gerbang Utama',
        };
    }

    public function serviceHours(): string
    {
        return match($this) {
            self::RUANG_PIKET => 'Senin–Jumat 07:00 – 15:30 WIB',
            self::RUANG_BK => 'Senin–Jumat 07:30 – 15:00 WIB',
            self::POS_SATPAM => 'Setiap Hari 06:30 – 17:00 WIB',
        };
    }
}
