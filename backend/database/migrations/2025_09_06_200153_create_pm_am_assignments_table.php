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
        Schema::create('pm_am_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pm_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('am_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Ensure a PM can't have the same AM assigned twice
            $table->unique(['pm_user_id', 'am_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pm_am_assignments');
    }
};