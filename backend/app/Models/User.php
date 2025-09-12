<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'timezone',
        'theme_preference',
        'is_active',
        'email_verified_at',
        'mfa_enabled',
        'mfa_secret',
        'mfa_backup_codes',
        'organization_role_id',
        'assigned_pm_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'mfa_secret',
        'mfa_backup_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'mfa_enabled' => 'boolean',
            'is_active' => 'boolean',
            'mfa_backup_codes' => 'array',
        ];
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        // When a user's is_active status is updated, sync the client person status
        static::updated(function ($user) {
            if ($user->isDirty('is_active')) {
                $clientPerson = \App\Models\ClientPerson::where('user_id', $user->id)->first();
                if ($clientPerson) {
                    $clientPerson->update([
                        'status' => $user->is_active ? 'active' : 'inactive'
                    ]);
                }
            }
        });
    }

    /**
     * Check if user is a super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /**
     * Check if user is an admin (super admin or admin)
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin']);
    }

    /**
     * Check if user is a regular user
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Check if user can manage other users
     */
    public function canManageUsers(): bool
    {
        return $this->isAdmin();
    }

    /**
     * Check if user can manage super admins
     */
    public function canManageSuperAdmins(): bool
    {
        return $this->isSuperAdmin();
    }

    /**
     * Get the organization role that belongs to the user (legacy single role)
     */
    public function organizationRole(): BelongsTo
    {
        return $this->belongsTo(OrganizationRole::class);
    }

    /**
     * Get the organization roles that belong to the user (multiple roles)
     */
    public function organizationRoles(): BelongsToMany
    {
        return $this->belongsToMany(OrganizationRole::class, 'user_organization_roles');
    }

    /**
     * Get the AMs assigned to this PM
     */
    public function assignedAMs(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pm_am_assignments', 'pm_user_id', 'am_user_id');
    }

    /**
     * Get the PMs that have assigned this AM
     */
    public function assignedPMs(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pm_am_assignments', 'am_user_id', 'pm_user_id');
    }

    /**
     * Get the assigned PM for this AM user
     */
    public function assignedPM(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_pm_id');
    }

    /**
     * Check if user has a specific organization role
     */
    public function hasOrganizationRole($roleName): bool
    {
        return $this->organizationRoles()->where('name', $roleName)->exists();
    }

    /**
     * Check if user is a PM
     */
    public function isPM(): bool
    {
        return $this->hasOrganizationRole('PM');
    }

    /**
     * Check if user is an AM
     */
    public function isAM(): bool
    {
        return $this->hasOrganizationRole('AM');
    }

    /**
     * Get the teams that the user belongs to
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Get the user groups that the user belongs to
     */
    public function userGroups(): BelongsToMany
    {
        return $this->belongsToMany(UserGroup::class, 'user_group_members')
                    ->withTimestamps();
    }

    /**
     * Get the clients where this user is the primary account manager
     */
    public function primaryManagedClients(): HasMany
    {
        return $this->hasMany(Client::class, 'primary_account_manager_id');
    }

    /**
     * Get the clients where this user is a secondary account manager
     */
    public function secondaryManagedClients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class, 'client_secondary_account_managers')
                    ->withTimestamps();
    }

    /**
     * Get all clients managed by this user (primary + secondary)
     */
    public function getAllManagedClients()
    {
        $clients = collect();
        
        $clients = $clients->merge($this->primaryManagedClients);
        $clients = $clients->merge($this->secondaryManagedClients);
        
        return $clients->unique('id');
    }

    /**
     * Get the client person record associated with this user.
     */
    public function clientPerson(): HasOne
    {
        return $this->hasOne(ClientPerson::class);
    }
}
