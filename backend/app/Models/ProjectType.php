<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'sort_order',
        'is_active',
        'is_system_defined'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_system_defined' => 'boolean',
        'sort_order' => 'integer'
    ];

    /**
     * Scope to get active project types
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}