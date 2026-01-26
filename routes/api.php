<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('admin')->group(function () {
        require __DIR__ . '/admin/FileManager/FileManagerApi.php';
        require __DIR__ . '/admin/ProductApi.php';
    });
});
