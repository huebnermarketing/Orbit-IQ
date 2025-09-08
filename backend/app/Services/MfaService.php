<?php

namespace App\Services;

use App\Models\User;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Str;

class MfaService
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Generate a new MFA secret for a user
     */
    public function generateSecret(): string
    {
        return $this->google2fa->generateSecretKey();
    }

    /**
     * Generate QR code URL for Google Authenticator
     */
    public function getQrCodeUrl(User $user, string $secret): string
    {
        $companyName = config('app.name', 'Orbit IQ');
        $companyEmail = $user->email;
        
        return $this->google2fa->getQRCodeUrl(
            $companyName,
            $companyEmail,
            $secret
        );
    }

    /**
     * Verify the MFA code
     */
    public function verifyCode(User $user, string $code): bool
    {
        if (!$user->mfa_enabled || !$user->mfa_secret) {
            return false;
        }

        // Check if it's a backup code
        if ($this->verifyBackupCode($user, $code)) {
            return true;
        }

        // Verify TOTP code
        return $this->google2fa->verifyKey($user->mfa_secret, $code);
    }

    /**
     * Verify backup code
     */
    public function verifyBackupCode(User $user, string $code): bool
    {
        if (!$user->mfa_backup_codes) {
            return false;
        }

        $backupCodes = $user->mfa_backup_codes;
        $index = array_search($code, $backupCodes);

        if ($index !== false) {
            // Remove used backup code
            unset($backupCodes[$index]);
            $user->update(['mfa_backup_codes' => array_values($backupCodes)]);
            return true;
        }

        return false;
    }

    /**
     * Generate backup codes
     */
    public function generateBackupCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 10; $i++) {
            $codes[] = strtoupper(Str::random(8));
        }
        return $codes;
    }

    /**
     * Enable MFA for user
     */
    public function enableMfa(User $user, string $secret, string $verificationCode): bool
    {
        // Verify the code first
        if (!$this->google2fa->verifyKey($secret, $verificationCode)) {
            return false;
        }

        $backupCodes = $this->generateBackupCodes();

        $user->update([
            'mfa_enabled' => true,
            'mfa_secret' => $secret,
            'mfa_backup_codes' => $backupCodes,
        ]);

        return true;
    }

    /**
     * Disable MFA for user
     */
    public function disableMfa(User $user): bool
    {
        $user->update([
            'mfa_enabled' => false,
            'mfa_secret' => null,
            'mfa_backup_codes' => null,
        ]);

        return true;
    }

    /**
     * Regenerate backup codes
     */
    public function regenerateBackupCodes(User $user): array
    {
        $backupCodes = $this->generateBackupCodes();
        $user->update(['mfa_backup_codes' => $backupCodes]);
        return $backupCodes;
    }
}
