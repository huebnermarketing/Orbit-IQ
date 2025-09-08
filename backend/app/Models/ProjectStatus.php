<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'color',
        'is_system_defined',
        'is_locked',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_system_defined' => 'boolean',
        'is_locked' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the category options available
     */
    public static function getCategoryOptions(): array
    {
        return [
            'todo' => 'ToDo',
            'in_progress' => 'In Progress',
            'closed' => 'Closed',
        ];
    }

    /**
     * Get the category label for this status
     */
    public function getCategoryLabelAttribute(): string
    {
        return self::getCategoryOptions()[$this->category] ?? $this->category;
    }

    /**
     * Scope to get statuses by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to get only active statuses
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only system-defined statuses
     */
    public function scopeSystemDefined($query)
    {
        return $query->where('is_system_defined', true);
    }

    /**
     * Scope to get only user-defined statuses
     */
    public function scopeUserDefined($query)
    {
        return $query->where('is_system_defined', false);
    }

    /**
     * Scope to order by sort order and name
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Scope to order by category, then sort order, then name
     */
    public function scopeOrderedByCategory($query)
    {
        return $query->orderBy('category')
                    ->orderBy('sort_order')
                    ->orderBy('name');
    }

    /**
     * Get statuses grouped by category
     */
    public static function getGroupedByCategory()
    {
        return self::orderedByCategory()
                   ->get()
                   ->groupBy('category');
    }

    /**
     * Check if this status can be deleted
     */
    public function canBeDeleted(): bool
    {
        return !$this->is_system_defined;
    }

    /**
     * Get the next sort order for a category
     */
    public static function getNextSortOrder(string $category): int
    {
        $maxOrder = self::where('category', $category)->max('sort_order');
        return ($maxOrder ?? 0) + 1;
    }
}