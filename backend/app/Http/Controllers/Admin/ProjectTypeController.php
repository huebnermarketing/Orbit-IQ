<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projectTypes = ProjectType::ordered()->get();
        
        return response()->json([
            'data' => $projectTypes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:project_types,name',
            'description' => 'nullable|string',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $projectType = ProjectType::create([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->is_active ?? true,
            'is_system_defined' => false
        ]);

        return response()->json([
            'message' => 'Project type created successfully',
            'data' => $projectType
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectType $projectType)
    {
        return response()->json([
            'data' => $projectType
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjectType $projectType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:project_types,name,' . $projectType->id,
            'description' => 'nullable|string',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Prevent editing system-defined project types
        if ($projectType->is_system_defined) {
            return response()->json([
                'message' => 'System-defined project types cannot be modified'
            ], 403);
        }

        $projectType->update([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color,
            'sort_order' => $request->sort_order ?? $projectType->sort_order,
            'is_active' => $request->is_active ?? $projectType->is_active
        ]);

        return response()->json([
            'message' => 'Project type updated successfully',
            'data' => $projectType
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectType $projectType)
    {
        // Prevent deleting system-defined project types
        if ($projectType->is_system_defined) {
            return response()->json([
                'message' => 'System-defined project types cannot be deleted'
            ], 403);
        }

        $projectType->delete();

        return response()->json([
            'message' => 'Project type deleted successfully'
        ]);
    }
}