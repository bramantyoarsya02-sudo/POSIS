<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Aspiration;
use App\Enums\ItemStatus;
use App\Enums\AspirationStatus;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    public function __invoke()
    {
        $data = Cache::remember('public_stats_data', 60, function () {
            return [
                'itemsReturned' => Item::where('status', ItemStatus::SELESAI)->count(),
                'aspirationsSubmitted' => Aspiration::count(),
                'aspirationsCompleted' => Aspiration::where('status', AspirationStatus::DITINDAKLANJUTI)->count(),
                'activeLostItems' => Item::where('type', 'hilang')->where('status', ItemStatus::TERSEDIA)->count(),
                'activeFoundItems' => Item::where('type', 'ditemukan')->where('status', ItemStatus::TERSEDIA)->count(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
