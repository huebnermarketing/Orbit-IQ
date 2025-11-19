<template>
  <div class="space-y-6">
    <div class="card p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-text-primary">User Management</h3>
        <button
          @click="showCreateUserModal = true"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add User
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-col lg:flex-row gap-4 mb-6">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="input"
            @input="searchUsers"
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="roleFilter" @change="filterUsers" class="input w-full sm:w-40">
            <option value="">All System Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select v-model="orgRoleFilter" @change="filterUsers" class="input w-full sm:w-48">
            <option value="">All Org. Roles</option>
            <option v-for="role in orgRoles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          <select v-model="statusFilter" @change="filterUsers" class="input w-full sm:w-32">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="">All Status</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border-light">
          <thead class="bg-surface-alt">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                System Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Org. Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr v-for="user in users" :key="user.id" class="hover:bg-surface-alt">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      v-if="user.avatar"
                      :src="`/storage/${user.avatar}`"
                      :alt="user.name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white font-medium text-sm">
                      {{ getInitials(user.name) }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-text-primary">{{ user.name }}</div>
                    <div class="text-sm text-text-secondary">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleBadgeClass(user.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="user.organization_roles && user.organization_roles.length > 0" class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.organization_roles"
                    :key="role.id"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :style="{
                      backgroundColor: role.color + 'CC',
                      color: getContrastColor(role.color)
                    }"
                  >
                    {{ role.name }}
                  </span>
                </div>
                <span v-else class="text-text-secondary text-xs">No roles assigned</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user.is_active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                  ]"
                >
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editUser(user)"
                    class="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors"
                    title="Edit user"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="resetUserPassword(user)"
                    class="text-secondary-600 hover:text-secondary-900 p-1 rounded hover:bg-secondary-50 transition-colors"
                    title="Reset password"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="canDeleteUser(user)"
                    @click="deleteUser(user)"
                    class="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors"
                    title="Delete user"
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

      <!-- Pagination -->
      <div v-if="pagination" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-text-secondary">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
        </div>
        <div class="flex space-x-2">
          <button
            v-if="pagination.prev_page_url"
            @click="loadUsers(pagination.current_page - 1)"
            class="btn-outline"
          >
            Previous
          </button>
          <button
            v-if="pagination.next_page_url"
            @click="loadUsers(pagination.current_page + 1)"
            class="btn-outline"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit User Modal -->
  <UserModal
    v-if="showCreateUserModal || showEditUserModal"
    :user="editingUser"
    :is-edit="showEditUserModal"
    @close="closeUserModal"
    @saved="handleUserSaved"
  />

  <!-- Reset Password Modal -->
  <ResetPasswordModal
    v-if="showResetPasswordModal"
    :user="selectedUser"
    @close="showResetPasswordModal = false"
    @saved="handlePasswordReset"
  />
</template>

<script lang="ts" src="./UserManagementTab.ts"></script>

<style scoped src="./UserManagementTab.css"></style>

