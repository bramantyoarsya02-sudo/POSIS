<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\AspirationController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\ItemModerationController;
use App\Http\Controllers\Api\Admin\AdminStudentController;
use App\Http\Controllers\Api\Admin\AdminItemController;
use App\Http\Controllers\Api\Admin\AdminAspirationController;
use App\Http\Controllers\Api\Admin\AdminFaqController;

use App\Http\Controllers\Api\Admin\AdminClaimController;
use App\Http\Controllers\Api\Admin\AdminCommentController;

/*
|--------------------------------------------------------------------------
| POSIS API Routes
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

// Statistics
Route::get('/stats', StatsController::class);

// FAQs (Public Browse)
Route::get('/faqs', [AdminFaqController::class, 'index']);

// Lost & Found Items (Public Browse, Report & Claim)
Route::get('/items', [ItemController::class, 'index']);
Route::get('/items/{id}', [ItemController::class, 'show']);
Route::post('/items', [ItemController::class, 'store']);
Route::post('/items/{id}/claim', [ItemController::class, 'claim']);

// Aspirations (Public Browse, Submission, Vote & Comment)
Route::get('/aspirations', [AspirationController::class, 'index']);
Route::get('/aspirations/{id}', [AspirationController::class, 'show']);
Route::post('/aspirations', [AspirationController::class, 'store']);
Route::post('/aspirations/{id}/vote', [AspirationController::class, 'vote']);
Route::post('/aspirations/{id}/comment', [AspirationController::class, 'comment']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Current User Profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/user', [AuthController::class, 'me']);
    // Notifications (Lonceng Notifikasi Siswa & Warga Sekolah)
    Route::get('/notifications', [NotificationController::class, 'index']);

    // Admin / OSIS Management Routes (Wajib Autentikasi dan Peran Admin)
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/moderation/items', [ItemModerationController::class, 'index']);
        Route::patch('/moderation/items/{id}', [ItemModerationController::class, 'update']);
        Route::post('/moderation/items/{id}', [ItemModerationController::class, 'update']);

        // Kelola Siswa
        Route::get('/students', [AdminStudentController::class, 'index']);
        Route::patch('/students/{id}/toggle-active', [AdminStudentController::class, 'toggleActive']);
        Route::post('/students/{id}/reset-password', [AdminStudentController::class, 'resetPassword']);
        Route::delete('/students/{id}', [AdminStudentController::class, 'destroy']);

        // Kelola Lost & Found
        Route::get('/items', [AdminItemController::class, 'index']);
        Route::patch('/items/{id}/status', [AdminItemController::class, 'updateStatus']);
        Route::delete('/items/{id}', [AdminItemController::class, 'destroy']);

        // Kelola Klaim Barang
        Route::get('/claims', [AdminClaimController::class, 'index']);
        Route::patch('/claims/{id}/verify', [AdminClaimController::class, 'verify']);
        Route::patch('/claims/{id}/reject', [AdminClaimController::class, 'reject']);
        Route::delete('/claims/{id}', [AdminClaimController::class, 'destroy']);

        // Kelola Aspirasi
        Route::get('/aspirations', [AdminAspirationController::class, 'index']);
        Route::patch('/aspirations/{id}/status', [AdminAspirationController::class, 'updateStatus']);
        Route::delete('/aspirations/{id}', [AdminAspirationController::class, 'destroy']);

        // Kelola Komentar Aspirasi
        Route::get('/comments', [AdminCommentController::class, 'index']);
        Route::delete('/comments/{id}', [AdminCommentController::class, 'destroy']);

        // Kelola Panduan & FAQ
        Route::get('/faqs', [AdminFaqController::class, 'index']);
        Route::post('/faqs', [AdminFaqController::class, 'store']);
        Route::put('/faqs/{id}', [AdminFaqController::class, 'update']);
        Route::delete('/faqs/{id}', [AdminFaqController::class, 'destroy']);
    });
});
