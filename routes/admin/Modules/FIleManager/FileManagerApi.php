<?php

use App\Http\Controllers\Modules\FileManager\ApiDirController;
use App\Http\Controllers\Modules\FileManager\ApiFileController;
use Illuminate\Support\Facades\Route;

//Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
Route::prefix('file-manager')->group(function () {
    Route::get('/', [ApiDirController::class, 'index'])->name('file-manager.index');
    Route::post('/', [ApiDirController::class, 'create'])->name('file-manager.create');
    Route::get('/{id}', [ApiDirController::class, 'show'])->name('file-manager.show');
    Route::put('/{directory:id}', [ApiDirController::class, 'update'])->name('file-manager.update');
    Route::delete('/{directory:id}', [ApiDirController::class, 'destroy'])->name('file-manager.destroy');
    Route::delete('/', [ApiDirController::class, 'destroy'])->name('file-manager.destroy');

    Route::prefix('file')->group(function () {
        Route::get('/{id}', [ApiFileController::class, 'show'])->name('file-manager.show');
        Route::post('/', [ApiFileController::class, 'upload'])->name('file-manager.upload');
        Route::put('/{id}', [ApiFileController::class, 'update'])->name('file-manager.update');
        Route::delete('/', [ApiFileController::class, 'destroy'])->name('file-manager.destroy');
    });

    Route::get('/breadcrumbs/{currentDirId}', [ApiDirController::class, 'showBreadcrumbs'])
        ->name('file-manager.showBreadcrumbs');
});
