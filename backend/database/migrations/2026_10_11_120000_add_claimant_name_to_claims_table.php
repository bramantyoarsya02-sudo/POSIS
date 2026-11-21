<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('claims', 'claimant_name')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->string('claimant_name', 150)->nullable()->after('user_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('claims', 'claimant_name')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->dropColumn('claimant_name');
            });
        }
    }
};
