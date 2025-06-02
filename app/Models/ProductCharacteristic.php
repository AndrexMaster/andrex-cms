<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCharacteristic extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_characteristics';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'characteristic_key_id',
        'position',
        'value',
    ];

    /**
     * Get the product that owns the characteristic.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the characteristic key associated with the product characteristic.
     */
    public function characteristicKey()
    {
        return $this->belongsTo(CharacteristicKey::class);
    }
}
