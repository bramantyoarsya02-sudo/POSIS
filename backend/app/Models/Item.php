<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ItemType;
use App\Enums\ItemStatus;
use App\Enums\ModerationStatus;
use App\Enums\HandoverPoint;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'user_id',
        'type',
        'title',
        'category',
        'location',
        'event_date',
        'description',
        'photo_path',
        'handover_point',
        'service_hours',
        'status',
        'moderation_status',
        'reject_reason',
    ];

    protected function casts(): array
    {
        return [
            'type' => ItemType::class,
            'status' => ItemStatus::class,
            'moderation_status' => ModerationStatus::class,
            'handover_point' => HandoverPoint::class,
            'event_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function claims()
    {
        return $this->hasMany(Claim::class);
    }

    public function statusLogs()
    {
        return $this->morphMany(StatusLog::class, 'trackable');
    }
}
