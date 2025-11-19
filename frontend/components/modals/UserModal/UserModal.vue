<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>
      <div
        class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">
              {{ isEdit ? 'Edit User' : 'Create New User' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="flex justify-center mb-6">
              <AvatarUpload
                :avatar-url="form.avatar ? `/storage/${form.avatar}` : null"
                :name="form.name"
                :size="80"
                @upload="handleAvatarUpload"
                @error="handleAvatarError"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                class="input"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Email Address</label>
              <input
                v-model="form.email"
                type="email"
                :disabled="!canEditEmail"
                :class="['input', !canEditEmail ? 'bg-gray-100 cursor-not-allowed' : '']"
                placeholder="Enter email address"
                required
              />
              <p v-if="!canEditEmail" class="text-xs text-gray-500 mt-1">
                Only super admin can modify email addresses.
              </p>
            </div>
            <div v-if="!isEdit">
              <label class="block text-sm font-medium text-text-primary mb-2">Password</label>
              <input
                v-model="form.password"
                type="password"
                class="input"
                placeholder="Enter password"
                required
              />
            </div>
            <div v-if="!isEdit">
              <label class="block text-sm font-medium text-text-primary mb-2"
                >Confirm Password</label
              >
              <input
                v-model="form.password_confirmation"
                type="password"
                class="input"
                placeholder="Confirm password"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2"
                >System Role
                <span v-if="isClientLinkedUser" class="text-xs text-gray-500 ml-2"
                  >(Fixed for client users)</span
                ></label
              >
              <select v-model="form.role" class="input" :disabled="isClientLinkedUser" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option v-if="canCreateSuperAdmin" value="super_admin">Super Admin</option>
              </select>
            </div>
            <div v-if="isEdit">
              <label class="block text-sm font-medium text-text-primary mb-2">User Status</label>
              <div class="flex items-center space-x-3">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.is_active" class="sr-only" />
                  <div class="relative">
                    <div
                      class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out"
                      :class="form.is_active ? 'bg-primary-500' : 'bg-gray-300'"
                    ></div>
                    <div
                      class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out"
                      :class="
                        form.is_active ? 'transform translate-x-5' : 'transform translate-x-0'
                      "
                    ></div>
                  </div>
                  <span class="ml-3 text-sm font-medium text-text-primary">{{
                    form.is_active ? 'Active' : 'Inactive'
                  }}</span>
                </label>
              </div>
              <p class="text-xs text-text-secondary mt-1">
                {{
                  form.is_active
                    ? 'User can log in and access the system'
                    : 'User cannot log in and is disabled'
                }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2"
                >Organization Roles
                <span v-if="isClientLinkedUser" class="text-xs text-gray-500 ml-2"
                  >(Fixed for client users)</span
                ></label
              >
              <div
                v-if="isClientLinkedUser"
                class="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    :value="14"
                    checked
                    disabled
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-text-primary font-medium">Client</span>
                  <span class="text-xs text-gray-500">(Automatically assigned)</span>
                </div>
              </div>
              <div
                v-else
                class="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3"
              >
                <label
                  v-for="orgRole in availableOrganizationRoles"
                  :key="orgRole.id"
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    :value="orgRole.id"
                    v-model="form.organization_role_ids"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-text-primary">{{ orgRole.name }}</span>
                </label>
              </div>
              <p class="text-xs text-text-secondary mt-1">
                <span v-if="isClientLinkedUser"
                  >Organization role is automatically set to Client and cannot be changed</span
                >
                <span v-else
                  >Select one or more organization roles (Client role is reserved for client
                  persons)</span
                >
              </p>
            </div>
            <div v-if="isAMSelected">
              <label class="block text-sm font-medium text-text-primary mb-2">Assigned PM</label>
              <select v-model="form.assigned_pm_id" class="input">
                <option value="">Select PM (optional)</option>
                <option v-for="pm in pmUsers" :key="pm.id" :value="pm.id">
                  {{ pm.name }} ({{ pm.email }})
                </option>
              </select>
              <p class="text-xs text-text-secondary mt-1">Select a PM to assign to this AM</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Timezone</label>
              <select v-model="form.timezone" class="input">
                <option v-for="timezone in timezones" :key="timezone.value" :value="timezone.value">
                  {{ timezone.label }}
                </option>
              </select>
            </div>
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex">
                <svg
                  class="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ error }}</p>
                </div>
              </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="$emit('close')" class="btn-outline">Cancel</button>
              <button type="submit" :disabled="loading" class="btn-primary">
                {{ loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./UserModal.ts"></script>
