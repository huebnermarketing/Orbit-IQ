<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            if (!Schema::hasColumn('teams', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('teams', 'color')) {
                $table->string('color', 7)->default('#3B82F6');
            }
            if (!Schema::hasColumn('teams', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
            if (!Schema::hasColumn('teams', 'sort_order')) {
                $table->integer('sort_order')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn(['description', 'color', 'is_active', 'sort_order']);
        });
    }
};