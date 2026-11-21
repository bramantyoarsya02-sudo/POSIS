<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Item;
use App\Models\Claim;
use App\Models\DailySubmission;
use App\Enums\ItemType;
use App\Enums\ItemStatus;
use App\Enums\ModerationStatus;
use App\Enums\HandoverPoint;
use App\Http\Resources\ItemResource;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with('user')
            ->where('moderation_status', '!=', ModerationStatus::DITOLAK);

        if ($request->filled('type') && $request->type !== 'semua') {
            $query->where('type', $request->type);
        }

        if ($request->filled('category') && $request->category !== 'semua') {
            $query->where('category', $request->category);
        }

        if ($request->filled('q')) {
            $term = $request->q;
            $query->where(function($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                  ->orWhere('description', 'like', "%{$term}%")
                  ->orWhere('location', 'like', "%{$term}%");
            });
        }

        if ($request->filled('start_date')) {
            $query->whereDate('event_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('event_date', '<=', $request->end_date);
        }

        $items = $query->latest('event_date')->paginate($request->input('per_page', 12));

        return ItemResource::collection($items);
    }

    public function show($id)
    {
        $item = Item::with('user')->findOrFail($id);
        return new ItemResource($item);
    }

    public function store(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            $user = \App\Models\User::where('role', 'siswa')->first() ?? \App\Models\User::first();
        }

        if ($user) {
            // Enforce 5 submissions per day for students
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
                    'message' => 'Anda telah mencapai batas maksimal 5 kiriman laporan per hari sesuai tata tertib sekolah.'
                ], 429);
            }
        }

        $validated = $request->validate([
            'type' => 'required|in:hilang,ditemukan',
            'title' => 'required|string|max:150',
            'category' => 'required|in:alat_tulis,elektronik,pakaian,berkas,lainnya',
            'location' => 'required|string|max:150',
            'event_date' => 'required|date',
            'description' => 'required|string|max:2000',
            'handover_point' => 'nullable|required_if:type,ditemukan|in:ruang_piket,ruang_bk,pos_satpam',
            'photo' => 'nullable|image|mimes:jpeg,png,webp,jpg|max:5120', // Maks 5MB
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('items', 'public');
        }

        // Generate Ticket Number
        $yearMonth = now()->format('Ym');
        $lastTicket = Item::where('ticket_number', 'like', "POSIS-LF-{$yearMonth}-%")->orderByDesc('id')->value('ticket_number');
        $lastSeq = 0;
        if ($lastTicket && preg_match('/-(\d+)$/', $lastTicket, $matches)) {
            $lastSeq = (int) $matches[1];
        }
        $seq = str_pad($lastSeq + 1, 3, '0', STR_PAD_LEFT);
        $ticket = "POSIS-LF-{$yearMonth}-{$seq}";
        while (Item::where('ticket_number', $ticket)->exists()) {
            $lastSeq++;
            $seq = str_pad($lastSeq + 1, 3, '0', STR_PAD_LEFT);
            $ticket = "POSIS-LF-{$yearMonth}-{$seq}";
        }

        $item = Item::create([
            'ticket_number' => $ticket,
            'user_id' => $user->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'category' => $validated['category'],
            'location' => $validated['location'],
            'event_date' => $validated['event_date'],
            'description' => $validated['description'],
            'photo_path' => $photoPath,
            'handover_point' => $validated['handover_point'] ?? null,
            'service_hours' => isset($validated['handover_point']) ? HandoverPoint::from($validated['handover_point'])->serviceHours() : null,
            'status' => ItemStatus::TERSEDIA,
            'moderation_status' => ModerationStatus::DISETUJUI,
        ]);

        $daily->increment('count');

        return (new ItemResource($item))
            ->response()
            ->setStatusCode(201);
    }

    public function claim(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            $user = \App\Models\User::where('role', 'siswa')->first() ?? \App\Models\User::first();
        }

        if ($item->type !== ItemType::DITEMUKAN) {
            return response()->json(['message' => 'Hanya barang berstatus ditemukan yang dapat diklaim.'], 400);
        }

        $validated = $request->validate([
            'claimant_name' => 'required|string|min:2|max:150',
            'proof' => 'required|string|min:5|max:1500',
            'proof_photo' => 'nullable|image|mimes:jpeg,png,webp|max:5120',
        ]);

        $photoPath = null;
        if ($request->hasFile('proof_photo')) {
            $photoPath = $request->file('proof_photo')->store('claims', 'public');
        }

        $yearMonth = now()->format('Ym');
        $lastClaim = Claim::where('claim_number', 'like', "POSIS-CLM-{$yearMonth}-%")->orderByDesc('id')->value('claim_number');
        $lastSeq = 0;
        if ($lastClaim && preg_match('/-(\d+)$/', $lastClaim, $matches)) {
            $lastSeq = (int) $matches[1];
        }
        $seq = str_pad($lastSeq + 1, 3, '0', STR_PAD_LEFT);
        $claimNumber = "POSIS-CLM-{$yearMonth}-{$seq}";
        while (Claim::where('claim_number', $claimNumber)->exists()) {
            $lastSeq++;
            $seq = str_pad($lastSeq + 1, 3, '0', STR_PAD_LEFT);
            $claimNumber = "POSIS-CLM-{$yearMonth}-{$seq}";
        }

        $claim = Claim::create([
            'claim_number' => $claimNumber,
            'item_id' => $item->id,
            'user_id' => $user->id,
            'claimant_name' => $validated['claimant_name'],
            'proof_description' => $validated['proof'],
            'proof_photo_path' => $photoPath,
            'status' => 'menunggu',
        ]);

        $item->update(['status' => ItemStatus::DIKLAIM]);

        return response()->json([
            'status' => 'success',
            'claim_number' => $claimNumber,
            'message' => 'Klaim kepemilikan berhasil diajukan. Silakan temui petugas di lokasi serah terima dengan kartu pelajar Anda.'
        ], 201);
    }
}
