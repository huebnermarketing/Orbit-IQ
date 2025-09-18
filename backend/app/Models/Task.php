<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'priority',
        'project_id',
        'assigned_to',
        'created_by',
        'parent_task_id',
        'tags',
        'due_date',
        'start_date',
        'completed_at',
        'estimated_hours',
        'actual_hours',
        'sort_order',
        'is_archived',
    ];

    protected $casts = [
        'tags' => 'array',
        'due_date' => 'datetime',
        'start_date' => 'datetime',
        'completed_at' => 'datetime',
        'is_archived' => 'boolean',
        'estimated_hours' => 'integer',
        'actual_hours' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Get the project that owns the task
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user assigned to the task
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the user who created the task
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the parent task (for subtasks)
     */
    public function parentTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    /**
     * Get the subtasks of this task
     */
    public function subtasks(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_task_id')->orderBy('sort_order');
    }

    /**
     * Scope to get only non-archived tasks
     */
    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    /**
     * Scope to get tasks by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get tasks assigned to a user
     */
    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    /**
     * Scope to get tasks by priority
     */
    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Get the status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'todo' => 'gray',
            'in_progress' => 'blue',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get the priority badge color
     */
    public function getPriorityColorAttribute(): string
    {
        return match ($this->priority) {
            'low' => 'gray',
            'medium' => 'yellow',
            'high' => 'orange',
            'urgent' => 'red',
            default => 'gray',
        };
    }
}
