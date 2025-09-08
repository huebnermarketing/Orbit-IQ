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
        // Check if teams table exists, if not create it
        if (!Schema::hasTable('teams')) {
            Schema::create('teams', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('color', 7)->default('#3B82F6'); // Hex color
                $table->boolean('is_active')->default(true);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        } else {
            // Table exists, just add missing columns if they don't exist
            Schema::table('teams', function (Blueprint $table) {
                if (!Schema::hasColumn('teams', 'color')) {
                    $table->string('color', 7)->default('#3B82F6')->after('description');
                }
                if (!Schema::hasColumn('teams', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('color');
                }
                if (!Schema::hasColumn('teams', 'sort_order')) {
                    $table->integer('sort_order')->default(0)->after('is_active');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};