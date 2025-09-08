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
        Schema::create('project_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['todo', 'in_progress', 'closed'])->default('todo');
            $table->string('color', 7)->default('#3B82F6'); // Hex color code
            $table->boolean('is_system_defined')->default(false); // System-defined statuses cannot be deleted
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            // Ensure unique status names within each category
            $table->unique(['category', 'name']);
            
            // Index for performance
            $table->index(['category', 'is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_statuses');
    }
};