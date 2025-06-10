<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
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
            $table->string('path')->unique();
            $table->uuid('parent_id')->nullable();
            $table->unique(['parent_id', 'name']);
            $table->timestamps();

            $table->index('id');
            $table->index('path');
        });

        Schema::table('file_manager_directories', function (Blueprint $table) {
            $table->foreign('parent_id')
            ->references('id')
            ->on('file_manager_directories')
            ->onDelete('cascade');
        });

        $rootPath = config('filesystems.disks.public.root_path', 'file_manager/');
        if (!Str::endsWith($rootPath, '/')) {
            $rootPath .= '/';
        }

        if (!Storage::disk('public')->exists($rootPath)) {
            Storage::disk('public')->makeDirectory($rootPath);
        }

        DB::table('file_manager_directories')->insert([
            'id' => Str::uuid(),
            'name' => 'File Manager',
            'path' => $rootPath,
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
