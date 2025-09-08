<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Workspace channels
Broadcast::channel('workspace.{workspaceId}', function ($user, $workspaceId) {
    return $user->workspaces()->where('workspace_id', $workspaceId)->exists();
});

// Project channels
Broadcast::channel('project.{projectId}', function ($user, $projectId) {
    return $user->projects()->where('project_id', $projectId)->exists();
});

// Team channels
Broadcast::channel('team.{teamId}', function ($user, $teamId) {
    return $user->teams()->where('team_id', $teamId)->exists();
});
