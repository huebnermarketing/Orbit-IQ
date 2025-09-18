<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with([
            'client',
            'subClient',
            'accountManager',
            'projectManager',
            'projectType',
            'projectStatus'
        ]);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('project_number', 'like', "%{$search}%")
                  ->orWhereHas('client', function ($clientQuery) use ($search) {
                      $clientQuery->where('company_name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by client
        if ($request->has('client_id') && $request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        // Filter by status
        if ($request->has('status_id') && $request->status_id) {
            $query->where('project_status_id', $request->status_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $projects = $query->paginate(15);

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'project_number' => 'required|string|max:6|unique:projects,project_number',
            'description' => 'nullable|string',
            'client_id' => 'required|exists:clients,id',
            'sub_client_id' => 'nullable|exists:sub_clients,id',
            'funding_source' => 'required|in:fixed,hourly',
            'hour_type' => 'required|in:billable,non-billable',
            'am_id' => 'nullable|exists:users,id',
            'pm_id' => 'nullable|exists:users,id',
            'project_type_id' => 'nullable|exists:project_types,id',
            'project_status_id' => 'nullable|exists:project_statuses,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'internal_team' => 'nullable|array',
            'internal_team.*' => 'exists:users,id',
            'client_team' => 'nullable|array',
            'client_team.*' => 'exists:client_persons,id',
            'user_groups' => 'nullable|array',
            'user_groups.*' => 'exists:user_groups,id',
            'teams' => 'nullable|array',
            'teams.*' => 'exists:teams,id',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $project = Project::create($request->all());

        // Load relationships for response
        $project->load([
            'client',
            'subClient',
            'accountManager',
            'projectManager',
            'projectType',
            'projectStatus'
        ]);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project
        ], 201);
    }

    public function show($id)
    {
        $project = Project::with([
            'client',
            'subClient',
            'accountManager',
            'projectManager',
            'projectType',
            'projectStatus'
        ])->findOrFail($id);

        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'project_number' => 'sometimes|required|string|max:6|unique:projects,project_number,' . $id,
            'description' => 'nullable|string',
            'client_id' => 'sometimes|required|exists:clients,id',
            'sub_client_id' => 'nullable|exists:sub_clients,id',
            'funding_source' => 'sometimes|required|in:fixed,hourly',
            'hour_type' => 'sometimes|required|in:billable,non-billable',
            'am_id' => 'nullable|exists:users,id',
            'pm_id' => 'nullable|exists:users,id',
            'project_type_id' => 'nullable|exists:project_types,id',
            'project_status_id' => 'nullable|exists:project_statuses,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'internal_team' => 'nullable|array',
            'internal_team.*' => 'exists:users,id',
            'client_team' => 'nullable|array',
            'client_team.*' => 'exists:client_persons,id',
            'user_groups' => 'nullable|array',
            'user_groups.*' => 'exists:user_groups,id',
            'teams' => 'nullable|array',
            'teams.*' => 'exists:teams,id',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $project->update($request->all());

        // Load relationships for response
        $project->load([
            'client',
            'subClient',
            'accountManager',
            'projectManager',
            'projectType',
            'projectStatus'
        ]);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project
        ]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
}
