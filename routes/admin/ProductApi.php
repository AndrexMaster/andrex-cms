<?php


use App\Http\Controllers\Api\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::post('products', [ProductController::class, 'create'])->name('products');
Route::get('products/{slug}', [ProductController::class, 'show'])->name('products.show');
