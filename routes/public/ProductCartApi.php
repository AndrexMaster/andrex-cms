<?php

use App\Http\Controllers\Public\Api\CartItemsApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\ProductController;

Route::prefix('cart')->group(function () {
    Route::post('/', [CartItemsApiController::class, 'create'])->name('cart.create');
    Route::get('{slug}', [CartItemsApiController::class, 'show'])->name('cart.show');
});



