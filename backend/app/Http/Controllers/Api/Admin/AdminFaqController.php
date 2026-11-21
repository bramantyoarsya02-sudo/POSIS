<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faq;

class AdminFaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::query();

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($b) use ($q) {
                $b->where('question', 'like', "%{$q}%")
                  ->orWhere('answer', 'like', "%{$q}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'semua') {
            $query->where('category', $request->category);
        }

        $faqs = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $faqs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string|max:3000',
            'category' => 'nullable|string|max:50',
        ]);

        $faq = Faq::create([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'category' => $validated['category'] ?? 'general',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Konten FAQ berhasil ditambahkan.',
            'data' => $faq
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string|max:3000',
            'category' => 'nullable|string|max:50',
        ]);

        $faq->update([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'category' => $validated['category'] ?? $faq->category,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Konten FAQ berhasil diperbarui.',
            'data' => $faq
        ]);
    }

    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Konten FAQ berhasil dihapus.'
        ]);
    }
}
