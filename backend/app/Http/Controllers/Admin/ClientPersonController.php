<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ClientPerson;
use App\Models\User;
use App\Jobs\SendClientInvitationJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ClientPersonController extends Controller
{
    /**
     * Display a listing of client persons for a specific client.
     */
    public function index(Client $client)
    {
        $clientPersons = $client->clientPersons()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($clientPersons);
    }

    /**
     * Store a newly created client person.
     */
    public function store(Request $request, Client $client)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('client_persons')->where(function ($query) use ($client) {
                    return $query->where('client_id', $client->id);
                }),
                Rule::unique('users', 'email'), // Prevent same email in users table
                Rule::unique('client_persons', 'email') // Prevent same email across all clients
            ],
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $clientPerson = $client->clientPersons()->create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => 'pending',
        ]);

        // Generate password setup token and send invitation email
        $token = $clientPerson->generatePasswordSetupToken();
        
        // Send invitation email
        dispatch(new SendClientInvitationJob($clientPerson, $token));

        return response()->json([
            'message' => 'Client person created successfully',
            'client_person' => $clientPerson->load('user')
        ], 201);
    }

    /**
     * Display the specified client person.
     */
    public function show(Client $client, ClientPerson $clientPerson)
    {
        // Ensure the client person belongs to the client
        if ($clientPerson->client_id !== $client->id) {
            return response()->json(['message' => 'Client person not found'], 404);
        }

        return response()->json($clientPerson->load('user'));
    }

    /**
     * Update the specified client person.
     */
    public function update(Request $request, Client $client, ClientPerson $clientPerson)
    {
        // Ensure the client person belongs to the client
        if ($clientPerson->client_id !== $client->id) {
            return response()->json(['message' => 'Client person not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('client_persons')->where(function ($query) use ($client) {
                    return $query->where('client_id', $client->id);
                })->ignore($clientPerson->id),
                Rule::unique('users', 'email'), // Prevent same email in users table
                Rule::unique('client_persons', 'email')->ignore($clientPerson->id) // Prevent same email across all clients
            ],
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:pending,active,inactive',
        ]);

        // Custom validation: prevent changing from active/inactive back to pending
        if ($request->status === 'pending' && in_array($clientPerson->status, ['active', 'inactive'])) {
            return response()->json([
                'message' => 'Cannot change status to pending. User has already set their password.',
                'errors' => ['status' => ['Cannot change to pending status once user has set password']]
            ], 422);
        }

        // Custom validation: prevent changing from pending to active/inactive (user must setup password via link)
        if (in_array($request->status, ['active', 'inactive']) && $clientPerson->status === 'pending') {
            return response()->json([
                'message' => 'Cannot change status from pending. User must setup password via invitation link.',
                'errors' => ['status' => ['User must complete password setup via invitation link to become active']]
            ], 422);
        }

        // Custom validation: prevent email changes for activated users (only super admin can change)
        $currentUser = $request->user();
        $isUserActivated = in_array($clientPerson->status, ['active', 'inactive']);
        $emailChanged = $request->email !== $clientPerson->email;
        
        if ($isUserActivated && $emailChanged && !$currentUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Cannot change email for activated users. Only super admin can modify email addresses.',
                'errors' => ['email' => ['Email cannot be changed for activated users']]
            ], 422);
        }

        // Custom validation: prevent system role and organization role changes for client users
        if ($isUserActivated && $clientPerson->user_id) {
            $user = $clientPerson->user;
            if ($user) {
                // Check if user has Client organization role
                $hasClientRole = $user->organizationRoles()->where('organization_role_id', 14)->exists();
                
                if ($hasClientRole) {
                    // Prevent any system role changes for client users
                    if ($request->has('role') && $request->role !== 'user') {
                        return response()->json([
                            'message' => 'Cannot change system role for client users. Client users must have "user" role.',
                            'errors' => ['role' => ['System role cannot be changed for client users']]
                        ], 422);
                    }
                    
                    // Prevent any organization role changes for client users
                    if ($request->has('organization_role_ids')) {
                        return response()->json([
                            'message' => 'Cannot change organization roles for client users. Client users are automatically assigned the Client role.',
                            'errors' => ['organization_role_ids' => ['Organization roles cannot be changed for client users']]
                        ], 422);
                    }
                }
            }
        }

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $clientPerson->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Client person updated successfully',
            'client_person' => $clientPerson->load('user')
        ]);
    }

    /**
     * Remove the specified client person.
     */
    public function destroy(Client $client, ClientPerson $clientPerson)
    {
        // Ensure the client person belongs to the client
        if ($clientPerson->client_id !== $client->id) {
            return response()->json(['message' => 'Client person not found'], 404);
        }

        // If the client person has a linked user, delete the user as well
        if ($clientPerson->user_id) {
            $user = $clientPerson->user;
            if ($user) {
                // Delete the user completely since they were created specifically for this client
                $user->delete();
            }
        }

        $clientPerson->delete();

        return response()->json(['message' => 'Client person deleted successfully']);
    }

    /**
     * Resend invitation email to a client person.
     */
    public function resendInvitation(Client $client, ClientPerson $clientPerson)
    {
        // Ensure the client person belongs to the client
        if ($clientPerson->client_id !== $client->id) {
            return response()->json(['message' => 'Client person not found'], 404);
        }

        // Only resend for pending invitations
        if ($clientPerson->status !== 'pending') {
            return response()->json([
                'message' => 'Can only resend invitations for pending client persons'
            ], 400);
        }

        // Generate new password setup token
        $token = $clientPerson->generatePasswordSetupToken();
        
        // Send invitation email
        dispatch(new SendClientInvitationJob($clientPerson, $token));

        return response()->json([
            'message' => 'Invitation email sent successfully',
            'client_person' => $clientPerson->fresh()
        ]);
    }

    /**
     * Setup password for a client person using the token.
     */
    public function setupPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $clientPerson = ClientPerson::where('password_setup_token', $request->token)->first();

        if (!$clientPerson || !$clientPerson->isPasswordSetupTokenValid()) {
            return response()->json([
                'message' => 'Invalid or expired token'
            ], 400);
        }

        // Check if a user with this email already exists
        $existingUser = User::where('email', $clientPerson->email)->first();
        if ($existingUser) {
            return response()->json([
                'message' => 'A user with this email already exists. Please contact support.'
            ], 400);
        }

        // Create user account
        $user = User::create([
            'name' => $clientPerson->name,
            'email' => $clientPerson->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // System role
            'organization_role_id' => 14, // Client org role (ID: 14)
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Attach the client organization role to the user
        $user->organizationRoles()->attach(14);

        // Mark client person as active and link to user
        $clientPerson->markAsActive($user);

        return response()->json([
            'message' => 'Password setup successful. You can now login.',
            'user' => $user
        ]);
    }
}