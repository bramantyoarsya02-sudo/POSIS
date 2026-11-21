<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Aspiration;

class AdminCommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::with(['aspiration', 'user']);

        $term = $request->input('search') ?? $request->input('q');
        if (!empty($term)) {
            $query->where(function($q) use ($term) {
                $q->where('body', 'like', "%{$term}%")
                  ->orWhereHas('user', function($uq) use ($term) {
                      $uq->where('name', 'like', "%{$term}%")
                         ->orWhere('email', 'like', "%{$term}%");
                  })
                  ->orWhereHas('aspiration', function($aq) use ($term) {
                      $aq->where('title', 'like', "%{$term}%")
                         ->orWhere('ticket_number', 'like', "%{$term}%");
                  });
            });
        }

        $comments = $query->latest()->paginate($request->input('per_page', 10));

        $formatted = $comments->getCollection()->map(function($comment) {
            return [
                'id' => $comment->id,
                'aspiration_id' => $comment->aspiration_id,
                'aspiration_title' => $comment->aspiration?->title ?? 'Aspirasi Telah Dihapus',
                'aspiration_ticket' => $comment->aspiration?->ticket_number ?? '-',
                'user_id' => $comment->user_id,
                'author_name' => $comment->user?->name ?? 'Warga Sekolah',
                'author_email' => $comment->user?->email ?? '-',
                'author_class' => $comment->user?->class_or_division ?? 'Siswa',
                'author_role' => $comment->user?->role?->value ?? $comment->user?->role ?? 'siswa',
                'body' => $comment->body,
                'is_official_reply' => (bool)$comment->is_official_reply,
                'created_at' => $comment->created_at?->format('d M Y H:i'),
            ];
        });

        return response()->json([
            'data' => $formatted,
            'meta' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    public function destroy($id)
    {
        $comment = Comment::with('aspiration')->findOrFail($id);
        
        if ($comment->aspiration) {
            $comment->aspiration->decrement('comments_count');
        }

        $comment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Komentar berhasil dihapus / dimoderasi.',
        ]);
    }
}
