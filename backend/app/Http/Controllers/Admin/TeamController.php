<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    /**
     * Get all teams with members count
     */
    public function index()
    {
        $teams = Team::withCount('members')
                    ->ordered()
                    ->get();

        return response()->json($teams);
    }

    /**
     * Create a new team
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();
        
        // Check if user can manage teams (admin or super admin)
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:teams',
            'description' => 'nullable|string',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $team = Team::create([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color,
            'is_active' => $request->get('is_active', true),
            'sort_order' => $request->get('sort_order', 0),
            'owner_id' => $currentUser->id
        ]);

        return response()->json([
            'message' => 'Team created successfully',
            'team' => $team
        ], 201);
    }

    /**
     * Get a specific team with members
     */
    public function show(Team $team)
    {
        $team->load(['members' => function ($query) {
            $query->with(['organizationRoles']);
        }]);

        return response()->json($team);
    }

    /**
     * Update a team
     */
    public function update(Request $request, Team $team)
    {
        $currentUser = $request->user();
        
        // Check if user can manage teams
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:teams,name,' . $team->id,
            'description' => 'nullable|string',
            'color' => 'sometimes|required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $team->update($request->only(['name', 'description', 'color', 'is_active', 'sort_order']));

        return response()->json([
            'message' => 'Team updated successfully',
            'team' => $team->fresh()
        ]);
    }

    /**
     * Delete a team
     */
    public function destroy(Team $team)
    {
        $currentUser = request()->user();
        
        // Check if user can manage teams
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $team->delete();

        return response()->json(['message' => 'Team deleted successfully']);
    }

    /**
     * Add members to a team
     */
    public function addMembers(Request $request, Team $team)
    {
        $currentUser = $request->user();
        
        // Check if user can manage teams
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'roles' => 'sometimes|array',
            'role' => 'sometimes|string|in:member,lead'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Handle both individual roles and single role for all users
        $roles = $request->get('roles', []);
        $defaultRole = $request->get('role', 'member');
        
        // Attach users to team with their specific roles
        $team->members()->syncWithoutDetaching(
            collect($request->user_ids)->mapWithKeys(function ($userId) use ($roles, $defaultRole) {
                $role = $roles[$userId] ?? $defaultRole;
                return [$userId => ['role' => $role]];
            })
        );

        return response()->json(['message' => 'Members added to team successfully']);
    }

    /**
     * Remove members from a team
     */
    public function removeMembers(Request $request, Team $team)
    {
        $currentUser = $request->user();
        
        // Check if user can manage teams
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $team->members()->detach($request->user_ids);

        return response()->json(['message' => 'Members removed from team successfully']);
    }

    /**
     * Update member role in team
     */
    public function updateMemberRole(Request $request, Team $team, User $user)
    {
        $currentUser = $request->user();
        
        // Check if user can manage teams
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:member,lead'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $team->members()->updateExistingPivot($user->id, [
            'role' => $request->role
        ]);

        return response()->json(['message' => 'Member role updated successfully']);
    }

    /**
     * Get all users for team assignment
     */
    public function getUsers()
    {
        $users = User::with(['organizationRoles'])
                    ->select('id', 'name', 'email')
                    ->orderBy('name')
                    ->get();

        return response()->json($users);
    }
}