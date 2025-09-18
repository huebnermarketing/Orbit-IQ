<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'name',
        'project_number',
        'job_code',
        'description',
        'client_id',
        'sub_client_id',
        'funding_source',
        'hour_type',
        'am_id',
        'pm_id',
        'project_type_id',
        'project_status_id',
        'start_date',
        'due_date',
        'internal_team',
        'client_team',
        'user_groups',
        'teams',
        'color',
    ];

    protected $casts = [
        'internal_team' => 'array',
        'client_team' => 'array',
        'user_groups' => 'array',
        'teams' => 'array',
        'start_date' => 'date',
        'due_date' => 'date',
    ];

    /**
     * Get the client that owns the project.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the sub-client for the project.
     */
    public function subClient(): BelongsTo
    {
        return $this->belongsTo(SubClient::class);
    }

    /**
     * Get the account manager for the project.
     */
    public function accountManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'am_id');
    }

    /**
     * Get the project manager for the project.
     */
    public function projectManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pm_id');
    }

    /**
     * Get the project type.
     */
    public function projectType(): BelongsTo
    {
        return $this->belongsTo(ProjectType::class);
    }

    /**
     * Get the tasks for the project.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('sort_order');
    }

    /**
     * Get the project status.
     */
    public function projectStatus(): BelongsTo
    {
        return $this->belongsTo(ProjectStatus::class);
    }

    /**
     * Get the internal team members.
     */
    public function internalTeamMembers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_internal_team', 'project_id', 'user_id');
    }

    /**
     * Get the client team members.
     */
    public function clientTeamMembers(): BelongsToMany
    {
        return $this->belongsToMany(ClientPerson::class, 'project_client_team', 'project_id', 'client_person_id');
    }

    /**
     * Get the user groups associated with the project.
     */
    public function userGroups(): BelongsToMany
    {
        return $this->belongsToMany(UserGroup::class, 'project_user_groups', 'project_id', 'user_group_id');
    }

    /**
     * Get the teams associated with the project.
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'project_teams', 'project_id', 'team_id');
    }
}
