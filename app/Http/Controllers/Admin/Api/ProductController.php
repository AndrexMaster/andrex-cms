<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController
{
    public function show(Product $product): JsonResponse
    {
        $product = Product::with([
            'category'
        ])->where('parent_id', null)->get();
        return response()->json(['product' => $product]);
    }

    public function create(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['string', 'string'],
        ]);

        $product = Product::query()->create([
            'title' => $request->input('title'),
            'slug' => $request->input('slug'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'category_id' => $request->input('category_id'),
        ]);

        $product->save();
        return response()->json(['product' => $product]);
    }
}