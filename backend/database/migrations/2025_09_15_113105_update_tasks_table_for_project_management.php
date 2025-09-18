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
        Schema::table('tasks', function (Blueprint $table) {
            // Rename existing columns to match our model
            $table->renameColumn('assignee_id', 'assigned_to');
            $table->renameColumn('creator_id', 'created_by');
            $table->renameColumn('parent_id', 'parent_task_id');
            $table->renameColumn('order', 'sort_order');
            
            // Add new columns
            $table->json('tags')->nullable()->after('parent_task_id');
            $table->timestamp('start_date')->nullable()->after('due_date');
            $table->integer('estimated_hours')->nullable()->after('completed_at');
            $table->integer('actual_hours')->nullable()->after('estimated_hours');
            $table->boolean('is_archived')->default(false)->after('actual_hours');
            
            // Add foreign key constraints
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('parent_task_id')->references('id')->on('tasks')->onDelete('cascade');
            
            // Add indexes
            $table->index(['project_id', 'status']);
            $table->index(['assigned_to', 'status']);
            $table->index(['parent_task_id']);
            $table->index(['due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['project_id', 'status']);
            $table->dropIndex(['assigned_to', 'status']);
            $table->dropIndex(['parent_task_id']);
            $table->dropIndex(['due_date']);
            
            // Drop foreign keys
            $table->dropForeign(['assigned_to']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['parent_task_id']);
            
            // Drop new columns
            $table->dropColumn(['tags', 'start_date', 'estimated_hours', 'actual_hours', 'is_archived']);
            
            // Rename columns back
            $table->renameColumn('assigned_to', 'assignee_id');
            $table->renameColumn('created_by', 'creator_id');
            $table->renameColumn('parent_task_id', 'parent_id');
            $table->renameColumn('sort_order', 'order');
        });
    }
};
