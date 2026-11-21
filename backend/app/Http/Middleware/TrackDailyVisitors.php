<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class TrackDailyVisitors
{
    /**
     * Mencatat pengunjung unik harian menggunakan File Cache bawaan Laravel
     * tanpa perlu menambah atau mengubah tabel database.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $store = Cache::store('file');
            $todayKey = 'posis_daily_visitors_' . Carbon::today()->toDateString();
            $visitors = $store->get($todayKey, []);

            $user = $request->user('sanctum') ?? $request->user();
            $visitorHeader = $request->header('X-Visitor-Id');

            if ($user) {
                $visitorId = 'user_' . $user->id;
            } elseif (!empty($visitorHeader)) {
                $visitorId = 'vid_' . substr(preg_replace('/[^a-zA-Z0-9\-_]/', '', $visitorHeader), 0, 64);
            } else {
                $visitorId = 'anon_' . md5(($request->ip() ?? '127.0.0.1') . '|' . ($request->userAgent() ?? 'browser'));
            }

            if (!isset($visitors[$visitorId])) {
                $visitors[$visitorId] = now()->toDateTimeString();
                $store->put($todayKey, $visitors, Carbon::tomorrow()->addHours(2));
            }
        } catch (\Throwable $e) {
            // Jangan gagalkan request utama jika file cache mengalami kendala
        }

        return $next($request);
    }
}
