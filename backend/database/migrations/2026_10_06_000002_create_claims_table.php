<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->string('claim_number', 32)->unique()->comment('Nomor klaim resmi misal POSIS-CLM-202610-001');
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->comment('Siswa yang mengajukan klaim');
            $table->string('claimant_name', 150)->nullable()->comment('Nama lengkap siswa/pengklaim');
            $table->text('proof_description')->comment('Ciri-ciri khusus rahasia');
            $table->string('proof_photo_path')->nullable();
            $table->enum('status', ['menunggu', 'terverifikasi', 'ditolak'])->default('menunggu')->index();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('verification_note')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('handover_at')->nullable()->comment('Waktu serah-terima fisik dilakukan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
