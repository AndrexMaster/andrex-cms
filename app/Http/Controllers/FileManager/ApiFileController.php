<?php

namespace App\Http\Controllers\FileManager;

use App\Http\Controllers\Modules\FileManager\DB;
use App\Http\Controllers\Modules\FileManager\Str;
use App\Models\FileManager\FileManagerDirectory;
use App\Models\FileManager\FileManagerFile;
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
        $uploadedFilesData = [];
        $directoryId = $request->input('directory_id');

        $parentDirectory = FileManagerDirectory::find($directoryId);

        if (!$parentDirectory) {
            return response()->json(['message' => 'Родительская директория не найдена.'], 404);
        }

        $storagePath = $parentDirectory->path;

        dd($storagePath);

        DB::beginTransaction();

        try {
            // Проходимся по каждому загруженному файлу
            foreach ($request->file('files') as $file) {
                // Генерируем уникальное имя файла для хранения (например, UUID + расширение)
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $fileName = Str::uuid() . '.' . $extension; // Используем Str::uuid() для уникальности

                // Сохраняем файл на диске
                // Storage::disk('public')->putFileAs('uploads/files', $file, $fileName);
                // Или используем метод storeAs, который возвращает путь:
                $filePath = Storage::disk('public')->putFileAs($storagePath, $file, $fileName);

                // Создаем запись о файле в базе данных
                $fileManagerFile = FileManagerFile::create([
                    'name' => $originalName, // Сохраняем оригинальное имя файла
                    'path' => $filePath,       // Путь к файлу на диске
                    'url' => Storage::disk('public')->url($filePath), // Публичный URL для доступа
                    'directory_id' => $directoryId,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(), // Размер файла в байтах
                    // 'user_id' => auth()->id(), // Если файлы привязаны к пользователю
                ]);

                $uploadedFilesData[] = $fileManagerFile; // Добавляем созданный объект в список
            }

            DB::commit(); // Если все прошло успешно, фиксируем транзакцию

            // Возвращаем данные о загруженных файлах
            return response()->json([
                'message' => 'Файлы успешно загружены.',
                'uploadedFiles' => $uploadedFilesData,
                // Возможно, также верните обновленную родительскую директорию,
                // если ее состояние (например, количество файлов) изменилось
                // 'parent_dir' => $parentDirectory->fresh(),
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack(); // В случае ошибки откатываем транзакцию (удаляем записи, если созданы)

            // Если файлы были сохранены до ошибки в БД, их нужно удалить вручную
            foreach ($uploadedFilesData as $uploadedFile) {
                if (Storage::disk('public')->exists($uploadedFile->path)) {
                    Storage::disk('public')->delete($uploadedFile->path);
                }
            }

            return response()->json([
                'message' => 'Ошибка при загрузке файлов: ' . $e->getMessage(),
                'error' => $e->getMessage(),
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
