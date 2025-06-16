<?php

namespace App\Http\Controllers\FileManager;

use App\Models\FileManager\FileManagerDirectory;
use App\Models\FileManager\FileManagerFile;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Facades\Image;
use Intervention\Image\ImageManager;
use Intervention\Image\Encoders\AutoEncoder;

class ApiFileController
{
    /**
     * Display a specific file.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $file = FileManagerFile::query()->findOrFail($id);
            return response()->json(['file' => $file]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'File not found.',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload one or more files to a specified directory.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'files' => 'required|array',
                'files.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,txt,mp3,mp4,zip,rar|max:20480',
                'directory_id' => 'required|uuid|exists:file_manager_directories,id',
            ], [
                'files.required' => 'At least one file is required for upload.',
                'files.*.file' => 'Each item must be a file.',
                'files.*.mimes' => 'Unsupported file format. Allowed: jpeg, png, jpg, gif, svg, pdf, doc, docx, xls, xlsx, txt, mp3, mp4, zip, rar.', // Переведено на английский
                'files.*.max' => 'File size must not exceed 20 MB.',
                'directory_id.required' => 'Directory ID is required.',
                'directory_id.uuid' => 'Invalid Directory ID format.',
                'directory_id.exists' => 'The specified directory was not found.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error for incoming data.',
                'errors' => $e->errors()
            ], 422);
        }

        $uploadedFilesData = [];
        $directoryId = $request->input('directory_id');

        $rootPath = config('filesystems.disks.public.root_path', 'files/');
        $parentDirectory = FileManagerDirectory::query()->find($directoryId);

        if (!$parentDirectory) {
            return response()->json(['message' => 'Parent directory not found.'], 404);
        }

        $storagePath = rtrim($parentDirectory->path, '/');
        $sizedImagePath = $rootPath.'images_sizes/';

        if (!Storage::disk('public')->exists($sizedImagePath)) {
            Storage::disk('public')->makeDirectory($sizedImagePath);
        }

        if (!Storage::disk('public')->exists($sizedImagePath.'thumbnails/')) {
            Storage::disk('public')->makeDirectory($sizedImagePath.'thumbnails/');
        }
        if (!Storage::disk('public')->exists($sizedImagePath.'medium/')) {
            Storage::disk('public')->makeDirectory($sizedImagePath . 'medium/');
        }

        DB::beginTransaction();

        try {
            $manager = new ImageManager(new Driver());
            foreach ($request->file('files') as $file) {
                $trimmedName = trim($file->getClientOriginalName(), '.'.$file->extension());
                $originalName = $file->getClientOriginalName();

                // TODO: the filename cannot contain any path characters, eg "/"

                $extension = $file->extension();
                $fileName = $trimmedName . '_' . Str::uuid() . '.' . $extension;

                $filePath = Storage::disk('public')->putFileAs($storagePath, $file, $fileName);

                $thumbnailPath = $sizedImagePath . "thumbnails/" . $fileName;
                $img = $manager->read($file)->cover(200, 200)->encode(new AutoEncoder(quality: 80));
                Storage::disk('public')->put($thumbnailPath, $img);

                $mediumPath = $sizedImagePath . "medium/" . $fileName;
                $img = $manager->read($file)->resize(width: 800)->encode(new AutoEncoder(quality: 80));
                Storage::disk('public')->put($mediumPath, $img);

                $fileManagerFile = FileManagerFile::query()->create([
                    'name' => $originalName,
                    'path_original' => $filePath,
                    'path_medium' => $mediumPath,
                    'path_thumbnail' => $thumbnailPath,
                    'url_original' => Storage::url($filePath),
                    'url_medium' => Storage::url($mediumPath),
                    'url_thumbnail' => Storage::url($thumbnailPath),
                    'directory_id' => $directoryId,
                    'mime_type' => $file->getMimeType(),
                    // 'user_id' => auth()->id(),
                ]);

                $uploadedFilesData[] = $fileManagerFile;
            }

            DB::commit(); // Фиксируем транзакцию

            return response()->json([
                'message' => 'Files successfully uploaded.',
                'uploadedFiles' => $uploadedFilesData,
            ]);

        } catch (\Exception $e) {
            foreach ($uploadedFilesData as $uploadedFile) {
                if (Storage::disk('public')->exists($uploadedFile->path_original)) {
                    Storage::disk('public')->delete($uploadedFile->path_original);
                }
                if (Storage::disk('public')->exists($uploadedFile->path_medium)) {
                    Storage::disk('public')->delete($uploadedFile->path_medium);
                }
                if (Storage::disk('public')->exists($uploadedFile->path_thumbnail)) {
                    Storage::disk('public')->delete($uploadedFile->path_thumbnail);
                }
            }

            Log::error('Error during file upload: ' . $e->getMessage(), ['directory_id' => $directoryId, 'uploaded_files' => $uploadedFilesData]); // Добавлено логирование ошибки

            return response()->json([
                'message' => 'An unexpected error occurred during file upload: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a file's name or move it to another directory.
     *
     * @param Request $request
     * @param FileManagerFile $file (Using Route Model Binding)
     * @return JsonResponse
     */
    public function update(Request $request, FileManagerFile $file): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'directory_id' => [
                    'required',
                    'uuid',
                    'exists:file_manager_directories,id',
                ],
            ], [
                'name.required' => 'File name is required.',
                'name.string' => 'File name must be a string.',
                'name.max' => 'File name must not exceed 255 characters.',
                'directory_id.required' => 'Directory ID is required.',
                'directory_id.uuid' => 'Invalid Directory ID format.',
                'directory_id.exists' => 'The specified directory was not found.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error for incoming data.',
                'errors' => $e->errors()
            ], 422);
        }

        $newName = $validatedData['name'];
        $newDirectoryId = $validatedData['directory_id'];

        $isNameChanged = ($newName !== $file->name);
        $isDirectoryChanged = ($newDirectoryId !== $file->directory_id);

        if ($isNameChanged || $isDirectoryChanged) {
            $existingFile = FileManagerFile::query()
                ->where('name', $newName)
                ->where('directory_id', $newDirectoryId)
                ->where('id', '!=', $file->id)
                ->first();

            if ($existingFile) {
                return response()->json([
                    'message' => 'A file with this name already exists in the selected directory.',
                ], 409);
            }
        }

        $newParentDirectory = FileManagerDirectory::query()->find($newDirectoryId);
        if (!$newParentDirectory) {
            return response()->json(['message' => 'New parent directory not found.'], 404);
        }

        $oldFilePathInDb = $file->path_original;
        $oldFileUrlInDb = $file->url_original;

        $fileExtension = pathinfo($oldFilePathInDb, PATHINFO_EXTENSION);

        $trimmedName = trim($newName, '.'.$fileExtension);

        $fileName = $trimmedName . '_' . Str::uuid() . '.' . $fileExtension;



        $newFullDiskPath = rtrim($newParentDirectory->path, '/') . '/' . $fileName;
        $newFullUrl = Storage::disk('public')->url($newFullDiskPath);

        $needsPhysicalMove = ($oldFilePathInDb !== $newFullDiskPath);

        DB::beginTransaction();

        try {
            $file->name = $newName;
            $file->directory_id = $newDirectoryId;
            $file->path_original = $newFullDiskPath;
            $file->url_original = $newFullUrl;
            $file->save();

            if ($needsPhysicalMove) {
                if (!Storage::disk('public')->exists($oldFilePathInDb)) {
                    Log::error("Old physical file not found during update: " . $oldFilePathInDb);
                    throw new \Exception("Old physical file not found: " . $oldFilePathInDb);
                }
                Storage::disk('public')->move($oldFilePathInDb, $newFullDiskPath);
            }

            DB::commit();

            return response()->json([
                'message' => 'File successfully updated.',
                'file' => $file
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            if (
                $needsPhysicalMove &&
                Storage::disk('public')->exists($newFullDiskPath) &&
                !Storage::disk('public')->exists($oldFilePathInDb)
            ) {
                try {
                    Storage::disk('public')->move($newFullDiskPath, $oldFilePathInDb);
                    Log::info(
                        "Physical file successfully rolled back after DB error: oldPath={$oldFilePathInDb}, newPath={$newFullDiskPath}"
                    );
                } catch (\Exception $rollbackException) {
                    Log::critical(
                        "CRITICAL ERROR: Failed to rollback physical file. Disk and DB state diverged. " .
                        "Original error: {$e->getMessage()}. Rollback error: {$rollbackException->getMessage()}. " .
                        "File: {$file->id}, Old path: {$oldFilePathInDb}, New path: {$newFullDiskPath}");
                }
            }
            Log::error('An unexpected error occurred during file update: ' . $e->getMessage(),
                ['file_id' => $file->id, 'request_data' => $request->all()]
            );

            return response()->json([
                'message' => 'An unexpected error occurred during file update: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Delete one or more files.
     *
     * @param Request $request
     * @param FileManagerFile|null $file (Using Route Model Binding for single delete, or null for array delete)
     * @return JsonResponse
     */
    public function destroy(Request $request, ?FileManagerFile $file = null): JsonResponse
    {
        try {
            if ($request->has('files')) {
                $validatedData = $request->validate([
                    'files' => ['required', 'array'],
                    'files.*.id' => ['uuid', 'exists:file_manager_files,id'],
                ], [
                    'files.required' => 'At least one file ID is required for deletion.',
                    'files.*.uuid' => 'Invalid file ID format.',
                    'files.*.exists' => 'One or more specified files were not found.',
                ]);
                $filesIds = $validatedData['files'];
            } elseif ($file !== null) {
                $filesIds = [$file->id];

            } else {
                return response()->json(['message' => 'No file IDs specified for deletion.'], 400);
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

            $filesToDelete = FileManagerFile::query()->whereIn('id', $filesIds)->get();

            /**
             * @var FileManagerFile[] $filesToDelete
             */
            foreach ($filesToDelete as $fileToDelete) {
                $fileToDelete->delete();

                if (Storage::disk('public')->exists($fileToDelete->path_original)) {
                    Storage::disk('public')->delete($fileToDelete->path_original);
                }

                if (Storage::disk('public')->exists($fileToDelete->path_thumbnail)) {
                    Storage::disk('public')->delete($fileToDelete->path_thumbnail);
                }

                if (Storage::disk('public')->exists($fileToDelete->path_medium)) {
                    Storage::disk('public')->delete($fileToDelete->path_medium);
                }

                $deletedIds[] = $fileToDelete->id;
                $deletedCount++;
            }

            DB::commit();

            return response()->json([
                'message' => "Deleted {$deletedCount} files.",
                'deleted_ids' => $deletedIds,
            ]);

        } catch (\Exception $e) {
            Log::critical('CRITICAL ERROR: Files were physically deleted, but DB transaction failed to rollback. Requires manual intervention. ' . // Переведено на английский
                'Error: ' . $e->getMessage(), ['file_ids' => $filesIds]);

            return response()->json([
                'message' => 'An unexpected error occurred while deleting files: ' . $e->getMessage(), // Переведено на английский
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
