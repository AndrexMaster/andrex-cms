<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $products = Product::with('category')->latest()->paginate(15);

        return Inertia::render('admin/products', ['products' => $products]);
    }

    public function show(Product $product): Response
    {
        return Inertia::render('admin/product', ['product' => $product]);
    }

    public function new(): Response
    {
        return Inertia::render('admin/product');
    }
}
