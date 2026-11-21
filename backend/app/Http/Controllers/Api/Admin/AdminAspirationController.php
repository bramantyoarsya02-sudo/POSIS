<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Aspiration;
use App\Http\Resources\AspirationResource;
use App\Enums\AspirationStatus;

class AdminAspirationController extends Controller
{
    public function index(Request $request)
    {
        $query = Aspiration::with(['user', 'votes', 'statusLogs']);

        if ($request->filled('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        if ($request->filled('category') && $request->category !== 'semua') {
            $query->where('category', $request->category);
        }

        $term = $request->input('search') ?? $request->input('q');
        if (!empty($term)) {
            $query->where(function($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                  ->orWhere('ticket_number', 'like', "%{$term}%")
                  ->orWhere('body', 'like', "%{$term}%");
            });
        }

        $aspirations = $query->latest()->paginate($request->input('per_page', 10));

        return AspirationResource::collection($aspirations);
    }

    public function updateStatus(Request $request, $id)
    {
        $aspiration = Aspiration::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:menunggu_review,diproses,ditindaklanjuti,ditolak',
            'admin_reply' => 'nullable|string|max:1500',
        ]);

        $aspiration->status = AspirationStatus::from($validated['status']);
        if ($request->filled('admin_reply')) {
            $aspiration->admin_reply = $validated['admin_reply'];
        }
        $aspiration->save();

        // Tambahkan log ke linimasa status
        $aspiration->statusLogs()->create([
            'actor_id' => $request->user()->id,
            'new_status' => $validated['status'],
            'note' => $validated['admin_reply'] ?? 'Status aspirasi diperbarui oleh administrator.',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status dan tanggapan aspirasi berhasil diperbarui.',
            'aspiration' => new AspirationResource($aspiration),
        ]);
    }

    public function destroy($id)
    {
        $aspiration = Aspiration::findOrFail($id);
        $aspiration->votes()->delete();
        $aspiration->comments()->delete();
        $aspiration->statusLogs()->delete();
        $aspiration->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Aspirasi berhasil dihapus permanen dari sistem.',
        ]);
    }
}
