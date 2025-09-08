<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubClient extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'name',
        'email',
        'phone',
        'website',
    ];

    /**
     * Get the client that owns the sub-client.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}