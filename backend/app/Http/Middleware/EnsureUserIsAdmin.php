<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sesi tidak valid atau belum melakukan autentikasi.'
            ], 401);
        }

        // Periksa apakah peran pengguna memiliki hak akses administratif
        if (!method_exists($user->role, 'isAdmin') || !$user->role->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak: Anda tidak memiliki hak akses administrator POSIS.'
            ], 403);
        }

        return $next($request);
    }
}
