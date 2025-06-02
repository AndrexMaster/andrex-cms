<?php

namespace App\Http\Controllers\Modules\FileManager;

use App\Http\Controllers\Controller;
use App\Models\Modules\FileManager\FileManagerDirectory;
use App\Models\Modules\FileManager\FileManagerFile;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ManagerWebController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $directories = FileManagerDirectory::query()
            ->whereNull('parent_id')
            ->with([
                'files',
                'children.children',
                'children.files'
            ])->get();
        $files = FileManagerFile::query()->whereNull('directory_id')->get();

//        return response()->json($directories);
        return Inertia::render('admin/Modules/file-manager', [
            'directories' => $directories,
            'files' => $files
        ]);
    }
}
