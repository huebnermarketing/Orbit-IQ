<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with([
            'assignedTo:id,name,email,avatar',
            'createdBy:id,name,email,avatar',
            'parentTask:id,name',
            'subtasks' => function ($q) {
                $q->with(['assignedTo:id,name,email,avatar'])->orderBy('sort_order');
            }
        ]);

        // Filter by project
        if ($request->has('project_id') && $request->project_id) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by assigned user
        if ($request->has('assigned_to') && $request->assigned_to) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        // Filter out archived tasks by default
        if (!$request->has('include_archived') || !$request->include_archived) {
            $query->active();
        }

        // Only show parent tasks (not subtasks) by default
        if (!$request->has('include_subtasks') || !$request->include_subtasks) {
            $query->whereNull('parent_task_id');
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'sort_order');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $tasks = $query->paginate(50);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,completed,cancelled',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'parent_task_id' => 'nullable|exists:tasks,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'due_date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:0',
            'actual_hours' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'todo',
            'priority' => $request->priority ?? 'medium',
            'project_id' => $request->project_id,
            'assigned_to' => $request->assigned_to,
            'created_by' => $request->user()->id,
            'parent_task_id' => $request->parent_task_id,
            'tags' => $request->tags,
            'due_date' => $request->due_date,
            'start_date' => $request->start_date,
            'estimated_hours' => $request->estimated_hours,
            'actual_hours' => $request->actual_hours,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        $task->load(['assignedTo:id,name,email,avatar', 'createdBy:id,name,email,avatar', 'parentTask:id,name']);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task
        ], 201);
    }

    public function show($id)
    {
        $task = Task::with([
            'assignedTo:id,name,email,avatar',
            'createdBy:id,name,email,avatar',
            'parentTask:id,name',
            'subtasks' => function ($q) {
                $q->with(['assignedTo:id,name,email,avatar'])->orderBy('sort_order');
            },
            'project:id,name'
        ])->find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task not found'
            ], 404);
        }

        return response()->json([
            'task' => $task
        ]);
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,completed,cancelled',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'parent_task_id' => 'nullable|exists:tasks,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'due_date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:0',
            'actual_hours' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer',
            'is_archived' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Set completed_at when status changes to completed
        if ($request->has('status') && $request->status === 'completed' && $task->status !== 'completed') {
            $request->merge(['completed_at' => now()]);
        } elseif ($request->has('status') && $request->status !== 'completed' && $task->status === 'completed') {
            $request->merge(['completed_at' => null]);
        }

        $task->update($request->only([
            'name', 'description', 'status', 'priority', 'assigned_to', 'parent_task_id',
            'tags', 'due_date', 'start_date', 'estimated_hours', 'actual_hours',
            'sort_order', 'is_archived', 'completed_at'
        ]));

        $task->load(['assignedTo:id,name,email,avatar', 'createdBy:id,name,email,avatar', 'parentTask:id,name']);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task
        ]);
    }

    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task not found'
            ], 404);
        }

        // Delete subtasks first
        $task->subtasks()->delete();
        
        // Delete the task
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
            'updates' => 'required|array',
            'updates.status' => 'sometimes|in:todo,in_progress,completed,cancelled',
            'updates.priority' => 'sometimes|in:low,medium,high,urgent',
            'updates.assigned_to' => 'nullable|exists:users,id',
            'updates.is_archived' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $tasks = Task::whereIn('id', $request->task_ids)->get();
        
        foreach ($tasks as $task) {
            $updates = $request->updates;
            
            // Handle completed_at for status changes
            if (isset($updates['status'])) {
                if ($updates['status'] === 'completed' && $task->status !== 'completed') {
                    $updates['completed_at'] = now();
                } elseif ($updates['status'] !== 'completed' && $task->status === 'completed') {
                    $updates['completed_at'] = null;
                }
            }
            
            $task->update($updates);
        }

        return response()->json([
            'message' => 'Tasks updated successfully',
            'updated_count' => $tasks->count()
        ]);
    }
}
