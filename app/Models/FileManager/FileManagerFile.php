<?php

namespace App\Models\FileManager;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @property Str::uuid $id
 * @property string $name
 * @property string $path_original
 * @property string $path_medium
 * @property string $path_thumbnail
 * @property string $url_original
 * @property string $url_medium
 * @property string $url_thumbnail
 * @property string $mime_type
 * @property string $directory_id
 * @property string $type
 * @property Str::uuid $author_id
 * @property Str::uuid $last_modified_by
 */

class FileManagerFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path_original',
        'path_medium',
        'path_thumbnail',
        'url_original',
        'url_medium',
        'url_thumbnail',
        'mime_type',
        'directory_id',
        'type',
        'author_id',
        'last_modified_by',

    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            $model->{$model->getKeyName()} = (string) Str::uuid();
        });
    }
}
