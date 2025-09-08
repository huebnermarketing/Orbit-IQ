<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserManagementController extends Controller
{
    /**
     * Get all users with pagination
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        
        // Check if user can manage users
        if (!$currentUser->canManageUsers()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::query();

        // Filter by role if current user is not super admin
        if (!$currentUser->isSuperAdmin()) {
            $query->where('role', '!=', 'super_admin');
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // Filter by organization role
        if ($request->has('organization_role_id') && $request->organization_role_id) {
            $query->whereHas('organizationRoles', function ($q) use ($request) {
                $q->where('organization_role_id', $request->organization_role_id);
            });
        }

        // Filter by status (active/inactive)
        if ($request->has('status') && $request->status) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        // Validate sort parameters
        $allowedSortFields = ['name', 'email', 'created_at', 'role'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'name';
        }
        
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'asc';
        }

        $users = $query->with(['organizationRole', 'organizationRoles', 'assignedAMs', 'assignedPMs'])
                      ->orderBy($sortBy, $sortOrder)
                      ->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();
        
        // Check if user can manage users
        if (!$currentUser->canManageUsers()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Determine allowed roles based on current user
        $allowedRoles = ['admin', 'user'];
        if ($currentUser->isSuperAdmin()) {
            $allowedRoles[] = 'super_admin';
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:' . implode(',', $allowedRoles),
            'organization_role_ids' => 'nullable|array',
            'organization_role_ids.*' => 'exists:organization_roles,id|not_in:19', // Prevent Client role (ID: 19)
            'assigned_am_ids' => 'nullable|array',
            'assigned_am_ids.*' => 'exists:users,id',
            'timezone' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Regular admins cannot create super admins
        if (!$currentUser->isSuperAdmin() && $request->role === 'super_admin') {
            return response()->json(['message' => 'You cannot create super admin users'], 403);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'organization_role_id' => $request->organization_role_id, // Keep for backward compatibility
            'timezone' => $request->timezone ?? 'UTC',
            'email_verified_at' => now(),
        ]);

        // Attach multiple organization roles
        if ($request->has('organization_role_ids') && is_array($request->organization_role_ids)) {
            $user->organizationRoles()->attach($request->organization_role_ids);
        }

        // Attach AMs to PM
        if ($request->has('assigned_am_ids') && is_array($request->assigned_am_ids)) {
            $user->assignedAMs()->attach($request->assigned_am_ids);
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Update a user
     */
    public function update(Request $request, User $user)
    {
        $currentUser = $request->user();
        
        // Check if user can manage users
        if (!$currentUser->canManageUsers()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Regular admins cannot modify super admins
        if (!$currentUser->isSuperAdmin() && $user->isSuperAdmin()) {
            return response()->json(['message' => 'You cannot modify super admin users'], 403);
        }

        // Determine allowed roles based on current user
        $allowedRoles = ['admin', 'user'];
        if ($currentUser->isSuperAdmin()) {
            $allowedRoles[] = 'super_admin';
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:' . implode(',', $allowedRoles),
            'organization_role_ids' => 'nullable|array',
            'organization_role_ids.*' => 'exists:organization_roles,id|not_in:19', // Prevent Client role (ID: 19)
            'assigned_am_ids' => 'nullable|array',
            'assigned_am_ids.*' => 'exists:users,id',
            'timezone' => 'sometimes|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Regular admins cannot change users to super admin
        if (!$currentUser->isSuperAdmin() && $request->has('role') && $request->role === 'super_admin') {
            return response()->json(['message' => 'You cannot assign super admin role'], 403);
        }

        // Check if user is a client-linked user (has client organization role)
        $isClientLinkedUser = $user->organizationRoles()->where('organization_role_id', 19)->exists();
        
        // Prevent role changes for client-linked users
        if ($isClientLinkedUser) {
            if ($request->has('role') && $request->role !== 'user') {
                return response()->json(['message' => 'Cannot change system role for client users'], 400);
            }
            if ($request->has('organization_role_ids')) {
                return response()->json(['message' => 'Cannot change organization roles for client users'], 400);
            }
        }

        // Prevent email changes for non-super admin users
        $emailChanged = $request->has('email') && $request->email !== $user->email;
        if ($emailChanged && !$currentUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Cannot change email address. Only super admin can modify email addresses.',
                'errors' => ['email' => ['Only super admin can modify email addresses']]
            ], 422);
        }

        $user->update($request->only(['name', 'email', 'role', 'organization_role_id', 'timezone', 'is_active']));

        // Update multiple organization roles
        if ($request->has('organization_role_ids')) {
            $user->organizationRoles()->sync($request->organization_role_ids ?? []);
        }

        // Update PM-AM assignments
        if ($request->has('assigned_am_ids')) {
            $user->assignedAMs()->sync($request->assigned_am_ids ?? []);
        }

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Delete a user
     */
    public function destroy(Request $request, User $user)
    {
        $currentUser = $request->user();
        
        // Check if user can manage users
        if (!$currentUser->canManageUsers()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cannot delete yourself
        if ($currentUser->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        }

        // Regular admins cannot delete super admins
        if (!$currentUser->isSuperAdmin() && $user->isSuperAdmin()) {
            return response()->json(['message' => 'You cannot delete super admin users'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, User $user)
    {
        $currentUser = $request->user();
        
        // Check if user can manage users
        if (!$currentUser->canManageUsers()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Regular admins cannot reset super admin passwords
        if (!$currentUser->isSuperAdmin() && $user->isSuperAdmin()) {
            return response()->json(['message' => 'You cannot reset super admin passwords'], 403);
        }

        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json(['message' => 'Password reset successfully']);
    }

    /**
     * Get AM users for PM assignment
     */
    public function getAMUsers()
    {
        $amUsers = User::whereHas('organizationRoles', function ($query) {
            $query->where('name', 'AM');
        })->select('id', 'name', 'email')->get();

        return response()->json($amUsers);
    }

    /**
     * Get PM users for project assignment
     */
    public function getPMUsers()
    {
        $pmUsers = User::whereHas('organizationRoles', function ($query) {
            $query->where('name', 'PM');
        })->select('id', 'name', 'email')->get();

        return response()->json($pmUsers);
    }
}