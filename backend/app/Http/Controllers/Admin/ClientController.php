<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\User;
use App\Services\FaviconService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    /**
     * Display a listing of clients.
     */
    public function index(Request $request)
    {
        $query = Client::with(['primaryAccountManager', 'secondaryAccountManagers']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by client type
        if ($request->has('client_type') && $request->client_type) {
            $query->where('client_type', $request->client_type);
        }

        // Filter by active status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'company_name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $clients = $query->paginate(10);

        return response()->json($clients);
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:1000',
            'primary_account_manager_id' => 'nullable|exists:users,id',
            'secondary_account_manager_ids' => 'array',
            'secondary_account_manager_ids.*' => 'exists:users,id',
            'client_type' => 'required|in:Agency,Direct Client',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $client = Client::create([
            'company_name' => $request->company_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'website' => $request->website,
            'address' => $request->address,
            'primary_account_manager_id' => $request->primary_account_manager_id,
            'client_type' => $request->client_type,
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Fetch and store company logo if website is provided
        if ($request->website) {
            try {
                $faviconService = new FaviconService();
                $logoUrl = $faviconService->fetchAndStoreFavicon($request->website);
                if ($logoUrl) {
                    $client->update([
                        'logo_url' => $logoUrl,
                        'logo_fetched_at' => now(),
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('Failed to fetch favicon for client ' . $client->id . ': ' . $e->getMessage());
            }
        }

        // Attach secondary account managers if provided
        if ($request->has('secondary_account_manager_ids') && is_array($request->secondary_account_manager_ids)) {
            $client->secondaryAccountManagers()->attach($request->secondary_account_manager_ids);
        }

        // Load the client with relationships for response
        $client->load(['primaryAccountManager', 'secondaryAccountManagers']);

        return response()->json([
            'message' => 'Client created successfully',
            'client' => $client
        ], 201);
    }

    /**
     * Display the specified client.
     */
    public function show(Client $client)
    {
        // Load relationships and ensure they're properly loaded
        $client->load(['primaryAccountManager', 'secondaryAccountManagers']);
        
        // Ensure secondary account managers is not null
        if (!$client->secondaryAccountManagers) {
            $client->setRelation('secondaryAccountManagers', collect());
        }
        
        return response()->json($client);
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, Client $client)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:1000',
            'primary_account_manager_id' => 'nullable|exists:users,id',
            'secondary_account_manager_ids' => 'array',
            'secondary_account_manager_ids.*' => 'exists:users,id',
            'client_type' => 'required|in:Agency,Direct Client',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $client->update([
            'company_name' => $request->company_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'website' => $request->website,
            'address' => $request->address,
            'primary_account_manager_id' => $request->primary_account_manager_id,
            'client_type' => $request->client_type,
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Refresh company logo if website is provided
        if ($request->website) {
            try {
                $faviconService = new FaviconService();
                $logoUrl = $faviconService->fetchAndStoreFavicon($request->website);
                if ($logoUrl) {
                    $client->update([
                        'logo_url' => $logoUrl,
                        'logo_fetched_at' => now(),
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('Failed to refresh favicon for client ' . $client->id . ': ' . $e->getMessage());
            }
        }

        // Update secondary account managers if provided
        if ($request->has('secondary_account_manager_ids')) {
            $secondaryManagerIds = $request->secondary_account_manager_ids ?: [];
            $client->secondaryAccountManagers()->sync($secondaryManagerIds);
        }

        // Load the client with relationships for response
        $client->load(['primaryAccountManager', 'secondaryAccountManagers']);

        return response()->json([
            'message' => 'Client updated successfully',
            'client' => $client
        ]);
    }

    /**
     * Remove the specified client.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully'
        ]);
    }

    /**
     * Get all account manager users for dropdown selection.
     */
    public function getAccountManagers()
    {
        $users = User::where('is_active', true)
                    ->whereHas('organizationRoles', function ($query) {
                        $query->where('name', 'AM');
                    })
                    ->select('id', 'name', 'email')
                    ->orderBy('name')
                    ->get();

        return response()->json($users);
    }

}