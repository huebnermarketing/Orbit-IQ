<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'email',
        'phone',
        'website',
        'address',
        'primary_account_manager_id',
        'client_type',
        'is_active',
        'logo_url',
        'logo_fetched_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the primary account manager for this client.
     */
    public function primaryAccountManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'primary_account_manager_id');
    }

    /**
     * Get the secondary account managers for this client.
     */
    public function secondaryAccountManagers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'client_secondary_account_managers')
                    ->withTimestamps();
    }

    /**
     * Get the client persons for this client.
     */
    public function clientPersons(): HasMany
    {
        return $this->hasMany(ClientPerson::class);
    }

    /**
     * Get all account managers (primary + secondary) for this client.
     */
    public function getAllAccountManagers()
    {
        $managers = collect();
        
        if ($this->primaryAccountManager) {
            $managers->push($this->primaryAccountManager);
        }
        
        $managers = $managers->merge($this->secondaryAccountManagers);
        
        return $managers->unique('id');
    }

    /**
     * Scope to get only active clients.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the sub-clients for this client.
     */
    public function subClients(): HasMany
    {
        return $this->hasMany(SubClient::class);
    }

    /**
     * Scope to get clients by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('client_type', $type);
    }
}