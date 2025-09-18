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
        Schema::table('projects', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['workspace_id']);
            $table->dropForeign(['owner_id']);
            
            // Remove old columns that don't fit our new structure
            $table->dropColumn(['avatar', 'workspace_id', 'owner_id', 'status']);
        });
        
        Schema::table('projects', function (Blueprint $table) {
            // Add new columns for project management
            $table->string('project_number', 6)->unique()->after('name');
            $table->foreignId('client_id')->constrained()->onDelete('cascade')->after('project_number');
            $table->foreignId('sub_client_id')->nullable()->constrained()->onDelete('set null')->after('client_id');
            $table->string('funding_source')->after('sub_client_id'); // fixed, hourly
            $table->string('hour_type')->after('funding_source'); // billable, non-billable
            $table->foreignId('am_id')->nullable()->constrained('users')->onDelete('set null')->after('hour_type'); // Account Manager
            $table->foreignId('pm_id')->nullable()->constrained('users')->onDelete('set null')->after('am_id'); // Project Manager
            $table->foreignId('project_type_id')->nullable()->constrained()->onDelete('set null')->after('pm_id');
            $table->foreignId('project_status_id')->nullable()->constrained()->onDelete('set null')->after('project_type_id');
            $table->json('internal_team')->nullable()->after('project_status_id'); // Array of user IDs
            $table->json('client_team')->nullable()->after('internal_team'); // Array of client person IDs
            $table->json('user_groups')->nullable()->after('client_team'); // Array of user group IDs
            $table->json('teams')->nullable()->after('user_groups'); // Array of team IDs
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Drop new columns
            $table->dropColumn([
                'project_number',
                'client_id',
                'sub_client_id',
                'funding_source',
                'hour_type',
                'am_id',
                'pm_id',
                'project_type_id',
                'project_status_id',
                'internal_team',
                'client_team',
                'user_groups',
                'teams'
            ]);
            
            // Restore old columns
            $table->string('avatar')->nullable();
            $table->foreignId('workspace_id')->nullable();
            $table->foreignId('owner_id')->nullable();
            $table->string('status')->default('active');
        });
    }
};
