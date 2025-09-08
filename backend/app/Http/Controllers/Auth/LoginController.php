<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MfaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    protected $mfaService;

    public function __construct(MfaService $mfaService)
    {
        $this->mfaService = $mfaService;
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'mfa_code' => 'nullable|string|size:6',
            'remember' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Check if user is active
        if (!$user->is_active) {
            Auth::logout();
            return response()->json([
                'message' => 'Your account has been suspended by administrator. Kindly contact Orbit support team.'
            ], 403);
        }

        // Check if user is a client person and if their client person status is active
        $clientPerson = \App\Models\ClientPerson::where('user_id', $user->id)->first();
        if ($clientPerson && $clientPerson->status !== 'active') {
            Auth::logout();
            return response()->json([
                'message' => 'Your account has been suspended by administrator. Kindly contact Orbit support team.'
            ], 403);
        }

        // Check if MFA is enabled
        if ($user->mfa_enabled) {
            // If MFA code is not provided, return MFA required response
            if (!$request->has('mfa_code')) {
                Auth::logout();
                return response()->json([
                    'message' => 'MFA code required',
                    'mfa_required' => true,
                    'user_id' => $user->id
                ], 200);
            }

            // Verify MFA code
            if (!$this->mfaService->verifyCode($user, $request->mfa_code)) {
                Auth::logout();
                return response()->json([
                    'message' => 'Invalid MFA code'
                ], 401);
            }
        }

        // Create token with different expiration based on remember me
        $tokenName = $request->boolean('remember') ? 'remember_token' : 'auth_token';
        $expiresAt = $request->boolean('remember') ? now()->addDays(30) : now()->addHours(24);
        
        $token = $user->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'expires_at' => $expiresAt->toISOString(),
            'remember' => $request->boolean('remember'),
            'message' => 'Login successful'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }
}
