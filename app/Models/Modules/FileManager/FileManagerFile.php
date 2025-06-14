<?php

namespace App\Models\Modules\FileManager;

use App\Models\Category;
use App\Models\ProductCharacteristic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class FileManagerFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path',
        'url',
        'mime_type',
        'directory_id',
        'size',
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
