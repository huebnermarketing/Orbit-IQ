<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = TaskStatus::query();

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by active status if provided
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $taskStatuses = $query->orderedByCategory()->get();

        return response()->json([
            'data' => $taskStatuses,
            'statuses' => TaskStatus::getGroupedByCategory()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|in:todo,in_progress,done',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        // Custom validation: ensure unique name within category
        $validator->after(function ($validator) use ($request) {
            if (TaskStatus::where('category', $request->category)
                           ->where('name', $request->name)
                           ->exists()) {
                $validator->errors()->add('name', 'A status with this name already exists in the selected category.');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $taskStatus = TaskStatus::create([
            'name' => $request->name,
            'category' => $request->category,
            'color' => $request->color,
            'is_system_defined' => false, // User-created statuses are not system-defined
            'is_locked' => false, // User-created statuses are not locked
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->integer('sort_order', 0),
        ]);

        return response()->json([
            'message' => 'Task status created successfully',
            'data' => $taskStatus
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskStatus $taskStatus)
    {
        $currentUser = request()->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['data' => $taskStatus]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskStatus $taskStatus)
    {
        $currentUser = $request->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // System-defined statuses can be edited but not deleted or made inactive
        if ($taskStatus->is_locked) {
            // Allow editing but prevent making inactive
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|in:todo,in_progress,done',
                'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'sort_order' => 'sometimes|integer|min:0',
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|in:todo,in_progress,done',
                'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'is_active' => 'sometimes|boolean',
                'sort_order' => 'sometimes|integer|min:0',
            ]);
        }

        // Custom validation: ensure unique name within category (excluding current status)
        $validator->after(function ($validator) use ($request, $taskStatus) {
            if (TaskStatus::where('category', $request->category)
                           ->where('name', $request->name)
                           ->where('id', '!=', $taskStatus->id)
                           ->exists()) {
                $validator->errors()->add('name', 'A status with this name already exists in the selected category.');
            }
            
            // Prevent making system-defined statuses inactive
            if ($taskStatus->is_locked && $request->has('is_active') && !$request->boolean('is_active')) {
                $validator->errors()->add('is_active', 'Cannot make system-defined status inactive.');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = [
            'name' => $request->name,
            'category' => $request->category,
            'color' => $request->color,
            'sort_order' => $request->integer('sort_order', $taskStatus->sort_order),
        ];

        // Only allow is_active to be updated for non-locked statuses
        if (!$taskStatus->is_locked && $request->has('is_active')) {
            $updateData['is_active'] = $request->boolean('is_active');
        }

        $taskStatus->update($updateData);

        return response()->json([
            'message' => 'Task status updated successfully',
            'data' => $taskStatus
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskStatus $taskStatus)
    {
        $currentUser = request()->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Prevent deletion of locked statuses
        if ($taskStatus->is_locked) {
            return response()->json([
                'message' => 'Cannot delete locked task status'
            ], 403);
        }

        $taskStatus->delete();

        return response()->json([
            'message' => 'Task status deleted successfully'
        ]);
    }

    /**
     * Get task statuses grouped by category.
     */
    public function getGroupedByCategory()
    {
        $currentUser = request()->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'statuses' => TaskStatus::getGroupedByCategory()
        ]);
    }

    /**
     * Get category options for dropdown.
     */
    public function getCategoryOptions()
    {
        $currentUser = request()->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'categories' => TaskStatus::getCategoryOptions()
        ]);
    }
}