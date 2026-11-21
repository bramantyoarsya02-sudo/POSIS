<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 32)->unique()->comment('Nomor tiket resmi misal POSIS-LF-202610-001');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['hilang', 'ditemukan'])->index();
            $table->string('title', 150);
            $table->enum('category', ['alat_tulis', 'elektronik', 'pakaian', 'berkas', 'lainnya'])->index();
            $table->string('location', 150);
            $table->date('event_date')->index();
            $table->text('description');
            $table->string('photo_path')->nullable();
            $table->enum('handover_point', ['ruang_piket', 'ruang_bk', 'pos_satpam'])->nullable();
            $table->string('service_hours', 100)->nullable();
            $table->enum('status', ['tersedia', 'diklaim', 'selesai', 'arsip'])->default('tersedia')->index();
            $table->enum('moderation_status', ['menunggu', 'disetujui', 'ditolak'])->default('menunggu')->index();
            $table->string('reject_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
