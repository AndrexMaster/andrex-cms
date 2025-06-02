<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        $categories = Category::query()->latest()->paginate(15);
        return Inertia::render('admin/categories', ['categories' => $categories]);
    }

    public function show(string $id): Response
    {
        $category = Category::query()->findOrFail($id);

        return Inertia::render('admin/category', ['category' => $category]);
    }

    public function new(): Response
    {
        return Inertia::render('admin/category');
    }


}
