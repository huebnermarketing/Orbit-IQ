<template>
  <div class="space-y-6">
    <div class="card p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-text-primary">Teams</h3>
        <button
          @click="showCreateTeamModal = true"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Team
        </button>
      </div>

      <!-- Teams Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border-light">
          <thead class="bg-surface-alt">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Team</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Members</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr v-for="team in teams" :key="team.id" class="hover:bg-surface-alt">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-3 flex-shrink-0" :style="{ backgroundColor: team.color }"></div>
                  <div class="text-sm font-medium text-text-primary">{{ team.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-text-primary max-w-xs">
                  <p v-if="team.description" class="truncate">{{ team.description }}</p>
                  <p v-else class="text-text-muted italic">No description</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-primary">{{ getTeamMembers(team.id).length }} members</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    team.is_active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                  ]"
                >
                  {{ team.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button @click="editTeam(team)" class="text-primary-600 hover:text-primary-900" title="Edit team">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="deleteTeam(team)" class="text-error-600 hover:text-error-900" title="Delete team">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="teams.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="text-lg font-medium text-text-primary mb-2">No Teams</h3>
        <p class="text-text-secondary mb-4">Create teams to organize your team members by skills or projects.</p>
        <button @click="showCreateTeamModal = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create First Team
        </button>
      </div>
    </div>
  </div>

  <!-- Create Team Modal -->
  <TeamModal
    v-if="showCreateTeamModal"
    @close="showCreateTeamModal = false"
    @success="handleTeamSuccess"
  />

  <!-- Edit Team Modal -->
  <TeamModal
    v-if="showEditTeamModal"
    :team="editingTeam"
    :is-edit="true"
    @close="showEditTeamModal = false"
    @success="handleTeamSuccess"
  />
</template>

<script lang="ts" src="./TeamsTab.ts"></script>

<style scoped src="./TeamsTab.css"></style>

