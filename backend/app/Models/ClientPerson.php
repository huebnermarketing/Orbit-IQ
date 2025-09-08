<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ClientPerson extends Model
{
    use HasFactory;

    protected $table = 'client_persons';

    protected $fillable = [
        'client_id',
        'name',
        'email',
        'phone',
        'password_setup_token',
        'password_setup_expires_at',
        'status',
        'user_id',
    ];

    protected $casts = [
        'password_setup_expires_at' => 'datetime',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        // When a client person is updated, sync the user's is_active status
        static::updated(function ($clientPerson) {
            if ($clientPerson->isDirty('status') && $clientPerson->user_id) {
                $user = $clientPerson->user;
                if ($user) {
                    $user->update([
                        'is_active' => $clientPerson->status === 'active'
                    ]);
                }
            }
        });
    }

    /**
     * Get the client that owns the client person.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the user associated with this client person.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a password setup token.
     */
    public function generatePasswordSetupToken(): string
    {
        $token = Str::random(64);
        $this->update([
            'password_setup_token' => $token,
            'password_setup_expires_at' => now()->addHours(24), // Token expires in 24 hours
        ]);
        return $token;
    }

    /**
     * Check if the password setup token is valid.
     */
    public function isPasswordSetupTokenValid(): bool
    {
        return $this->password_setup_token && 
               $this->password_setup_expires_at && 
               $this->password_setup_expires_at->isFuture();
    }

    /**
     * Mark the client person as active and link to user.
     */
    public function markAsActive(User $user): void
    {
        $this->update([
            'status' => 'active',
            'user_id' => $user->id,
            'password_setup_token' => null,
            'password_setup_expires_at' => null,
        ]);
    }

    /**
     * Scope to get pending invitations.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get active client persons.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get inactive client persons.
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }
}