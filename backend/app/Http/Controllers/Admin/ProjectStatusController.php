<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProjectStatusController extends Controller
{
    /**
     * Display a listing of project statuses.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = ProjectStatus::query();

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by active status if provided
        if ($request->has('is_active') && $request->is_active !== null) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'category');
        $sortOrder = $request->get('sort_order', 'asc');
        
        // Validate sort parameters
        $allowedSortFields = ['name', 'category', 'color', 'is_active', 'sort_order', 'created_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'category';
        }
        
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'asc';
        }

        // Default ordering by category, then sort_order, then name
        if ($sortBy === 'category') {
            $statuses = $query->orderBy('category', $sortOrder)
                            ->orderBy('sort_order')
                            ->orderBy('name')
                            ->paginate($request->get('per_page', 15));
        } else {
            $statuses = $query->orderBy($sortBy, $sortOrder)
                            ->paginate($request->get('per_page', 15));
        }

        return response()->json($statuses);
    }

    /**
     * Store a newly created project status.
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
            'category' => 'required|in:todo,in_progress,closed',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        // Custom validation: ensure unique name within category
        $validator->after(function ($validator) use ($request) {
            if (ProjectStatus::where('category', $request->category)
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

        // Set sort order if not provided
        $sortOrder = $request->sort_order ?? ProjectStatus::getNextSortOrder($request->category);

        $status = ProjectStatus::create([
            'name' => $request->name,
            'category' => $request->category,
            'color' => $request->color,
            'is_system_defined' => false, // User-created statuses are never system-defined
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $sortOrder,
        ]);

        return response()->json([
            'message' => 'Project status created successfully',
            'status' => $status
        ], 201);
    }

    /**
     * Display the specified project status.
     */
    public function show(ProjectStatus $projectStatus)
    {
        return response()->json($projectStatus);
    }

    /**
     * Update the specified project status.
     */
    public function update(Request $request, ProjectStatus $projectStatus)
    {
        $currentUser = $request->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // System-defined statuses can be edited but not deleted or made inactive

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|in:todo,in_progress,closed',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        // Custom validation: ensure unique name within category (excluding current status)
        $validator->after(function ($validator) use ($request, $projectStatus) {
            if (ProjectStatus::where('category', $request->category)
                               ->where('name', $request->name)
                               ->where('id', '!=', $projectStatus->id)
                               ->exists()) {
                $validator->errors()->add('name', 'A status with this name already exists in the selected category.');
            }
            
            // Prevent making system-defined statuses inactive
            if ($projectStatus->is_locked && $request->has('is_active') && !$request->boolean('is_active')) {
                $validator->errors()->add('is_active', 'Cannot make system-defined status inactive.');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $projectStatus->update([
            'name' => $request->name,
            'category' => $request->category,
            'color' => $request->color,
            'is_active' => $request->boolean('is_active', $projectStatus->is_active),
            'sort_order' => $request->sort_order ?? $projectStatus->sort_order,
        ]);

        return response()->json([
            'message' => 'Project status updated successfully',
            'status' => $projectStatus->fresh()
        ]);
    }

    /**
     * Remove the specified project status.
     */
    public function destroy(ProjectStatus $projectStatus)
    {
        $currentUser = request()->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Prevent deleting locked statuses
        if ($projectStatus->is_locked) {
            return response()->json([
                'message' => 'Cannot delete locked project status'
            ], 403);
        }

        // TODO: Check if status is being used by any projects/tasks before deletion
        // For now, we'll allow deletion but this should be implemented later

        $projectStatus->delete();

        return response()->json(['message' => 'Project status deleted successfully']);
    }

    /**
     * Get project statuses grouped by category.
     */
    public function getGroupedByCategory()
    {
        $currentUser = request()->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $groupedStatuses = ProjectStatus::getGroupedByCategory();
        
        return response()->json([
            'statuses' => $groupedStatuses,
            'categories' => ProjectStatus::getCategoryOptions()
        ]);
    }

    /**
     * Get category options.
     */
    public function getCategoryOptions()
    {
        $currentUser = request()->user();
        
        // Check if user can manage organization settings
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'categories' => ProjectStatus::getCategoryOptions()
        ]);
    }
}