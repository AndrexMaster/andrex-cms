<?php

namespace App\Http\Controllers\Modules\FileManager;

use App\Models\Modules\FileManager\FileManagerDirectory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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
            $bigTreeDirectory = FileManagerDirectory::query()
                ->findOrFail($id)
                ->with(['parent'])
                ->with([
                    'children.children',
                    'children.files',
                    'files'
                ])
            ->first();

            $directory = FileManagerDirectory::query()->findOrFail($id);
            return response()->json([
                'current_directory' => $directory,
                'big_tree_directory' => $bigTreeDirectory,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации входящих данных.',
                'errors' => $e->errors()
            ], 422);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Директория не найдена.'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Произошла непредвиденная ошибка: ' . $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'parent_id' => ['nullable', 'uuid', 'exists:file_manager_directories,id'],
            ]);

            $name = $validatedData['name'];
            $parentId = $validatedData['parent_id'] ?? null;

            $existingDirectory = FileManagerDirectory::where('name', $name)
                ->where(function ($query) use ($parentId) {
                    if ($parentId === null) {
                        $query->whereNull('parent_id');
                    } else {
                        $query->where('parent_id', $parentId);
                    }
                })
                ->first();

            if ($existingDirectory) {
                return response()->json([
                    'message' => 'Директория с таким именем уже существует в этой папке.'
                ], 409);
            }

            // 3. Создание директории (UUID геерируется в модели в boot() методе)
            $directory = FileManagerDirectory::create([
                'name' => $name,
                'parent_id' => $parentId,
            ]);

            return response()->json([
                'message' => 'Директория успешно создана.',
                'directory' => $directory
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации входящих данных.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Произошла непредвиденная ошибка при создании директории: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Изменить директорию.
     *
     * @param  Request  $request
     * @param  FileManagerDirectory  $directory  (Используем Route Model Binding)
     * @return JsonResponse
     */

    //TODO: Узнать за Route Model Binding
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

            $newName = $validatedData['name'];
            $newParentId = $validatedData['parent_id'] ?? null;

            if ($newName !== $directory->name || $newParentId !== $directory->parent_id) {
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
                        'message' => 'Директория с таким именем уже существует в выбранной родительской папке.'
                    ], 409);
                }
            }

            $directory->name = $newName;
            $directory->parent_id = $newParentId;
            $directory->save();

            return response()->json([
                'message' => 'Директория успешно обновлена.',
                'directory' => $directory
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации входящих данных.',
                'errors' => $e->errors()
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Директория не найдена.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Произошла непредвиденная ошибка при обновлении директории: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Удалить одну или несколько директорий.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['uuid', 'exists:file_manager_directories,id'],
            ]);

            $directoryIds = $validatedData['ids'];

            $deletedCount = FileManagerDirectory::query()->whereIn('id', $directoryIds)->delete();

            return response()->json([
                'message' => "Удалено {$deletedCount} директорий.",
                'deleted_ids' => $directoryIds
            ], 204);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации входящих данных.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Произошла непредвиденная ошибка при удалении директорий: ' . $e->getMessage()
            ], 500);
        }
    }
}
