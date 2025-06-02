<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CharacteristicKey extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', // Например: 'Частота процессора', 'Объем ОЗУ'
        // ...
    ];

    /**
     * Get the product characteristics for the characteristic key.
     */
    public function productCharacteristics(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductCharacteristic::class);
    }
}
