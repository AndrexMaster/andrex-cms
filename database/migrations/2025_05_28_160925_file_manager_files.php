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
        Schema::create('file_manager_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('directory_id')->nullable()->constrained('file_manager_directories');
            $table->string('name');
            $table->integer('size');
            $table->string('path');
            $table->string('url');
            $table->string('mime_type');

            //TODO: update migration to connect user
//            $table->foreignUuid('author_id')->constrained('admin_users');
//            $table->foreignUuid('last_modified_by')->constrained('admin_users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_manager_files');
    }
};
