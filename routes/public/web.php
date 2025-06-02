<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('public/home');
})->name('home');

Route::get('{category}/products', function () {
    return Inertia::render('public/products');
})->name('category-products');

Route::get('promotions', function () {
    return Inertia::render('public/promotions');
})->name('promotions');

Route::get('about', function () {
    return Inertia::render('public/simple-page');
})->name('dashboard');

Route::get('contact', function () {
    return Inertia::render('public/simple-page');
})->name('contact');

require __DIR__.'/settings.php';
