<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Item;
use App\Models\Claim;
use App\Models\Aspiration;
use App\Enums\ModerationStatus;
use App\Enums\AspirationStatus;
use App\Enums\ItemStatus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Statistik Ringkasan
        $totalStudents = User::where('role', 'siswa')->count();

        $itemsTotal = Item::count();
        $itemsLost = Item::where('type', 'hilang')->count();
        $itemsFound = Item::where('type', 'ditemukan')->count();
        $itemsCompleted = Item::where('status', ItemStatus::SELESAI)->count();

        $aspirationsTotal = Aspiration::count();
        $aspirationsNew = Aspiration::where('status', AspirationStatus::MENUNGGU_REVIEW)->count();
        $aspirationsProcessing = Aspiration::where('status', AspirationStatus::DIPROSES)->count();
        $aspirationsDone = Aspiration::where('status', AspirationStatus::DITINDAKLANJUTI)->count();

        // 2. Data Tren Bulanan Real dari Database (6 Bulan Terakhir)
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->translatedFormat('M Y');

            $itemCount = Item::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $aspCount = Aspiration::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $months[] = [
                'month' => $monthName,
                'lostFound' => $itemCount,
                'aspiration' => $aspCount,
            ];
        }

        // 3. Aktivitas Terbaru (Gabungan 8-10 aktivitas terakhir)
        $recentActivities = [];

        $latestItems = Item::latest()->take(4)->get();
        foreach ($latestItems as $it) {
            $typeStr = is_object($it->type) ? $it->type->value : (string) $it->type;
            $recentActivities[] = [
                'id' => 'item-' . $it->id,
                'type' => 'lost_found',
                'title' => ($typeStr === 'hilang' ? 'Laporan Kehilangan: ' : 'Laporan Temuan: ') . $it->title,
                'author' => $it->user?->name ?? 'Siswa SMKN 1 Ciomas',
                'badge' => ucfirst($typeStr),
                'badgeColor' => $typeStr === 'hilang' ? 'red' : 'emerald',
                'created_at' => $it->created_at->diffForHumans(),
                'timestamp' => $it->created_at->timestamp,
            ];
        }

        $latestAspirations = Aspiration::latest()->take(4)->get();
        foreach ($latestAspirations as $asp) {
            $recentActivities[] = [
                'id' => 'asp-' . $asp->id,
                'type' => 'aspiration',
                'title' => 'Aspirasi Masuk: ' . $asp->title,
                'author' => $asp->is_anonymous ? 'Siswa (Anonim)' : ($asp->user?->name ?? 'Siswa'),
                'badge' => 'Aspirasi',
                'badgeColor' => 'blue',
                'created_at' => $asp->created_at->diffForHumans(),
                'timestamp' => $asp->created_at->timestamp,
            ];
        }

        $latestStudents = User::where('role', 'siswa')->latest()->take(3)->get();
        foreach ($latestStudents as $st) {
            $recentActivities[] = [
                'id' => 'student-' . $st->id,
                'type' => 'student_registered',
                'title' => 'Siswa Baru Terdaftar: ' . $st->name,
                'author' => $st->class_or_division ?? 'Siswa Aktif',
                'badge' => 'Pendaftaran',
                'badgeColor' => 'amber',
                'created_at' => $st->created_at->diffForHumans(),
                'timestamp' => $st->created_at->timestamp,
            ];
        }

        $latestClaims = Claim::with('item')->latest()->take(4)->get();
        foreach ($latestClaims as $cl) {
            $recentActivities[] = [
                'id' => 'claim-' . $cl->id,
                'type' => 'claim',
                'title' => 'Klaim Barang: ' . ($cl->item?->title ?? 'Barang Temuan'),
                'author' => $cl->claimant_name ?? $cl->claimant?->name ?? 'Siswa',
                'badge' => 'Klaim ' . ucfirst($cl->status),
                'badgeColor' => $cl->status === 'terverifikasi' ? 'emerald' : ($cl->status === 'ditolak' ? 'red' : 'amber'),
                'created_at' => $cl->created_at->diffForHumans(),
                'timestamp' => $cl->created_at->timestamp,
            ];
        }

        $claimsTotal = Claim::count();
        $claimsPending = Claim::where('status', 'menunggu')->count();
        $claimsVerified = Claim::where('status', 'terverifikasi')->count();

        // 4. Hitung Pengunjung & Pengguna Aktif Hari Ini secara Real (File Cache + Token Aktif)
        $todayKey = 'posis_daily_visitors_' . Carbon::today()->toDateString();
        $cachedVisitors = [];
        try {
            $cachedVisitors = Cache::store('file')->get($todayKey, []);
            if (!is_array($cachedVisitors)) {
                $cachedVisitors = [];
            }
        } catch (\Throwable $e) {
            $cachedVisitors = [];
        }

        try {
            $activeTokenUserIds = DB::table('personal_access_tokens')
                ->whereDate('last_used_at', Carbon::today())
                ->orWhereDate('created_at', Carbon::today())
                ->pluck('tokenable_id')
                ->unique();

            foreach ($activeTokenUserIds as $uid) {
                $cachedVisitors['user_' . $uid] = true;
            }
        } catch (\Throwable $e) {
            // Abaikan jika tabel belum tersedia
        }

        $todayVisitorsCount = max(count($cachedVisitors), 1);

        usort($recentActivities, fn($a, $b) => $b['timestamp'] <=> $a['timestamp']);

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => [
                    'totalStudents' => $totalStudents,
                    'lostFound' => [
                        'total' => $itemsTotal,
                        'hilang' => $itemsLost,
                        'ditemukan' => $itemsFound,
                        'selesai' => $itemsCompleted,
                    ],
                    'claims' => [
                        'total' => $claimsTotal,
                        'menunggu' => $claimsPending,
                        'terverifikasi' => $claimsVerified,
                    ],
                    'aspirations' => [
                        'total' => $aspirationsTotal,
                        'baru' => $aspirationsNew,
                        'diproses' => $aspirationsProcessing,
                        'selesai' => $aspirationsDone,
                    ],
                    'todayVisitors' => $todayVisitorsCount,
                ],
                'monthlyTrends' => $months,
                'recentActivities' => array_slice($recentActivities, 0, 8),
            ]
        ]);
    }
}
