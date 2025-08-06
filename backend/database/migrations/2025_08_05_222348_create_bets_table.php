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
        Schema::create('bets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->string('bet_number');
            $table->decimal('bet_amount', 10, 2);
            $table->decimal('potential_payout', 10, 2);
            $table->decimal('actual_payout', 10, 2)->nullable();
            $table->enum('status', ['pending', 'won', 'lost', 'cancelled'])->default('pending');
            $table->string('bet_type'); // single, jodi, panna, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bets');
    }
};
