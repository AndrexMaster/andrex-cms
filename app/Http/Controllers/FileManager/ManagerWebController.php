<?php

namespace App\Http\Controllers\FileManager;

use App\Http\Controllers\Controller;
use App\Models\FileManager\FileManagerDirectory;
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
//        phpinfo();
        $directory = FileManagerDirectory::query()
            ->whereNull('parent_id')
            ->with([
                'files',
                'children.children',
                'children.files'
            ])->first();

//        return response()->json($directories);
        return Inertia::render('admin/file-manager', [
            'directory' => $directory,
        ]);
    }
}
