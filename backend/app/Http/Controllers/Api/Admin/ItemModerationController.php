<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Enums\ModerationStatus;
use App\Http\Resources\ItemResource;

class ItemModerationController extends Controller
{
    public function index()
    {
        $items = Item::with('user')
            ->where('moderation_status', ModerationStatus::MENUNGGU)
            ->latest()
            ->paginate(15);

        return ItemResource::collection($items);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:disetujui,ditolak',
            'reject_reason' => 'nullable|string|max:255',
        ]);

        $item->update([
            'moderation_status' => $validated['status'] === 'disetujui' ? ModerationStatus::DISETUJUI : ModerationStatus::DITOLAK,
            'reject_reason' => $validated['reject_reason'] ?? null,
        ]);

        return new ItemResource($item);
    }
}
