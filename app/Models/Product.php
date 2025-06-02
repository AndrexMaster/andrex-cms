<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected  $primaryKey = 'slug';
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'quantity',
        'sku',
        'is_active',
        'category_id',
        'images',
        'attributes',
    ];

    protected $casts = [
        'id' => 'uuid',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'images' => 'array',
        'attributes' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function characteristics(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductCharacteristic::class);
    }
}
