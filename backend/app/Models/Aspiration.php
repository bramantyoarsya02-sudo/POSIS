<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\AspirationCategory;
use App\Enums\AspirationStatus;

class Aspiration extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'user_id',
        'is_anonymous',
        'category',
        'title',
        'body',
        'photo_path',
        'is_emergency',
        'status',
        'due_date',
        'admin_reply',
        'reject_reason',
        'upvotes_count',
        'comments_count',
    ];

    protected function casts(): array
    {
        return [
            'is_anonymous' => 'boolean',
            'is_emergency' => 'boolean',
            'category' => AspirationCategory::class,
            'status' => AspirationStatus::class,
            'due_date' => 'date',
            'upvotes_count' => 'integer',
            'comments_count' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->hasMany(AspirationVote::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function statusLogs()
    {
        return $this->morphMany(StatusLog::class, 'trackable');
    }
}
