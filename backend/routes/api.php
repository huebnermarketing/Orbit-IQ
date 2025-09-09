<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Health check routes (public)
Route::get('/health', [App\Http\Controllers\HealthController::class, 'health']);
Route::get('/health/detailed', [App\Http\Controllers\HealthController::class, 'detailed']);

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);
    Route::post('login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
    Route::post('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('forgot-password', [App\Http\Controllers\Auth\ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('reset-password', [App\Http\Controllers\Auth\ResetPasswordController::class, 'reset']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('profile', [App\Http\Controllers\UserController::class, 'profile']);
    Route::put('profile', [App\Http\Controllers\UserController::class, 'updateProfile']);
    Route::post('profile/avatar', [App\Http\Controllers\UserController::class, 'updateProfile']);
    Route::post('profile/change-password', [App\Http\Controllers\UserController::class, 'changePassword']);
    Route::delete('profile/avatar', [App\Http\Controllers\UserController::class, 'deleteAvatar']);
    Route::put('profile/theme', [App\Http\Controllers\UserController::class, 'updateThemePreference']);
    
    // MFA routes
    Route::prefix('mfa')->group(function () {
        Route::get('status', [App\Http\Controllers\MfaController::class, 'status']);
        Route::post('setup', [App\Http\Controllers\MfaController::class, 'setup']);
        Route::post('enable', [App\Http\Controllers\MfaController::class, 'enable']);
        Route::post('disable', [App\Http\Controllers\MfaController::class, 'disable']);
        Route::post('regenerate-backup-codes', [App\Http\Controllers\MfaController::class, 'regenerateBackupCodes']);
    });
    
    // Workspaces
    Route::apiResource('workspaces', App\Http\Controllers\WorkspaceController::class);
    
    // Projects
    Route::apiResource('projects', App\Http\Controllers\ProjectController::class);
    
    // Tasks
    Route::apiResource('tasks', App\Http\Controllers\TaskController::class);
    
    // Teams
    Route::apiResource('teams', App\Http\Controllers\TeamController::class);
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('users', [App\Http\Controllers\Admin\UserManagementController::class, 'index']);
        Route::post('users', [App\Http\Controllers\Admin\UserManagementController::class, 'store']);
        Route::put('users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'update']);
        Route::delete('users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'destroy']);
        Route::post('users/{user}/reset-password', [App\Http\Controllers\Admin\UserManagementController::class, 'resetPassword']);
        Route::get('users/am-users', [App\Http\Controllers\Admin\UserManagementController::class, 'getAMUsers']);
        Route::get('users/pm-users', [App\Http\Controllers\Admin\UserManagementController::class, 'getPMUsers']);
        
        // Organization routes
        Route::get('organization/profile', [App\Http\Controllers\Admin\OrganizationController::class, 'getProfile']);
        Route::put('organization/profile', [App\Http\Controllers\Admin\OrganizationController::class, 'updateProfile']);
        Route::post('organization/logo', [App\Http\Controllers\Admin\OrganizationController::class, 'uploadLogo']);
        
        // Organization Roles routes
        Route::apiResource('organization-roles', App\Http\Controllers\Admin\OrganizationRoleController::class);
        Route::get('organization-roles/{organizationRole}/users', [App\Http\Controllers\Admin\OrganizationRoleController::class, 'users']);
        
        // Teams routes
        Route::apiResource('teams', App\Http\Controllers\Admin\TeamController::class)->names([
            'index' => 'admin.teams.index',
            'store' => 'admin.teams.store',
            'show' => 'admin.teams.show',
            'update' => 'admin.teams.update',
            'destroy' => 'admin.teams.destroy'
        ]);
        Route::post('teams/{team}/members', [App\Http\Controllers\Admin\TeamController::class, 'addMembers']);
        Route::delete('teams/{team}/members', [App\Http\Controllers\Admin\TeamController::class, 'removeMembers']);
        Route::put('teams/{team}/members/{user}', [App\Http\Controllers\Admin\TeamController::class, 'updateMemberRole']);
        Route::get('teams/users/available', [App\Http\Controllers\Admin\TeamController::class, 'getUsers']);
        
        // User Groups routes
        Route::apiResource('user-groups', App\Http\Controllers\Admin\UserGroupController::class);
        Route::get('user-groups/users/active', [App\Http\Controllers\Admin\UserGroupController::class, 'getActiveUsers']);
        
        // Project Status routes - specific routes must come before apiResource
        Route::get('project-statuses/grouped-by-category', [App\Http\Controllers\Admin\ProjectStatusController::class, 'getGroupedByCategory']);
        Route::get('project-statuses/category-options', [App\Http\Controllers\Admin\ProjectStatusController::class, 'getCategoryOptions']);
        Route::apiResource('project-statuses', App\Http\Controllers\Admin\ProjectStatusController::class);
        
        // Task Status routes - specific routes must come before apiResource
        Route::get('task-statuses/grouped-by-category', [App\Http\Controllers\Admin\TaskStatusController::class, 'getGroupedByCategory']);
        Route::get('task-statuses/category-options', [App\Http\Controllers\Admin\TaskStatusController::class, 'getCategoryOptions']);
        Route::apiResource('task-statuses', App\Http\Controllers\Admin\TaskStatusController::class);
        
        // Project Types routes
        Route::apiResource('project-types', App\Http\Controllers\Admin\ProjectTypeController::class);
        
        // Clients routes
        Route::get('clients/account-managers', [App\Http\Controllers\Admin\ClientController::class, 'getAccountManagers']);
        Route::apiResource('clients', App\Http\Controllers\Admin\ClientController::class);
        
        // Client Persons routes
        Route::get('clients/{client}/persons', [App\Http\Controllers\Admin\ClientPersonController::class, 'index']);
        Route::post('clients/{client}/persons', [App\Http\Controllers\Admin\ClientPersonController::class, 'store']);
        Route::get('clients/{client}/persons/{clientPerson}', [App\Http\Controllers\Admin\ClientPersonController::class, 'show']);
        Route::put('clients/{client}/persons/{clientPerson}', [App\Http\Controllers\Admin\ClientPersonController::class, 'update']);
        Route::delete('clients/{client}/persons/{clientPerson}', [App\Http\Controllers\Admin\ClientPersonController::class, 'destroy']);
        Route::post('clients/{client}/persons/{clientPerson}/resend-invitation', [App\Http\Controllers\Admin\ClientPersonController::class, 'resendInvitation']);
        
        // Sub-Clients routes
        Route::get('clients/{client}/sub-clients', [App\Http\Controllers\Admin\SubClientController::class, 'index']);
        Route::post('clients/{client}/sub-clients', [App\Http\Controllers\Admin\SubClientController::class, 'store']);
        Route::get('clients/{client}/sub-clients/{subClient}', [App\Http\Controllers\Admin\SubClientController::class, 'show']);
        Route::put('clients/{client}/sub-clients/{subClient}', [App\Http\Controllers\Admin\SubClientController::class, 'update']);
        Route::delete('clients/{client}/sub-clients/{subClient}', [App\Http\Controllers\Admin\SubClientController::class, 'destroy']);
    });
});

// Public routes for client password setup
Route::post('client/setup-password', [App\Http\Controllers\Admin\ClientPersonController::class, 'setupPassword']);
