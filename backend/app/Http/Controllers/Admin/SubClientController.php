<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubClient;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubClientController extends Controller
{
    /**
     * Display a listing of sub-clients for a specific client.
     */
    public function index(Request $request, $clientId)
    {
        $currentUser = $request->user();
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $client = Client::findOrFail($clientId);
        $subClients = $client->subClients()->orderBy('name')->get();

        return response()->json($subClients);
    }

    /**
     * Store a newly created sub-client.
     */
    public function store(Request $request, $clientId)
    {
        $currentUser = $request->user();
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $client = Client::findOrFail($clientId);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Convert empty strings to null for optional fields
        $validatedData = $validator->validated();
        $validatedData['email'] = !empty($validatedData['email']) ? $validatedData['email'] : null;
        $validatedData['phone'] = !empty($validatedData['phone']) ? $validatedData['phone'] : null;
        $validatedData['website'] = !empty($validatedData['website']) ? $validatedData['website'] : null;

        $subClient = $client->subClients()->create($validatedData);

        return response()->json($subClient, 201);
    }

    /**
     * Display the specified sub-client.
     */
    public function show(Request $request, $clientId, $id)
    {
        $currentUser = $request->user();
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $client = Client::findOrFail($clientId);
        $subClient = $client->subClients()->findOrFail($id);

        return response()->json($subClient);
    }

    /**
     * Update the specified sub-client.
     */
    public function update(Request $request, $clientId, $id)
    {
        $currentUser = $request->user();
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $client = Client::findOrFail($clientId);
        $subClient = $client->subClients()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Convert empty strings to null for optional fields
        $validatedData = $validator->validated();
        $validatedData['email'] = !empty($validatedData['email']) ? $validatedData['email'] : null;
        $validatedData['phone'] = !empty($validatedData['phone']) ? $validatedData['phone'] : null;
        $validatedData['website'] = !empty($validatedData['website']) ? $validatedData['website'] : null;

        $subClient->update($validatedData);

        return response()->json($subClient);
    }

    /**
     * Remove the specified sub-client.
     */
    public function destroy(Request $request, $clientId, $id)
    {
        $currentUser = $request->user();
        if (!$currentUser->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $client = Client::findOrFail($clientId);
        $subClient = $client->subClients()->findOrFail($id);
        $subClient->delete();

        return response()->json(null, 204);
    }
}