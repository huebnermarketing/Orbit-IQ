<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ], [
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.exists' => 'No account found with this email address. Please check your email.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Generate a reset token
            $resetToken = bin2hex(random_bytes(32));

            // Store the token in the database
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'email' => $request->email,
                    'token' => $resetToken,
                    'created_at' => now()
                ]
            );

            // Dispatch the email job to the queue
            SendPasswordResetEmail::dispatch($request->email, $resetToken);

            return response()->json([
                'message' => 'Password reset link sent to your email'
            ]);

        } catch (\Exception $e) {
            \Log::error('Password reset email job failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Unable to send password reset link. Please try again later.'
            ], 500);
        }
    }
}
