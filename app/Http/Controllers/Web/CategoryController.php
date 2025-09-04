<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = Category::query()->latest()->paginate(15);
        return Inertia::render('admin/categories', ['categories' => $categories]);
    }

    public function show(string $slug): Response
    {
        $category = Category::query()->where('slug', $slug)->firstOrFail();

        return Inertia::render('admin/category', ['category' => $category]);
    }

    public function new(): Response
    {
        return Inertia::render('admin/category');
    }

    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:512',
            'slug' => 'required|string|max:512',
            'description' => 'nullable|string|max:2048',
            'parent_id' => 'exists:categories,id',
        ]);

        $category = Category::query()->create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'],
            'parent_id' => $validated['parent_id'],
        ]);

        return Inertia::render('admin/category', ['category' => $category]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/category');
    }


}
