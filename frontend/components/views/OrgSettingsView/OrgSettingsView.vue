<template>
  <div class="w-full space-y-8">
    <!-- Header -->
    <div class="card p-6">
      <h1 class="text-3xl font-bold text-text-primary">Organization Settings</h1>
      <p class="text-text-secondary mt-2">
        Manage your organization's users, settings, and configurations
      </p>
    </div>

    <!-- Settings Tabs -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Navigation -->
      <div class="lg:col-span-2">
        <nav class="space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
              activeTab === tab.id
                ? 'bg-primary-100 text-primary-800 font-medium'
                : 'text-text-secondary hover:bg-surface-alt',
            ]"
          >
            <i :class="tab.icon" class="w-5 h-5 mr-3"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="lg:col-span-10">
        <!-- Company Profile Tab -->
        <div v-if="activeTab === 'org-profile'" class="space-y-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-6">Company Profile</h3>

            <!-- Success/Error Messages -->
            <div
              v-if="orgProfileSuccess"
              class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6"
            >
              <div class="flex">
                <i class="fas fa-check-circle text-green-400 mt-0.5"></i>
                <div class="ml-3">
                  <p class="text-sm text-green-800">{{ orgProfileSuccess }}</p>
                </div>
              </div>
            </div>

            <div v-if="orgProfileError" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <div class="flex">
                <i class="fas fa-exclamation-circle text-red-400 mt-0.5"></i>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ orgProfileError }}</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="handleOrgProfileSubmit" class="space-y-6">
              <!-- Company Logo -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Company Logo</label>
                <div class="flex items-center space-x-4">
                  <div
                    class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="orgProfile.logo"
                      :src="`/storage/${orgProfile.logo}`"
                      alt="Company Logo"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="fas fa-building text-white text-2xl"></i>
                  </div>
                  <div>
                    <input
                      ref="logoInput"
                      type="file"
                      accept="image/*"
                      @change="handleLogoUpload"
                      class="hidden"
                    />
                    <button type="button" @click="$refs.logoInput.click()" class="btn-outline btn">
                      Upload Logo
                    </button>
                    <p class="text-xs text-text-secondary mt-1">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>

              <!-- Company Name -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Company Name</label>
                <input
                  v-model="orgProfile.name"
                  type="text"
                  class="input"
                  placeholder="Enter company name"
                  required
                />
              </div>

              <!-- Company Description -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Description</label>
                <textarea
                  v-model="orgProfile.description"
                  class="input"
                  rows="4"
                  placeholder="Enter company description"
                ></textarea>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">Email</label>
                  <input
                    v-model="orgProfile.email"
                    type="email"
                    class="input"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">Phone</label>
                  <input
                    v-model="orgProfile.phone"
                    type="tel"
                    class="input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Address</label>
                <textarea
                  v-model="orgProfile.address"
                  class="input"
                  rows="3"
                  placeholder="Enter company address"
                ></textarea>
              </div>

              <!-- Website -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Website</label>
                <input
                  v-model="orgProfile.website"
                  type="url"
                  class="input"
                  placeholder="https://www.company.com"
                />
              </div>

              <!-- Timezone -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2"
                  >Default Timezone</label
                >
                <select v-model="orgProfile.timezone" class="input">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" @click="resetOrgProfile" class="btn-outline btn">
                  Reset
                </button>
                <button type="submit" :disabled="orgProfileLoading" class="btn-primary btn">
                  {{ orgProfileLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- User Management Tab -->
        <div v-if="activeTab === 'users'" class="space-y-6">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-text-primary">User Management</h3>
              <button @click="handleCreateUser" class="btn-primary btn">
                <i class="fas fa-plus mr-2"></i>
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
                />
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <select v-model="roleFilter" class="input w-full sm:w-40">
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <select v-model="statusFilter" class="input w-full sm:w-32">
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
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-surface divide-y divide-border-light">
                  <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-surface-alt">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden"
                        >
                          <span class="text-white font-medium text-sm">
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
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
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
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          @click="deleteUser(user)"
                          class="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors"
                          title="Delete user"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-if="filteredUsers.length === 0" class="text-center py-12">
              <i class="fas fa-users text-4xl text-gray-400 mb-4"></i>
              <h3 class="text-lg font-medium text-text-primary mb-2">No users found</h3>
              <p class="text-text-secondary">
                {{
                  searchQuery ? 'Try adjusting your search' : 'Add your first user to get started'
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Organization Roles Tab -->
        <div v-if="activeTab === 'org-roles'" class="space-y-6">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-text-primary">Organization Roles</h3>
              <button @click="handleCreateRole" class="btn-primary btn">
                <i class="fas fa-plus mr-2"></i>
                Add Role
              </button>
            </div>

            <!-- Roles Content -->
            <p class="text-text-secondary">Organization roles feature coming soon...</p>
          </div>
        </div>

        <!-- Teams Tab -->
        <div v-if="activeTab === 'teams'" class="space-y-6">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-text-primary">Teams</h3>
              <button @click="handleCreateTeam" class="btn-primary btn">
                <i class="fas fa-plus mr-2"></i>
                Add Team
              </button>
            </div>

            <!-- Teams Content -->
            <p class="text-text-secondary">Teams management feature coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./OrgSettingsView.ts"></script>
<style scoped src="./OrgSettingsView.css"></style>
