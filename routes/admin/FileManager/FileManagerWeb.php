<?php

use App\Http\Controllers\FileManager\ManagerWebController;
use Illuminate\Support\Facades\Route;

//Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
Route::prefix('admin')->group(function () {
    Route::get('file-manager', [ManagerWebController::class, 'index'])->name('file-manager');
});
