<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        // TODO: Implement task listing
        return response()->json([
            'tasks' => []
        ]);
    }

    public function store(Request $request)
    {
        // TODO: Implement task creation
        return response()->json([
            'message' => 'Task created successfully'
        ], 201);
    }

    public function show($id)
    {
        // TODO: Implement task details
        return response()->json([
            'task' => null
        ]);
    }

    public function update(Request $request, $id)
    {
        // TODO: Implement task update
        return response()->json([
            'message' => 'Task updated successfully'
        ]);
    }

    public function destroy($id)
    {
        // TODO: Implement task deletion
        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }
}
