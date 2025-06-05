<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('file_manager_directories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->uuid('parent_id')->nullable();
            $table->unique(['parent_id', 'name']);
            $table->timestamps();
        });

        Schema::table('file_manager_directories', function (Blueprint $table) {
            $table->foreign('parent_id')
            ->references('id')
            ->on('file_manager_directories')
            ->onDelete('set null');
        });

        DB::table('file_manager_directories')->insert([
            'id' => Str::uuid(),
            'name' => 'root',
            'parent_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_manager_directories');
    }
};
