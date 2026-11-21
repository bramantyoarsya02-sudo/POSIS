<?php

namespace App\Enums;

enum ItemType: string
{
    case HILANG = 'hilang';
    case DITEMUKAN = 'ditemukan';

    public function label(): string
    {
        return match($this) {
            self::HILANG => 'Barang Hilang',
            self::DITEMUKAN => 'Barang Ditemukan',
        };
    }
}
