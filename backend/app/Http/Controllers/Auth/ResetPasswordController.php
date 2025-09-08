<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ResetPasswordController extends Controller
{
    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.exists' => 'No account found with this email address.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.confirmed' => 'Password confirmation does not match.',
            'token.required' => 'Reset token is required.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Find the user
            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'No account found with this email address.'
                ], 404);
            }

            // Validate the reset token
            $tokenRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->where('token', $request->token)
                ->first();

            if (!$tokenRecord) {
                return response()->json([
                    'message' => 'Invalid or expired reset link. Please request a new password reset link.',
                    'error_type' => 'invalid_token'
                ], 400);
            }

            // Check if token is expired (24 hours)
            $tokenAge = now()->diffInHours($tokenRecord->created_at);
            if ($tokenAge > 24) {
                // Remove expired token
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                
                return response()->json([
                    'message' => 'This password reset link has expired. Please request a new password reset link.',
                    'error_type' => 'expired_token'
                ], 400);
            }
            
            // Update the user's password
            $user->update([
                'password' => Hash::make($request->password)
            ]);

            // Remove the used token from database
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            // Send password reset notification email
            SendPasswordResetNotification::dispatch(
                $request->email,
                $request->ip(),
                $request->userAgent()
            );

            return response()->json([
                'message' => 'Password reset successfully. You can now log in with your new password.'
            ]);

        } catch (\Exception $e) {
            \Log::error('Password reset failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to reset password. Please try again.'
            ], 500);
        }
    }
}
