<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_number',
        'item_id',
        'user_id',
        'claimant_name',
        'proof_description',
        'proof_photo_path',
        'status',
        'verified_by',
        'verification_note',
        'verified_at',
        'handover_at',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'handover_at' => 'datetime',
        ];
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function claimant()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function statusLogs()
    {
        return $this->morphMany(StatusLog::class, 'trackable');
    }
}
