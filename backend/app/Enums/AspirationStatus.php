<?php

namespace App\Enums;

enum AspirationStatus: string
{
    case MENUNGGU_REVIEW = 'menunggu_review';
    case DIPROSES = 'diproses';
    case DITINDAKLANJUTI = 'ditindaklanjuti';
    case DITOLAK = 'ditolak';

    public function label(): string
    {
        return match($this) {
            self::MENUNGGU_REVIEW => 'Menunggu Tinjauan',
            self::DIPROSES => 'Diproses Sekolah',
            self::DITINDAKLANJUTI => 'Telah Ditindaklanjuti',
            self::DITOLAK => 'Ditolak dengan Alasan',
        };
    }
}
