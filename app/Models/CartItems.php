<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItems extends Model
{
    protected $fillable = [
        'product_id',
    ];

    protected $casts = [
        'id' => 'integer',
        'product_id' => 'integer',
        'user_id' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
