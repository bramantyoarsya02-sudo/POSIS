<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aspirations', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 32)->unique()->comment('Nomor tiket resmi misal POSIS-ASP-202610-001');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_anonymous')->default(false)->index();
            $table->enum('category', ['toilet', 'perpustakaan', 'lapangan', 'wifi', 'kantin', 'lainnya'])->index();
            $table->string('title', 150);
            $table->text('body');
            $table->string('photo_path')->nullable();
            $table->boolean('is_emergency')->default(false)->index()->comment('Jalur fasilitas darurat / berbahaya');
            $table->enum('status', ['menunggu_review', 'diproses', 'ditindaklanjuti', 'ditolak'])->default('menunggu_review')->index();
            $table->date('due_date')->comment('Target penyelesaian SLA 7 hari kerja');
            $table->text('admin_reply')->nullable()->comment('Jawaban dan tindakan resmi sekolah');
            $table->string('reject_reason')->nullable();
            $table->unsignedInteger('upvotes_count')->default(0)->index();
            $table->unsignedInteger('comments_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aspirations');
    }
};
