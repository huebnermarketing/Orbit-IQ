<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class OrganizationRole extends Model
{
    protected $fillable = [
        'name',
        'description',
        'permissions',
        'color',
        'is_active',
        'is_locked',
        'sort_order'
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_active' => 'boolean',
        'is_locked' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get users assigned to this organization role
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_organization_roles');
    }

    /**
     * Scope to get only active roles
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

    /**
     * Scope to get only locked roles
     */
    public function scopeLocked($query)
    {
        return $query->where('is_locked', true);
    }

    /**
     * Scope to get only unlocked roles
     */
    public function scopeUnlocked($query)
    {
        return $query->where('is_locked', false);
    }
}
