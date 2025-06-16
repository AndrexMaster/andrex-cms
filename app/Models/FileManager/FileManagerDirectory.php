<?php

namespace App\Models\FileManager;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property string $name
 * @property Str::uuid $parent_id
 * @property string $path
 * @property FileManagerDirectory[] $children
 * @property FileManagerFile[] $files
 */

class FileManagerDirectory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_id',
        'path',
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(FileManagerDirectory::class, 'parent_id', 'id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(FileManagerDirectory::class, 'parent_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(FileManagerFile::class, 'directory_id');
    }
}
