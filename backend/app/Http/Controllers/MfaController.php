<?php

namespace App\Http\Controllers;

use App\Services\MfaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MfaController extends Controller
{
    protected $mfaService;

    public function __construct(MfaService $mfaService)
    {
        $this->mfaService = $mfaService;
    }

    /**
     * Generate MFA setup data
     */
    public function setup(Request $request)
    {
        $user = $request->user();
        
        if ($user->mfa_enabled) {
            return response()->json([
                'message' => 'MFA is already enabled'
            ], 400);
        }

        $secret = $this->mfaService->generateSecret();
        $qrCodeUrl = $this->mfaService->getQrCodeUrl($user, $secret);

        return response()->json([
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
            'manual_entry_key' => $secret,
        ]);
    }

    /**
     * Enable MFA
     */
    public function enable(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'secret' => 'required|string',
            'verification_code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if ($user->mfa_enabled) {
            return response()->json([
                'message' => 'MFA is already enabled'
            ], 400);
        }

        $success = $this->mfaService->enableMfa(
            $user,
            $request->secret,
            $request->verification_code
        );

        if (!$success) {
            return response()->json([
                'message' => 'Invalid verification code'
            ], 400);
        }

        $backupCodes = $user->fresh()->mfa_backup_codes;

        return response()->json([
            'message' => 'MFA enabled successfully',
            'backup_codes' => $backupCodes,
        ]);
    }

    /**
     * Disable MFA
     */
    public function disable(Request $request)
    {
        $user = $request->user();

        if (!$user->mfa_enabled) {
            return response()->json([
                'message' => 'MFA is not enabled'
            ], 400);
        }

        $this->mfaService->disableMfa($user);

        return response()->json([
            'message' => 'MFA disabled successfully'
        ]);
    }

    /**
     * Regenerate backup codes
     */
    public function regenerateBackupCodes(Request $request)
    {
        $user = $request->user();

        if (!$user->mfa_enabled) {
            return response()->json([
                'message' => 'MFA is not enabled'
            ], 400);
        }

        $backupCodes = $this->mfaService->regenerateBackupCodes($user);

        return response()->json([
            'message' => 'Backup codes regenerated successfully',
            'backup_codes' => $backupCodes,
        ]);
    }

    /**
     * Get MFA status
     */
    public function status(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'mfa_enabled' => $user->mfa_enabled,
            'backup_codes_count' => $user->mfa_enabled ? count($user->mfa_backup_codes ?? []) : 0,
        ]);
    }
}
