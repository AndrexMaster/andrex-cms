<?php

namespace App\Http\Controllers\Modules\FileManager;

use App\Models\Modules\FileManager\FileManagerDirectory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class ApiDirController
{
    public function index(): JsonResponse
    {
        $directories = FileManagerDirectory::with([
            'files',
            'children.children',
            'children.files'
        ])->where('parent_id', null)->get();
        return response()->json($directories);
    }

    public function show($id): JsonResponse
    {
        try {
            $directory = FileManagerDirectory::with([
                'parent',
                'parent.children',
                'parent.files',
                'files',
                'children.children',
                'children.files',
            ])
                ->findOrFail($id);

            return response()->json([
                'directory' => $directory,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error for incoming data.',
                'errors' => $e->errors()
            ], 422);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Directory not found.'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a directory.
     *
     * @param  Request  $request
     * @return JsonResponse
     */

    public function create(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'parent_id' => ['required', 'uuid', 'exists:file_manager_directories,id'],
            ]);

            $name = $validatedData['name'];
            $parentId = $validatedData['parent_id'];

            $existingDirectory = FileManagerDirectory::query()
                ->where('name', $name)
                ->where('parent_id', $parentId)
                ->first();

            if ($existingDirectory) {
                return response()->json([
                    'message' => 'A directory with this name already exists in this folder.'
                ], 409);
            }

            $parentPath = config('filesystems.disks.public.root_path', 'files/'); // Base path for all files

            if ($parentId) {
                $parentDirectory = FileManagerDirectory::query()->find($parentId);
                if (!$parentDirectory) {
                    return response()->json(['message' => 'Parent directory not found.'], 404);
                }
                $parentPath = $parentDirectory->path;
            }

            if (!Str::endsWith($parentPath, '/')) {
                $parentPath .= '/';
            }
            $newDirectoryPath = $parentPath . Str::slug($name) . '/';

            if (FileManagerDirectory::query()->where('path', $newDirectoryPath)->exists()) {
                return response()->json(['message' => 'A directory with this name already exists in this location. Please try another name.'], 409);
            }

            try {
                Storage::disk('public')->makeDirectory($newDirectoryPath);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Failed to create physical directory: ' . $e->getMessage()], 500);
            }

            try {
                $directory = FileManagerDirectory::create([
                    'name' => $name,
                    'parent_id' => $parentId,
                    'path' => $newDirectoryPath,
                ]);

                return response()->json([
                    'message' => 'Directory successfully created.',
                    'directory' => $directory,
                ], 201);

            } catch (\Exception $e) {
                if (Storage::disk('public')->exists($newDirectoryPath)) {
                    Storage::disk('public')->deleteDirectory($newDirectoryPath);
                }
                return response()->json(['message' => 'Error creating directory record: ' . $e->getMessage()], 500);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error for incoming data.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred while creating the directory: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Updates a directory (and all its child elements).
     *
     * @param  Request  $request
     * @param  FileManagerDirectory  $directory  (Using Route Model Binding)
     * @return JsonResponse
     */
    public function update(Request $request, FileManagerDirectory $directory): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'parent_id' => [
                    'nullable',
                    'uuid',
                    'exists:file_manager_directories,id',
                    'not_in:' . $directory->id,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error for incoming data.',
                'errors' => $e->errors()
            ], 422);
        }

        $newName = $validatedData['name'];
        $newParentId = $validatedData['parent_id'] ?? null;

        $isNameChanged = ($newName !== $directory->name);
        $isParentChanged = ($newParentId !== $directory->parent_id);

        if ($isNameChanged || $isParentChanged) {
            $existingDirectory = FileManagerDirectory::query()
                ->where('name', $newName)
                ->where(function ($query) use ($newParentId) {
                    if ($newParentId === null) {
                        $query->whereNull('parent_id');
                    } else {
                        $query->where('parent_id', $newParentId);
                    }
                })
                ->where('id', '!=', $directory->id)
                ->first();

            if ($existingDirectory) {
                return response()->json([
                    'message' => 'A directory with this name already exists in the selected parent folder.'
                ], 409);
            }
            if ($newParentId) {
                $isDescendant = $this->isDescendant($newParentId, $directory->id);
                if ($isDescendant) {
                    return response()->json([
                        'message' => 'Cannot move a directory into its own child directory.'
                    ], 400);
                }
            }
        }

        $oldFullPathOnDisk = Storage::disk('public')->path($directory->path);
        $oldDbPath = $directory->path;

        $newParentDirectory = null;
        $newParentPath = config('filesystems.disks.public.root_path', 'file_manager/');

        if ($newParentId) {
            $newParentDirectory = FileManagerDirectory::find($newParentId);
            if (!$newParentDirectory) {
                return response()->json(['message' => 'New parent directory not found.'], 404);
            }
            $newParentPath = $newParentDirectory->path;
        }

        if (!Str::endsWith($newParentPath, '/')) {
            $newParentPath .= '/';
        }

        $pathSuffix = '';
        if ($isNameChanged) {
            $pathSuffix = Str::slug($newName) . '/';
        } else {
            $pathParts = explode('/', rtrim($directory->path, '/'));
            $pathSuffix = end($pathParts) . '/';
        }

        $newDbPath = $newParentPath . $pathSuffix;

        $pathActuallyChanged = ($newDbPath !== $oldDbPath);


        DB::beginTransaction();
        try {
            $directory->name = $newName;
            $directory->parent_id = $newParentId;
            $directory->path = $newDbPath;
            $directory->save();

            if ($pathActuallyChanged) {
                if (!Storage::disk('public')->exists($oldDbPath)) {
                    throw new \Exception("Old physical directory not found: " . $oldDbPath);
                }
                Storage::disk('public')->move($oldDbPath, $newDbPath);
            }


            if ($pathActuallyChanged) {
                $this->updateChildPaths($directory, $oldDbPath, $newDbPath);
            }

            DB::commit();

            $directory->load([
                'parent',
                'parent.children',
                'parent.files',
                'files',
                'children.children',
                'children.files',
            ]);

            return response()->json([
                'message' => 'Directory successfully updated.',
                'directory' => $directory
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            if ($pathActuallyChanged && Storage::disk('public')->exists($newDbPath) && !Storage::disk('public')->exists($oldDbPath)) {
                try {
                    Storage::disk('public')->move($newDbPath, $oldDbPath);
                } catch (\Exception $rollbackException) {
                    Log::critical("CRITICAL ERROR: Failed to rollback physical directory. Disk and DB state diverged. " .
                        "Original error: {$e->getMessage()}. Rollback error: {$rollbackException->getMessage()}. " .
                        "Directory: {$directory->id}, Old path: {$oldDbPath}, New path: {$newDbPath}");
                }
            }

            return response()->json([
                'message' => 'An unexpected error occurred while updating the directory: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Deletes one or more directories and their contents (files and subdirectories).
     *
     * @param  Request  $request
     * @param  FileManagerDirectory|null $directory  (Route Model Binding, can be null when deleting by ID)
     * @return JsonResponse
     */
    public function destroy(Request $request, ?FileManagerDirectory $directory = null): JsonResponse
    {
        try {
            $directoryIds = [];

            if ($request->has('ids')) {
                $validatedData = $request->validate([
                    'ids' => ['required', 'array'],
                    'ids.*' => ['uuid', 'exists:file_manager_directories,id'],
                ]);

                $directoryIds = $validatedData['ids'];
            } elseif ($directory !== null) {
                $directoryIds = [$directory->id];
            } else {
                return response()->json(['message' => 'No directory IDs specified for deletion.'], 400);
            }

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error for incoming data.',
                'errors' => $e->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $deletedCount = 0;
            $deletedIds = [];

            $directoriesToDelete = FileManagerDirectory::query()
                ->whereIn('id', $directoryIds)
                ->with('children', 'files')
                ->get();

            foreach ($directoriesToDelete as $directoryToDelete) {
                $this->deleteDirectoryAndContents($directoryToDelete);
                $deletedCount++;
                $deletedIds[] = $directoryToDelete->id;
            }

            DB::commit();

            return response()->json([
                'message' => "Deleted {$deletedCount} directories.",
                'deleted_ids' => $deletedIds,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error deleting directories: ' . $e->getMessage(), [
                'directory_ids' => $directoryIds,
            ]);

            return response()->json([
                'message' => 'An unexpected error occurred while deleting directories: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Returns a directory object with recursively nested parent directories.
     *
     * @param string $currentDirId ID of the current directory.
     * @return JsonResponse
     */
    public function showBreadcrumbs(string $currentDirId)
    {
        $breadcrumbs = [];
        $current = FileManagerDirectory::find($currentDirId);

        if (!$current) {
            abort(404);
        }

        while ($current) {
            array_unshift($breadcrumbs, [
                'id' => $current->id,
                'name' => $current->name,
            ]);

            $current = $current->parent;
        }

        return response()->json(['breadcrumbs' => $breadcrumbs]);
    }


    /**
     * Recursively updates the paths of child directories and files.
     *
     * @param FileManagerDirectory $parentDirectory The updated parent directory.
     * @param string $oldPrefix The old path prefix.
     * @param string $newPrefix The new path prefix.
     * @return void
     */
    protected function updateChildPaths(FileManagerDirectory $parentDirectory, string $oldPrefix, string $newPrefix): void
    {
        foreach ($parentDirectory->children as $childDirectory) {
            $oldChildPath = $childDirectory->path;
            $newChildPath = Str::replaceFirst($oldPrefix, $newPrefix, $oldChildPath);

            $childDirectory->path = $newChildPath;
            $childDirectory->save();

            $this->updateChildPaths($childDirectory, $oldChildPath, $newChildPath);
        }

        foreach ($parentDirectory->files as $file) {
            $oldFilePath = $file->path;
            $newFilePath = Str::replaceFirst($oldPrefix, $newPrefix, $oldFilePath);
            $newFileUrl = Storage::disk('public')->url($newFilePath);

            $file->path = $newFilePath;
            $file->url = $newFileUrl;
            $file->save();
        }
    }

    /**
     * Checks if $descendantId is a descendant of $ancestorId.
     *
     * @param string $descendantId ID of the potential descendant.
     * @param string $ancestorId ID of the potential ancestor.
     * @return bool
     */
    protected function isDescendant(string $descendantId, string $ancestorId): bool
    {
        $current = FileManagerDirectory::find($descendantId);
        while ($current) {
            if ($current->parent_id === $ancestorId) {
                return true;
            }
            $current = $current->parent;
        }
        return false;
    }

    /**
     * Recursively deletes a directory and all its contents (files and subdirectories) from disk and database.
     *
     * @param FileManagerDirectory $directory
     * @return void
     */
    protected function deleteDirectoryAndContents(FileManagerDirectory $directory): void
    {
        foreach ($directory->children as $childDirectory) {
            $this->deleteDirectoryAndContents($childDirectory);
        }

        foreach ($directory->files as $file) {
            if (Storage::disk('public')->exists($file->path)) {
                Storage::disk('public')->delete($file->path);
            }

            $file->delete();
        }

        if ($directory->path !== config('filesystems.disks.public.root_path', 'file_manager/')) {
            if (Storage::disk('public')->exists($directory->path)) {
                Storage::disk('public')->deleteDirectory($directory->path);
            }
        }

        $directory->delete();
    }
}
