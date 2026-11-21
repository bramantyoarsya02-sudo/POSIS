<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Http\Resources\ItemResource;
use App\Enums\ItemStatus;
use App\Enums\ModerationStatus;

class AdminItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with('user');

        if ($request->filled('type') && $request->type !== 'semua') {
            $query->where('type', $request->type);
        }

        if ($request->filled('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        if ($request->filled('moderation_status') && $request->moderation_status !== 'semua') {
            $query->where('moderation_status', $request->moderation_status);
        }

        $term = $request->input('search') ?? $request->input('q');
        if (!empty($term)) {
            $query->where(function($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                  ->orWhere('ticket_number', 'like', "%{$term}%")
                  ->orWhere('location', 'like', "%{$term}%")
                  ->orWhere('description', 'like', "%{$term}%");
            });
        }

        $items = $query->latest()->paginate($request->input('per_page', 10));

        return ItemResource::collection($items);
    }

    public function updateStatus(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        $validated = $request->validate([
            'status' => 'nullable|in:tersedia,diklaim,selesai,arsip',
            'moderation_status' => 'nullable|in:menunggu,disetujui,ditolak',
            'reject_reason' => 'nullable|string|max:255',
        ]);

        if (isset($validated['status'])) {
            $item->status = ItemStatus::from($validated['status']);
        }

        if (isset($validated['moderation_status'])) {
            $item->moderation_status = ModerationStatus::from($validated['moderation_status']);
            $item->reject_reason = $validated['reject_reason'] ?? $item->reject_reason;
        }

        $item->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status laporan barang berhasil diperbarui.',
            'item' => new ItemResource($item),
        ]);
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->claims()->delete();
        $item->statusLogs()->delete();
        $item->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan barang berhasil dihapus permanen dari sistem.',
        ]);
    }
}
