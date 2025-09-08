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
        Schema::create('client_persons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('password_setup_token')->nullable();
            $table->timestamp('password_setup_expires_at')->nullable();
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Ensure email uniqueness within the same client company
            $table->unique(['client_id', 'email']);
            
            // Index for performance
            $table->index(['client_id', 'status']);
            $table->index('password_setup_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_persons');
    }
};