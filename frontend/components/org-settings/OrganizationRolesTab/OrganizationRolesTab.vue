<template>
  <div class="space-y-6">
    <div class="card p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-text-primary">Organization Roles</h3>
        <button
          @click="showCreateOrgRoleModal = true"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Role
        </button>
      </div>

      <!-- Roles Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border-light">
          <thead class="bg-surface-alt">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Assigned Users
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Property
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr v-for="role in orgRoles" :key="role.id" class="hover:bg-surface-alt">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-4 h-4 rounded-full mr-3 flex-shrink-0 border border-gray-200"
                    :style="{ backgroundColor: role.color }"
                  ></div>
                  <div>
                    <div class="text-sm font-medium text-text-primary">{{ role.name }}</div>
                    <div v-if="role.description" class="text-xs text-text-secondary">{{ role.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary">{{ role.users_count || 0 }} users</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    role.is_active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                  ]"
                >
                  {{ role.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="role.is_locked"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800"
                >
                  System-Defined
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800"
                >
                  User-Defined
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editOrgRole(role)"
                    class="text-primary-600 hover:text-primary-900 p-1"
                    :class="{ 'opacity-50 cursor-not-allowed': role.is_locked }"
                    :disabled="role.is_locked"
                    :title="role.is_locked ? 'System role cannot be edited' : 'Edit role'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="!role.is_locked"
                    @click="deleteOrgRole(role)"
                    class="text-red-600 hover:text-red-900 p-1"
                    title="Delete role"
                  >
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
      <div v-if="orgRoles.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="text-lg font-medium text-text-primary mb-2">No Organization Roles</h3>
        <p class="text-text-secondary mb-4">Create custom roles to organize your team members.</p>
        <button
          @click="showCreateOrgRoleModal = true"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create First Role
        </button>
      </div>
    </div>
  </div>

  <!-- Create Organization Role Modal -->
  <OrganizationRoleModal
    v-if="showCreateOrgRoleModal"
    @close="showCreateOrgRoleModal = false"
    @success="handleOrgRoleSuccess"
  />

  <!-- Edit Organization Role Modal -->
  <OrganizationRoleModal
    v-if="showEditOrgRoleModal"
    :role="editingOrgRole"
    @close="showEditOrgRoleModal = false"
    @success="handleOrgRoleSuccess"
  />
</template>

<script lang="ts" src="./OrganizationRolesTab.ts"></script>

<style scoped src="./OrganizationRolesTab.css"></style>

