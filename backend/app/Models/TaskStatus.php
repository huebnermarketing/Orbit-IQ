<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskStatus extends Model
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

    // Available categories
    const CATEGORIES = [
        'todo' => 'ToDo',
        'in_progress' => 'In Progress',
        'done' => 'Done'
    ];

    /**
     * Get the category name attribute.
     */
    public function getCategoryNameAttribute()
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }

    /**
     * Scope a query to only include statuses of a given category.
     */
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include system-defined statuses.
     */
    public function scopeSystemDefined($query)
    {
        return $query->where('is_system_defined', true);
    }

    /**
     * Scope a query to only include user-defined statuses.
     */
    public function scopeUserDefined($query)
    {
        return $query->where('is_system_defined', false);
    }

    /**
     * Scope a query to only include active statuses.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Scope a query to order by category and sort order.
     */
    public function scopeOrderedByCategory($query)
    {
        return $query->orderByRaw("FIELD(category, 'todo', 'in_progress', 'done')")
                    ->orderBy('sort_order')
                    ->orderBy('name');
    }

    /**
     * Get all statuses grouped by category.
     */
    public static function getGroupedByCategory()
    {
        return self::orderedByCategory()
                   ->get()
                   ->groupBy('category');
    }

    /**
     * Get category options for dropdown.
     */
    public static function getCategoryOptions()
    {
        return collect(self::CATEGORIES)->map(function ($name, $value) {
            return ['value' => $value, 'label' => $name];
        })->values();
    }
}