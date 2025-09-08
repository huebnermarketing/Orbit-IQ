<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'is_active',
        'sort_order',
        'owner_id'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    /**
     * Get the team owner
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the users that belong to the team
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Get the team leads
     */
    public function leads(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
                    ->wherePivot('role', 'lead')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Get the team members (non-leads)
     */
    public function regularMembers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
                    ->wherePivot('role', 'member')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Scope for active teams
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered teams
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}