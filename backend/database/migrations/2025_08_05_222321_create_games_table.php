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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // single, jodi, panna, etc.
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->string('result')->nullable();
            $table->enum('status', ['upcoming', 'active', 'completed', 'cancelled'])->default('upcoming');
            $table->decimal('min_bet', 10, 2)->default(10.00);
            $table->decimal('max_bet', 10, 2)->default(10000.00);
            $table->json('odds')->nullable(); // Store odds for different bet types
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
