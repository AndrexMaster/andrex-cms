<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function() {
    require __DIR__.'/admin/web.php';
    require __DIR__.'/auth.php';
});
require __DIR__.'/public/web.php';

