<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('submission_date');
            $table->unsignedTinyInteger('count')->default(1);
            $table->timestamps();

            $table->unique(['user_id', 'submission_date'], 'unique_user_daily_submission');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_submissions');
    }
};
