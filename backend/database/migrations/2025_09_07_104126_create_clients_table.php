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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->foreignId('primary_account_manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('client_type', ['Agency', 'Direct Client'])->default('Direct Client');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('client_secondary_account_managers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Ensure a user can only be a secondary AM for a client once
            $table->unique(['client_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_secondary_account_managers');
        Schema::dropIfExists('clients');
    }
};