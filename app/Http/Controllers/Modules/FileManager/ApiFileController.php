<?php

namespace App\Http\Controllers\Modules\FileManager;

use App\Models\Modules\FileManager\FileManagerDirectory;
use App\Models\Modules\FileManager\FileManagerFile;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ApiFileController
{

    public function show($id): JsonResponse
    {
        try {
            $file = FileManagerFile::query()->findOrFail($id)->first();
            return response()->json(['file' => $file]);

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

    public function upload(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'directory_id' => ['nullable', 'string', 'exists:file_manager_directories,id'],
                'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'


                // TODO: author_id & last_modified_by
                // 'author_id' => ['nullable', 'uuid', 'exists:users,id'],
                // 'last_modified_by' => ['nullable', 'uuid', 'exists:users,id'],
            ]);

            $uploadedFile = $request->file('file');
            $name = $validatedData['name']; // Это display name для БД
            $directoryId = $validatedData['directory_id'] ?? null;

            $fileNameOnDisk = $uploadedFile->hashName('uploads');
            $path = $uploadedFile->storeAs('uploads', $fileNameOnDisk, 'public');

            $newFile = FileManagerFile::query()->create([
                'name' => $name,
                'directory_id' => $directoryId,
                'path' => $path,
                'url' => Storage::url($path),
                'size' => $uploadedFile->getSize(),
                'mime_type' => $uploadedFile->getMimeType(),
            ]);

            return response()->json([
                'message' => 'Файл успешно загружен!',
                'file' => $newFile
            ], 200);

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
