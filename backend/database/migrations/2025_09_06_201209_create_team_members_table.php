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
        // Check if team_members table exists, if not create it
        if (!Schema::hasTable('team_members')) {
            Schema::create('team_members', function (Blueprint $table) {
                $table->id();
                $table->foreignId('team_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('role')->default('member'); // member, lead, etc.
                $table->timestamps();
                
                // Ensure a user can't be in the same team twice
                $table->unique(['team_id', 'user_id']);
            });
        } else {
            // Table exists, just add missing columns if they don't exist
            Schema::table('team_members', function (Blueprint $table) {
                if (!Schema::hasColumn('team_members', 'role')) {
                    $table->string('role')->default('member')->after('user_id');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};