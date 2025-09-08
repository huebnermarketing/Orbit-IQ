<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserGroupController extends Controller
{
    /**
     * Display a listing of user groups.
     */
    public function index(Request $request)
    {
        $query = UserGroup::with('users');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $userGroups = $query->paginate(10);

        return response()->json($userGroups);
    }

    /**
     * Store a newly created user group.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:user_groups,name',
            'description' => 'nullable|string|max:1000',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $userGroup = UserGroup::create([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color,
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Attach users if provided
        if ($request->has('user_ids') && is_array($request->user_ids)) {
            $userGroup->users()->attach($request->user_ids);
        }

        // Load the group with users for response
        $userGroup->load('users');

        return response()->json([
            'message' => 'User group created successfully',
            'user_group' => $userGroup
        ], 201);
    }

    /**
     * Display the specified user group.
     */
    public function show(UserGroup $userGroup)
    {
        $userGroup->load('users');
        return response()->json($userGroup);
    }

    /**
     * Update the specified user group.
     */
    public function update(Request $request, UserGroup $userGroup)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:user_groups,name,' . $userGroup->id,
            'description' => 'nullable|string|max:1000',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $userGroup->update([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color,
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Update users if provided
        if ($request->has('user_ids')) {
            $userGroup->users()->sync($request->user_ids);
        }

        // Load the group with users for response
        $userGroup->load('users');

        return response()->json([
            'message' => 'User group updated successfully',
            'user_group' => $userGroup
        ]);
    }

    /**
     * Remove the specified user group.
     */
    public function destroy(UserGroup $userGroup)
    {
        $userGroup->delete();

        return response()->json([
            'message' => 'User group deleted successfully'
        ]);
    }

    /**
     * Get all active users for dropdown selection.
     */
    public function getActiveUsers()
    {
        $users = User::where('is_active', true)
                    ->select('id', 'name', 'email')
                    ->orderBy('name')
                    ->get();

        return response()->json($users);
    }
}