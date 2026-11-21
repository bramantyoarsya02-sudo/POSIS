<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;
use App\Models\Item;
use App\Enums\ItemStatus;

class AdminClaimController extends Controller
{
    public function index(Request $request)
    {
        $query = Claim::with(['item', 'claimant', 'verifier']);

        if ($request->filled('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        $term = $request->input('search') ?? $request->input('q');
        if (!empty($term)) {
            $query->where(function($q) use ($term) {
                $q->where('claim_number', 'like', "%{$term}%")
                  ->orWhere('claimant_name', 'like', "%{$term}%")
                  ->orWhere('proof_description', 'like', "%{$term}%")
                  ->orWhereHas('item', function($iq) use ($term) {
                      $iq->where('title', 'like', "%{$term}%")
                         ->orWhere('ticket_number', 'like', "%{$term}%");
                  })
                  ->orWhereHas('claimant', function($uq) use ($term) {
                      $uq->where('name', 'like', "%{$term}%")
                         ->orWhere('nisn', 'like', "%{$term}%");
                  });
            });
        }

        $claims = $query->latest()->paginate($request->input('per_page', 10));

        $formatted = $claims->getCollection()->map(function($claim) {
            return [
                'id' => $claim->id,
                'claim_number' => $claim->claim_number,
                'claimant_name' => $claim->claimant_name ?? $claim->claimant?->name ?? 'Siswa SMKN 1 Ciomas',
                'claimant_class' => $claim->claimant?->class_or_division ?? 'Siswa',
                'claimant_nisn' => $claim->claimant?->nisn ?? '-',
                'claimant_email' => $claim->claimant?->email ?? '-',
                'item_id' => $claim->item_id,
                'item_title' => $claim->item?->title ?? 'Barang Telah Dihapus',
                'item_ticket' => $claim->item?->ticket_number ?? '-',
                'item_category' => $claim->item?->category?->value ?? $claim->item?->category ?? 'lainnya',
                'item_location' => $claim->item?->location ?? '-',
                'item_handover_point' => $claim->item?->handover_point ? (is_object($claim->item->handover_point) ? ($claim->item->handover_point->label() ?? $claim->item->handover_point->value) : str_replace('_', ' ', strtoupper($claim->item->handover_point))) : 'Ruang Piket Sekolah',
                'proof_description' => $claim->proof_description,
                'proof_photo_url' => $claim->proof_photo_path ? asset('storage/' . $claim->proof_photo_path) : null,
                'status' => $claim->status,
                'verification_note' => $claim->verification_note,
                'verifier_name' => $claim->verifier?->name,
                'verified_at' => $claim->verified_at?->format('d M Y H:i'),
                'handover_at' => $claim->handover_at?->format('d M Y H:i'),
                'created_at' => $claim->created_at?->format('d M Y H:i'),
            ];
        });

        return response()->json([
            'data' => $formatted,
            'meta' => [
                'current_page' => $claims->currentPage(),
                'last_page' => $claims->lastPage(),
                'per_page' => $claims->perPage(),
                'total' => $claims->total(),
            ]
        ]);
    }

    public function verify(Request $request, $id)
    {
        $claim = Claim::with('item')->findOrFail($id);
        $user = $request->user();

        $validated = $request->validate([
            'verification_note' => 'nullable|string|max:1000',
        ]);

        $claim->update([
            'status' => 'terverifikasi',
            'verified_by' => $user->id,
            'verification_note' => $validated['verification_note'] ?? 'Klaim terverifikasi, ciri khusus cocok dan barang telah diserahkan fisik.',
            'verified_at' => now(),
            'handover_at' => now(),
        ]);

        if ($claim->item) {
            $claim->item->update([
                'status' => ItemStatus::SELESAI,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Klaim {$claim->claim_number} berhasil diverifikasi dan serah terima selesai dicatat.",
            'claim' => $claim,
        ]);
    }

    public function reject(Request $request, $id)
    {
        $claim = Claim::with('item')->findOrFail($id);
        $user = $request->user();

        $validated = $request->validate([
            'verification_note' => 'required|string|max:1000',
        ]);

        $claim->update([
            'status' => 'ditolak',
            'verified_by' => $user->id,
            'verification_note' => $validated['verification_note'],
            'verified_at' => now(),
        ]);

        if ($claim->item) {
            $claim->item->update([
                'status' => ItemStatus::TERSEDIA,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Klaim {$claim->claim_number} telah ditolak. Status barang dikembalikan ke 'tersedia'.",
            'claim' => $claim,
        ]);
    }

    public function destroy($id)
    {
        $claim = Claim::findOrFail($id);
        $claim->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Catatan klaim berhasil dihapus.',
        ]);
    }
}
