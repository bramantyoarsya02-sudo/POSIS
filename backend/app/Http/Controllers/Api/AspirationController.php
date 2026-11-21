<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Aspiration;
use App\Models\AspirationVote;
use App\Models\Comment;
use App\Models\DailySubmission;
use App\Enums\AspirationStatus;
use App\Http\Resources\AspirationResource;

class AspirationController extends Controller
{
    public function index(Request $request)
    {
        $query = Aspiration::with(['user', 'votes', 'statusLogs']);

        if ($request->filled('category') && $request->category !== 'semua') {
            $query->where('category', $request->category);
        }

        if ($request->filled('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        if ($request->filled('q')) {
            $term = $request->q;
            $query->where(function($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                  ->orWhere('body', 'like', "%{$term}%");
            });
        }

        if ($request->input('sort') === 'populer') {
            $query->orderByDesc('upvotes_count');
        } else {
            $query->latest();
        }

        $aspirations = $query->paginate($request->input('per_page', 10));

        return AspirationResource::collection($aspirations);
    }

    public function show($id, Request $request)
    {
        $aspiration = Aspiration::with([
            'user',
            'votes',
            'comments' => fn($q) => $q->with('user')->orderBy('created_at', 'asc'),
            'statusLogs'
        ])->findOrFail($id);
        return new AspirationResource($aspiration);
    }

    public function store(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            $user = \App\Models\User::where('role', 'siswa')->first() ?? \App\Models\User::first();
        }

        if ($user) {
            // Enforce 5 daily submissions
            $today = now()->format('Y-m-d');
            $daily = DailySubmission::where('user_id', $user->id)
                ->whereDate('submission_date', $today)
                ->first();

            if (!$daily) {
                try {
                    $daily = DailySubmission::create([
                        'user_id' => $user->id,
                        'submission_date' => $today,
                        'count' => 0,
                    ]);
                } catch (\Throwable $e) {
                    $daily = DailySubmission::where('user_id', $user->id)->whereDate('submission_date', $today)->first();
                }
            }

            if (!$user->role->isAdmin() && $daily && $daily->count >= config('posis.max_daily_posts', 5)) {
                return response()->json([
                    'message' => 'Anda telah mencapai batas 5 kiriman per hari.'
                ], 429);
            }
        }

        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'category' => 'required|in:toilet,perpustakaan,lapangan,wifi,kantin,lainnya',
            'body' => 'required|string|min:5|max:3000',
            'is_anonymous' => 'nullable|boolean',
            'is_emergency' => 'nullable|boolean',
            'photo' => 'nullable|image|mimes:jpeg,png,webp|max:5120',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('aspirations', 'public');
        }

        $yearMonth = now()->format('Ym');
        $lastTicket = Aspiration::where('ticket_number', 'like', "POSIS-ASP-{$yearMonth}-%")->orderByDesc('id')->value('ticket_number');
        $lastSeq = 0;
        if ($lastTicket && preg_match('/-(\d+)$/', $lastTicket, $matches)) {
            $lastSeq = (int) $matches[1];
        }
        $seq = str_pad($lastSeq + 1, 3, '0', STR_PAD_LEFT);
        $ticket = "POSIS-ASP-{$yearMonth}-{$seq}";
        while (Aspiration::where('ticket_number', $ticket)->exists()) {
            $lastSeq++;
            $seq = str_pad($lastSeq + 1, 3, '0', STR_PAD_LEFT);
            $ticket = "POSIS-ASP-{$yearMonth}-{$seq}";
        }

        // Hitung batas SLA 7 hari kerja
        $dueDate = now()->addWeekdays((int) config('posis.sla_days', 7))->toDateString();

        $aspiration = Aspiration::create([
            'ticket_number' => $ticket,
            'user_id' => $user->id,
            'is_anonymous' => (bool)($validated['is_anonymous'] ?? false),
            'category' => $validated['category'],
            'title' => $validated['title'],
            'body' => $validated['body'],
            'photo_path' => $photoPath,
            'is_emergency' => (bool)($validated['is_emergency'] ?? false),
            'status' => AspirationStatus::MENUNGGU_REVIEW,
            'due_date' => $dueDate,
            'upvotes_count' => 0, // Dimulai dari 0 sesuai permintaan pengguna
        ]);

        // Log awal linimasa
        $aspiration->statusLogs()->create([
            'actor_id' => $user->id,
            'new_status' => 'dikirim',
            'note' => $aspiration->is_emergency ? 'Laporan masuk dengan label darurat kelistrikan/keselamatan.' : 'Aspirasi masuk ke sistem POSIS SMKN 1 Ciomas.',
        ]);

        if ($daily) {
            $daily->increment('count');
        }

        return (new AspirationResource($aspiration))
            ->response()
            ->setStatusCode(201);
    }

    public function vote(Request $request, $id)
    {
        $aspiration = Aspiration::findOrFail($id);
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            $user = \App\Models\User::where('role', 'siswa')->first() ?? \App\Models\User::first();
        }

        $existing = AspirationVote::where('aspiration_id', $aspiration->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $hasVoted = false;
        } else {
            AspirationVote::create([
                'aspiration_id' => $aspiration->id,
                'user_id' => $user->id,
            ]);
            $hasVoted = true;
        }

        // Hitung total dukungan secara akurat langsung dari tabel aspiration_votes
        $totalVotes = AspirationVote::where('aspiration_id', $aspiration->id)->count();
        $aspiration->update(['upvotes_count' => $totalVotes]);

        return response()->json([
            'status' => 'success',
            'upvotes_count' => $totalVotes,
            'has_voted' => $hasVoted,
            'data' => [
                'upvotes_count' => $totalVotes,
                'has_voted' => $hasVoted,
            ]
        ]);
    }

    public function comment(Request $request, $id)
    {
        $aspiration = Aspiration::findOrFail($id);
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            $user = \App\Models\User::where('role', 'siswa')->first() ?? \App\Models\User::first();
        }

        $validated = $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $isOfficial = false;
        if ($user && $user->role) {
            $isOfficial = method_exists($user->role, 'isAdmin') ? $user->role->isAdmin() : ($user->role === 'admin' || $user->role === 'osis');
        }

        $comment = Comment::create([
            'aspiration_id' => $aspiration->id,
            'user_id' => $user->id,
            'body' => $validated['body'],
            'is_official_reply' => $isOfficial,
        ]);

        $aspiration->increment('comments_count');

        $authorDisplay = $user->name . ($user->class_or_division ? ' (' . $user->class_or_division . ')' : '');

        return response()->json([
            'status' => 'success',
            'comment' => [
                'id' => $comment->id,
                'author' => $authorDisplay,
                'body' => $comment->body,
                'text' => $comment->body,
                'is_official_reply' => (bool)$comment->is_official_reply,
                'isOfficial' => (bool)$comment->is_official_reply,
                'created_at' => $comment->created_at->format('d M Y H:i') . ' WIB',
                'time' => 'Baru saja',
            ]
        ], 201);
    }
}
