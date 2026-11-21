<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'identity' => 'nullable|string',
            'email' => 'nullable|string',
            'username' => 'nullable|string',
            'password' => 'required|string',
        ]);

        $identity = $request->input('identity') ?? $request->input('email') ?? $request->input('username');
        if (!$identity) {
            return response()->json([
                'message' => 'NISN, Email, atau Username wajib diisi.'
            ], 422);
        }

        $permanentAccounts = [
            'admin@smkn1ciomas.sch.id' => [
                'password' => 'admin123',
                'nisn' => null,
                'name' => 'Administrator POSIS',
                'role' => \App\Enums\UserRole::ADMIN,
                'class_or_division' => 'Pengelola Sistem Informasi SMKN 1 Ciomas',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminPOSIS',
            ],
            'siswa@smkn1ciomas.sch.id' => [
                'password' => 'siswa123',
                'nisn' => '0067823910',
                'name' => 'Muhammad Rizky Pratama',
                'role' => \App\Enums\UserRole::SISWA,
                'class_or_division' => 'XII Rekayasa Perangkat Lunak 1',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizky',
            ],
            'osis@smkn1ciomas.sch.id' => [
                'password' => 'adminosis123',
                'nisn' => '0071293845',
                'name' => 'Siti Rahmawati',
                'role' => \App\Enums\UserRole::OSIS,
                'class_or_division' => 'XI Desain Komunikasi Visual 2 (Ketua OSIS)',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti',
            ],
            'piket@smkn1ciomas.sch.id' => [
                'password' => 'adminpiket123',
                'nisn' => null,
                'name' => 'Pak Suryono',
                'role' => \App\Enums\UserRole::PIKET,
                'class_or_division' => 'Petugas Piket & Ketertiban',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Suryono',
            ],
            'guru@smkn1ciomas.sch.id' => [
                'password' => 'adminguru123',
                'nisn' => null,
                'name' => 'Ahmad Fauzi, S.Pd.',
                'role' => \App\Enums\UserRole::GURU_PEMBINA,
                'class_or_division' => 'Pembina Kesiswaan & OSIS',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Fauzi',
            ],
        ];

        // Cek apakah kredensial cocok dengan akun permanen sistem
        $inputPassword = (string)$request->input('password');
        $normalizedIdentity = strtolower(trim($identity));
        $matchedPermanent = null;

        foreach ($permanentAccounts as $email => $data) {
            if ($normalizedIdentity === strtolower($email) || ($data['nisn'] && $normalizedIdentity === $data['nisn'])) {
                if ($inputPassword === $data['password']) {
                    $matchedPermanent = array_merge($data, ['email' => $email]);
                }
                break;
            }
        }

        if ($matchedPermanent) {
            $user = User::firstOrCreate(
                ['email' => $matchedPermanent['email']],
                [
                    'nisn' => $matchedPermanent['nisn'],
                    'name' => $matchedPermanent['name'],
                    'password' => Hash::make($matchedPermanent['password']),
                    'role' => $matchedPermanent['role'],
                    'class_or_division' => $matchedPermanent['class_or_division'],
                    'avatar_url' => $matchedPermanent['avatar_url'],
                    'is_active' => true,
                ]
            );

            // Pastikan password dan status selalu sinkron
            if (!Hash::check($inputPassword, $user->password) || !$user->is_active) {
                $user->password = Hash::make($matchedPermanent['password']);
                $user->is_active = true;
                $user->save();
            }
        } else {
            $user = User::where('nisn', $identity)
                ->orWhere('email', $identity)
                ->first();

            if (!$user || !Hash::check($inputPassword, $user->password)) {
                return response()->json([
                    'message' => 'NISN/Email atau kata sandi yang Anda masukkan salah.'
                ], 422);
            }

            if (!$user->is_active) {
                return response()->json([
                    'message' => 'Akun Anda sedang dinonaktifkan oleh administrator sekolah.'
                ], 403);
            }
        }

        $token = $user->createToken('posis-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function register(Request $request)
    {
        return response()->json([
            'status' => 'error',
            'message' => 'Pendaftaran mandiri publik ditutup oleh pihak sekolah demi keamanan. Silakan gunakan akun siswa terdaftar yang telah disediakan oleh administrator SMKN 1 Ciomas.'
        ], 403);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => new UserResource($request->user()),
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $user?->currentAccessToken()?->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil keluar dari sistem.'
        ]);
    }
}
