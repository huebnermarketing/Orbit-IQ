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
            // Drop the workspace_id foreign key constraint first
            $table->dropForeign(['workspace_id']);
            // Then drop the workspace_id column
            $table->dropColumn('workspace_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            // Add back the workspace_id column
            $table->foreignId('workspace_id')->constrained()->onDelete('cascade');
        });
    }
};
