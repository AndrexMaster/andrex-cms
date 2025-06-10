<?php

namespace App\Models\Modules\FileManager;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

    public function parent()
    {
        return $this->belongsTo(FileManagerDirectory::class, 'parent_id', 'id');
    }

    public function children()
    {
        return $this->hasMany(FileManagerDirectory::class, 'parent_id');
    }

    public function files()
    {
        return $this->hasMany(FileManagerFile::class, 'directory_id');
    }
}
