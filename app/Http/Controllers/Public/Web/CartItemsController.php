<?php

namespace App\Http\Controllers\Public\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\CartItems;
use Inertia\Inertia;
use Inertia\Response;

class CartItemsController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();
        if ($userId)
        {
            $products = CartItems::query()->where('user_id', $userId)
                ->with('product')
                ->paginate(15);
        } else {
            $products = CartItems::query()
                ->with('product')
                ->paginate(15);

        }

        return Inertia::render('public/cart', ['cartItems' => $products]);
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
