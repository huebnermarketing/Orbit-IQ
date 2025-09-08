<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class OrganizationController extends Controller
{
    /**
     * Get organization profile
     */
    public function getProfile()
    {
        $organization = Organization::first();
        
        if (!$organization) {
            // Create default organization if none exists
            $organization = Organization::create([
                'name' => 'Orbit IQ Company',
                'description' => 'A modern project management platform for teams',
                'email' => 'contact@orbitiq.com',
                'phone' => '+1 (555) 123-4567',
                'address' => "123 Business St, Suite 100\nSan Francisco, CA 94105",
                'website' => 'https://www.orbitiq.com',
                'timezone' => 'UTC',
                'logo' => null
            ]);
        }
        
        return response()->json($organization);
    }

    /**
     * Update organization profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'website' => 'nullable|url|max:255',
            'timezone' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $organization = Organization::first();
        
        if (!$organization) {
            $organization = Organization::create($request->only([
                'name', 'description', 'email', 'phone', 
                'address', 'website', 'timezone'
            ]));
        } else {
            $organization->update($request->only([
                'name', 'description', 'email', 'phone', 
                'address', 'website', 'timezone'
            ]));
        }

        return response()->json([
            'message' => 'Company profile updated successfully',
            'data' => $organization
        ]);
    }

    /**
     * Upload organization logo
     */
    public function uploadLogo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('logo');
            $filename = 'org-logo-' . time() . '.' . $file->getClientOriginalExtension();
            
            // Store the file
            $path = $file->storeAs('public/organization', $filename);
            
            // Get or create organization
            $organization = Organization::first();
        if (!$organization) {
            $organization = Organization::create([
                'name' => 'Orbit IQ Company',
                'description' => 'A modern project management platform for teams',
                'email' => 'contact@orbitiq.com',
                'phone' => '+1 (555) 123-4567',
                'address' => "123 Business St, Suite 100\nSan Francisco, CA 94105",
                'website' => 'https://www.orbitiq.com',
                'timezone' => 'UTC',
                'logo' => 'organization/' . $filename
            ]);
            } else {
                // Delete old logo if exists
                if ($organization->logo && Storage::exists('public/' . $organization->logo)) {
                    Storage::delete('public/' . $organization->logo);
                }
                
                // Update organization with new logo
                $organization->update(['logo' => 'organization/' . $filename]);
            }
            
            return response()->json([
                'message' => 'Logo uploaded successfully',
                'logo' => 'organization/' . $filename
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload logo'
            ], 500);
        }
    }
}