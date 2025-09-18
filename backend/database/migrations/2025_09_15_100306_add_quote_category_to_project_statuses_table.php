<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the enum to include 'quote' category
        DB::statement("ALTER TABLE project_statuses MODIFY COLUMN category ENUM('quote', 'todo', 'in_progress', 'closed') DEFAULT 'todo'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'quote' from the enum
        DB::statement("ALTER TABLE project_statuses MODIFY COLUMN category ENUM('todo', 'in_progress', 'closed') DEFAULT 'todo'");
    }
};
