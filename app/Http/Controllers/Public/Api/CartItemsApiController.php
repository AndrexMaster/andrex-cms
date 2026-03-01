<?php

namespace App\Http\Controllers\Public\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItems;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartItemsApiController extends Controller
{
    public function show(Product $product): JsonResponse
    {
        $product = CartItems::with([
            'product'
        ])->where('parent_id', null)->get();
        return response()->json(['product' => $product]);
    }

    public function create(Request $request): JsonResponse
    {
//        $validatedData = $request->validate([
//            'title' => ['required', 'string'],
//            'description' => ['string', 'string'],
//        ]);

//        dd(auth()->id());

        $product = CartItems::create([
            'product_id' => $request->input('product_id'),
//            'user_id' => auth()->id(),
        ]);

        $product->save();
        return response()->json(['product' => $product]);
    }
}
