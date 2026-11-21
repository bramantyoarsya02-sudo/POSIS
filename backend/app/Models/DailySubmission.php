<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailySubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'submission_date',
        'count',
    ];

    protected function casts(): array
    {
        return [
            'submission_date' => 'date:Y-m-d',
            'count' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
