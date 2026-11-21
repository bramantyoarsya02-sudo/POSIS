<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;
use App\Models\Aspiration;
use App\Models\Item;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 'success',
                'unread_count' => 0,
                'notifications' => []
            ]);
        }

        $result = Cache::remember("user_notifs_{$user->id}", 20, function () use ($user) {
            $notifications = collect();

            // ============================================================
            // 1. NOTIFIKASI ASPIRASI SISWA
            // ============================================================
            $aspirations = Aspiration::with(['comments.user'])
                ->where('user_id', $user->id)
                ->latest('created_at')
                ->take(15)
                ->get();

        foreach ($aspirations as $asp) {
            $statusVal = is_object($asp->status) ? $asp->status->value : $asp->status;
            $statusLabel = is_object($asp->status) ? $asp->status->label() : ucfirst($statusVal);

            // A. Notifikasi 1: Saat Aspirasi Masuk ke Server & Menunggu Balasan
            $notifications->push([
                'id' => 'asp-' . $asp->id . '-submitted',
                'entity_type' => 'aspiration',
                'entity_id' => $asp->id,
                'status_key' => 'menunggu_review',
                'title' => 'Aspirasi Terkirim ke Server 📋',
                'message' => "Aspirasi Anda '{$asp->title}' ({$asp->ticket_number}) berhasil masuk ke server dan sedang menunggu balasan dari pihak sekolah.",
                'badge' => 'Menunggu Balasan',
                'badge_type' => 'warning',
                'link' => '/aspirasi',
                'timestamp' => $asp->created_at->toIso8601String(),
                'created_at_human' => $asp->created_at->diffForHumans(),
            ]);

            // B. Notifikasi 2: Saat Admin Memberikan Balasan / Mengubah Status
            $hasAdminReply = !empty($asp->admin_reply);
            $hasStatusChanged = $statusVal !== 'menunggu_review';

            if ($hasAdminReply || $hasStatusChanged) {
                $replyTitle = 'Admin Membalas Aspirasi Anda 💬';
                $badgeText = 'Dibalas Admin';
                $badgeType = 'info';

                if ($statusVal === 'ditindaklanjuti') {
                    $replyTitle = 'Aspirasi Selesai Ditindaklanjuti! ✅';
                    $badgeText = 'Selesai';
                    $badgeType = 'success';
                } elseif ($statusVal === 'diproses') {
                    $replyTitle = 'Aspirasi Sedang Diproses Sekolah 🛠️';
                    $badgeText = 'Diproses';
                    $badgeType = 'info';
                } elseif ($statusVal === 'ditolak') {
                    $replyTitle = 'Tanggapan Aspirasi: Ditolak ❌';
                    $badgeText = 'Ditolak';
                    $badgeType = 'danger';
                }

                $replyMessage = $hasAdminReply
                    ? "Admin telah membalas aspirasi '{$asp->title}': \"{$asp->admin_reply}\""
                    : "Status aspirasi '{$asp->title}' ({$asp->ticket_number}) telah diperbarui menjadi: {$statusLabel}.";

                $notifications->push([
                    'id' => 'asp-' . $asp->id . '-reply',
                    'entity_type' => 'aspiration',
                    'entity_id' => $asp->id,
                    'status_key' => $statusVal,
                    'title' => $replyTitle,
                    'message' => $replyMessage,
                    'badge' => $badgeText,
                    'badge_type' => $badgeType,
                    'link' => '/aspirasi',
                    'timestamp' => $asp->updated_at ? $asp->updated_at->toIso8601String() : $asp->created_at->toIso8601String(),
                    'created_at_human' => Carbon::parse($asp->updated_at ?? $asp->created_at)->diffForHumans(),
                ]);
            }

            // C. Notifikasi 3: Komentar dari Pihak Sekolah / Siswa Lain
            if ($asp->comments) {
                foreach ($asp->comments as $comment) {
                    if ($comment->user_id !== $user->id) {
                        $commenterName = $comment->user?->name ?? 'Pengurus Sekolah';
                        $notifications->push([
                            'id' => 'asp-' . $asp->id . '-comment-' . $comment->id,
                            'entity_type' => 'comment',
                            'entity_id' => $comment->id,
                            'status_key' => 'comment',
                            'title' => $comment->is_official_reply ? 'Tanggapan Resmi Sekolah 🏛️' : 'Komentar Baru pada Aspirasi 💬',
                            'message' => "{$commenterName} memberikan tanggapan: \"{$comment->body}\"",
                            'badge' => $comment->is_official_reply ? 'Resmi' : 'Komentar',
                            'badge_type' => 'info',
                            'link' => '/aspirasi',
                            'timestamp' => $comment->created_at->toIso8601String(),
                            'created_at_human' => $comment->created_at->diffForHumans(),
                        ]);
                    }
                }
            }
        }

        // ============================================================
        // 2. NOTIFIKASI KLAIM BARANG SISWA
        // ============================================================
        $claims = Claim::with('item')
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->take(15)
            ->get();

        foreach ($claims as $claim) {
            $itemTitle = $claim->item?->title ?? 'Barang Temuan';

            // A. Notifikasi Pengajuan Klaim Terkirim
            $notifications->push([
                'id' => 'claim-' . $claim->id . '-submitted',
                'entity_type' => 'claim',
                'entity_id' => $claim->id,
                'status_key' => 'submitted',
                'title' => 'Pengajuan Klaim Terkirim ⏳',
                'message' => "Pengajuan klaim Anda untuk '{$itemTitle}' ({$claim->claim_number}) berhasil masuk ke server dan sedang menunggu verifikasi petugas piket.",
                'badge' => 'Menunggu Verifikasi',
                'badge_type' => 'warning',
                'link' => '/lost-found',
                'timestamp' => $claim->created_at->toIso8601String(),
                'created_at_human' => $claim->created_at->diffForHumans(),
            ]);

            // B. Notifikasi Balasan Verifikasi Petugas
            if ($claim->status === 'terverifikasi') {
                $note = $claim->verification_note ? " Catatan Petugas: \"{$claim->verification_note}\"" : '';
                $notifications->push([
                    'id' => 'claim-' . $claim->id . '-decision',
                    'entity_type' => 'claim',
                    'entity_id' => $claim->id,
                    'status_key' => 'terverifikasi',
                    'title' => 'Klaim Barang Diterima! 🎉',
                    'message' => "Klaim Anda untuk '{$itemTitle}' ({$claim->claim_number}) telah diverifikasi oleh Petugas Piket. Silakan ambil barang fisik di Ruang Piket.{$note}",
                    'badge' => 'Disetujui',
                    'badge_type' => 'success',
                    'link' => '/lost-found',
                    'timestamp' => $claim->verified_at ? $claim->verified_at->toIso8601String() : $claim->updated_at->toIso8601String(),
                    'created_at_human' => Carbon::parse($claim->verified_at ?? $claim->updated_at)->diffForHumans(),
                ]);
            } elseif ($claim->status === 'ditolak') {
                $note = $claim->verification_note ? " Catatan Petugas: \"{$claim->verification_note}\"" : '';
                $notifications->push([
                    'id' => 'claim-' . $claim->id . '-decision',
                    'entity_type' => 'claim',
                    'entity_id' => $claim->id,
                    'status_key' => 'ditolak',
                    'title' => 'Klaim Barang Ditolak ⚠️',
                    'message' => "Klaim Anda untuk '{$itemTitle}' ({$claim->claim_number}) belum dapat disetujui.{$note}",
                    'badge' => 'Ditolak',
                    'badge_type' => 'danger',
                    'link' => '/lost-found',
                    'timestamp' => $claim->verified_at ? $claim->verified_at->toIso8601String() : $claim->updated_at->toIso8601String(),
                    'created_at_human' => Carbon::parse($claim->verified_at ?? $claim->updated_at)->diffForHumans(),
                ]);
            }
        }

        // ============================================================
        // 3. NOTIFIKASI LAPORAN BARANG TEMUAN/HILANG SISWA
        // ============================================================
        $items = Item::where('user_id', $user->id)
            ->whereIn('status', ['diklaim', 'selesai'])
            ->latest('updated_at')
            ->take(10)
            ->get();

        foreach ($items as $item) {
            $itemStatus = is_object($item->status) ? $item->status->value : $item->status;
            if ($itemStatus === 'selesai') {
                $notifications->push([
                    'id' => 'item-' . $item->id . '-finished',
                    'entity_type' => 'item',
                    'entity_id' => $item->id,
                    'status_key' => 'selesai',
                    'title' => 'Barang Telah Diserahterimakan 🤝',
                    'message' => "Laporan barang '{$item->title}' ({$item->ticket_number}) telah selesai diproses dan diserahterimakan kepada pemilik sah.",
                    'badge' => 'Selesai',
                    'badge_type' => 'success',
                    'link' => '/lost-found',
                    'timestamp' => $item->updated_at->toIso8601String(),
                    'created_at_human' => $item->updated_at->diffForHumans(),
                ]);
            }
        }

            // Urutkan seluruh notifikasi berdasarkan waktu terbaru
            $sorted = $notifications->sortByDesc('timestamp')->values();

            return [
                'unread_count' => $sorted->count(),
                'notifications' => $sorted,
            ];
        });

        return response()->json([
            'status' => 'success',
            'unread_count' => $result['unread_count'],
            'notifications' => $result['notifications'],
        ]);
    }
}
