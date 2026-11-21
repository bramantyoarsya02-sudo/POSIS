<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;

class AdminStudentController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'siswa');

        $searchTerm = $request->input('search') ?? $request->input('q');
        if (!empty($searchTerm)) {
            $query->where(function($builder) use ($searchTerm) {
                $builder->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('nisn', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhere('class_or_division', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'semua') {
            if (in_array($request->status, ['aktif', 'active', '1', 1], true)) {
                $query->where('is_active', true);
            } elseif (in_array($request->status, ['nonaktif', 'inactive', '0', 0], true)) {
                $query->where('is_active', false);
            }
        }

        $students = $query->latest()->paginate($request->input('per_page', 10));

        return UserResource::collection($students);
    }

    public function toggleActive($id)
    {
        $user = User::where('role', 'siswa')->findOrFail($id);

        if ($user->email === 'siswa@smkn1ciomas.sch.id') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun siswa utama ini bersifat permanen dan harus selalu aktif.',
            ], 403);
        }

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'status' => 'success',
            'message' => $user->is_active ? 'Akun siswa berhasil diaktifkan.' : 'Akun siswa berhasil dinonaktifkan.',
            'user' => new UserResource($user),
        ]);
    }

    public function resetPassword($id)
    {
        $user = User::where('role', 'siswa')->findOrFail($id);

        if ($user->email === 'siswa@smkn1ciomas.sch.id') {
            return response()->json([
                'status' => 'error',
                'message' => 'Kata sandi akun siswa utama ini permanen (siswa123) dan tidak dapat diubah.',
            ], 403);
        }

        $defaultPassword = 'siswa' . substr($user->nisn ?? '123', -3);
        if (strlen($defaultPassword) < 8) {
            $defaultPassword = 'siswa123';
        }

        $user->update([
            'password' => Hash::make($defaultPassword),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Kata sandi siswa berhasil di-reset menjadi: {$defaultPassword}",
        ]);
    }

    public function destroy($id)
    {
        $user = User::where('role', 'siswa')->findOrFail($id);

        if ($user->email === 'siswa@smkn1ciomas.sch.id') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun siswa utama ini bersifat permanen dan tidak dapat dihapus.',
            ], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Akun siswa berhasil dihapus dari sistem.',
        ]);
    }
}
