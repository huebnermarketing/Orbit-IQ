<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizationRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrganizationRoleController extends Controller
{
    /**
     * Get all organization roles
     */
    public function index()
    {
        $roles = OrganizationRole::ordered()
            ->withCount('users')
            ->with(['users' => function ($query) {
                $query->select('users.id', 'users.name', 'users.email', 'users.avatar')
                      ->orderBy('users.name');
            }])
            ->get();

        return response()->json($roles);
    }

    /**
     * Create a new organization role
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:organization_roles,name',
            'description' => 'nullable|string|max:1000',
            'permissions' => 'nullable|array',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $role = OrganizationRole::create([
            'name' => $request->name,
            'description' => $request->description,
            'permissions' => $request->permissions ?? [],
            'color' => $request->color ?? '#4D6CFA',
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0
        ]);

        return response()->json([
            'message' => 'Organization role created successfully',
            'data' => $role->loadCount('users')
        ], 201);
    }

    /**
     * Get a specific organization role
     */
    public function show(OrganizationRole $organizationRole)
    {
        return response()->json($organizationRole->loadCount('users'));
    }

    /**
     * Update an organization role
     */
    public function update(Request $request, OrganizationRole $organizationRole)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:organization_roles,name,' . $organizationRole->id,
            'description' => 'nullable|string|max:1000',
            'permissions' => 'nullable|array',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $organizationRole->update([
            'name' => $request->name,
            'description' => $request->description,
            'permissions' => $request->permissions ?? $organizationRole->permissions,
            'color' => $request->color ?? $organizationRole->color,
            'is_active' => $request->is_active ?? $organizationRole->is_active,
            'sort_order' => $request->sort_order ?? $organizationRole->sort_order
        ]);

        return response()->json([
            'message' => 'Organization role updated successfully',
            'data' => $organizationRole->loadCount('users')
        ]);
    }

    /**
     * Delete an organization role
     */
    public function destroy(OrganizationRole $organizationRole)
    {
        // Check if role is locked
        if ($organizationRole->is_locked) {
            return response()->json([
                'message' => 'Cannot delete locked system role'
            ], 422);
        }

        // Check if role has users assigned
        if ($organizationRole->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete role that has users assigned to it'
            ], 422);
        }

        $organizationRole->delete();

        return response()->json([
            'message' => 'Organization role deleted successfully'
        ]);
    }

    /**
     * Get users assigned to a specific role
     */
    public function users(OrganizationRole $organizationRole)
    {
        $users = $organizationRole->users()
            ->select('users.id', 'users.name', 'users.email', 'users.avatar')
            ->get();

        return response()->json($users);
    }
}
