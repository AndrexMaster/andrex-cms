<?php

use App\Http\Controllers\Web\CategoryController;
use App\Http\Controllers\Web\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


//Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
Route::prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // Products
    Route::get('products', [ProductController::class, 'index'])->name('products');
    Route::get('products/new', [ProductController::class, 'new'])->name('products.new');
    Route::get('products/{slug}', [ProductController::class, 'show'])->name('products.show');

    // Categories
    Route::get('categories', [CategoryController::class, 'index'])->name('categories');
    Route::get('categories/new', [CategoryController::class, 'new'])->name('products.new');
    Route::get('categories/{slug}', [CategoryController::class, 'show'])->name('products.show');

    // Pages
    Route::get('pages', function () {
        return Inertia::render('admin/pages');
    })->name('pages');

    // Promotions
    Route::get('promotions', function () {
        return Inertia::render('admin/promotions');
    })->name('promotions');
});

require __DIR__.'/settings.php';

// Modules
require __DIR__ . '/FileManager/FileManagerApi.php';
require __DIR__ . '/FileManager/FileManagerWeb.php';
