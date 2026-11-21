<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AspirationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $currentUser = $request->user('sanctum') ?? $request->user();
        $isAdmin = $currentUser && $currentUser->role && method_exists($currentUser->role, 'isAdmin') ? $currentUser->role->isAdmin() : false;

        // Sensor nama jika anonim dan user yang mengakses bukan admin
        $authorName = 'Siswa SMKN 1 Ciomas (Anonim)';
        if (!$this->is_anonymous) {
            $authorName = $this->user ? $this->user->name . ' (' . ($this->user->class_or_division ?? 'Siswa') . ')' : 'Siswa SMKN 1 Ciomas';
        } elseif ($isAdmin && config('posis.anonymous_visible_to_admin', true)) {
            $authorName = ($this->user?->name ?? 'Anonim') . ' [ASLI: ' . ($this->user?->nisn ?? 'NISN') . ']';
        }

        $hasVoted = false;
        if ($currentUser) {
            $hasVoted = $this->votes ? $this->votes->contains('user_id', $currentUser->id) : false;
        }

        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'category' => $this->category?->value ?? $this->category,
            'title' => $this->title,
            'body' => $this->body,
            'photo_url' => $this->photo_path ? asset('storage/' . $this->photo_path) : null,
            'is_anonymous' => (bool)$this->is_anonymous,
            'author_name' => $authorName,
            'is_emergency' => (bool)$this->is_emergency,
            'status' => $this->status?->value ?? $this->status,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'admin_reply' => $this->admin_reply,
            'upvotes_count' => (int)$this->upvotes_count,
            'comments_count' => (int)$this->comments_count,
            'has_voted' => $hasVoted,
            'created_at' => $this->created_at?->toISOString(),
            'comments' => $this->comments ? $this->comments->map(fn($c) => [
                'id' => $c->id,
                'author' => $c->user ? ($c->user->name . ($c->user->class_or_division ? ' (' . $c->user->class_or_division . ')' : '')) : 'Warga Sekolah',
                'body' => $c->body,
                'text' => $c->body,
                'is_official_reply' => (bool)$c->is_official_reply,
                'isOfficial' => (bool)$c->is_official_reply,
                'created_at' => $c->created_at?->format('d M Y H:i') . ' WIB',
                'time' => $c->created_at ? $c->created_at->diffForHumans() : 'Baru saja',
            ]) : [],
            'timeline' => $this->statusLogs->map(fn($log) => [
                'status' => $log->new_status,
                'label' => ucwords(str_replace('_', ' ', $log->new_status)),
                'date' => $log->created_at?->format('d M Y H:i') . ' WIB',
                'note' => $log->note,
            ]),
        ];
    }
}
