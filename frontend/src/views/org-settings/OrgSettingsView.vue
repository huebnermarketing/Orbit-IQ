<template>
  <AppLayout>
    <div class="w-full space-y-8">
      <!-- Header -->
      <div class="card p-6">
        <h1 class="text-3xl font-bold text-text-primary">Organization Settings</h1>
        <p class="text-text-secondary mt-2">Manage your organization's users, settings, and configurations</p>
      </div>

      <!-- Settings Tabs -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Navigation -->
        <div class="lg:col-span-2">
          <nav class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="() => { activeTab = tab.id; saveActiveTab(tab.id) }"
              :class="[
                'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
                activeTab === tab.id
                  ? 'org-nav-active'
                  : 'org-nav-inactive'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-3" />
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
              
              <!-- Success Message -->
              <div v-if="orgProfileSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <div class="flex">
                  <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-green-800">{{ orgProfileSuccess }}</p>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="orgProfileError" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <div class="flex">
                  <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
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
                    <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        v-if="orgProfile.logo" 
                        :src="`/storage/${orgProfile.logo}`" 
                        alt="Company Logo"
                        class="w-full h-full object-cover"
                      />
                      <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div>
                      <input
                        ref="logoInput"
                        type="file"
                        accept="image/*"
                        @change="handleLogoUpload"
                        class="hidden"
                      />
                      <button
                        type="button"
                        @click="$refs.logoInput.click()"
                        class="btn-outline"
                      >
                        Upload Logo
                      </button>
                      <p class="text-xs text-text-secondary mt-1">Recommended: 200x200px, PNG or JPG</p>
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
                  <label class="block text-sm font-medium text-text-primary mb-2">Default Timezone</label>
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
                  <button
                    type="button"
                    @click="resetOrgProfile"
                    class="btn-outline"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    :disabled="orgProfileLoading"
                    class="btn-primary"
                  >
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
                              {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
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

          <!-- Organization Roles Tab -->
          <div v-if="activeTab === 'org-roles'" class="space-y-6">
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
                        <div class="flex items-center">
                          <div class="flex -space-x-2">
                            <div 
                              v-for="user in getRoleUsers(role.id).slice(0, 5)" 
                              :key="user.id"
                              class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-white"
                            >
                              <img 
                                v-if="user.avatar" 
                                :src="`/storage/${user.avatar}`" 
                                :alt="user.name"
                                class="w-full h-full object-cover"
                              />
                              <span v-else class="text-white font-medium text-xs">
                                {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
                              </span>
                            </div>
                            <div 
                              v-if="getRoleUsers(role.id).length > 5"
                              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span class="text-gray-500 text-xs">+{{ getRoleUsers(role.id).length - 5 }}</span>
                            </div>
                            <div 
                              v-if="getRoleUsers(role.id).length === 0"
                              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span class="text-gray-500 text-xs">0</span>
                            </div>
                          </div>
                          <div class="ml-3 relative group">
                            <span 
                              class="text-sm text-text-secondary cursor-help"
                              @mouseenter="showTooltip($event, role)"
                              @mouseleave="hideTooltip"
                            >
                              {{ role.users_count }} users
                            </span>
                          </div>
                        </div>
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
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <div class="flex items-center justify-end space-x-2">
                          <div class="relative group">
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
                            <!-- Tooltip for disabled Edit button -->
                            <div 
                              v-if="role.is_locked"
                              class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-max"
                            >
                              This is a system-defined role and cannot be updated
                              <div class="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
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
                          <div
                            v-if="role.is_locked"
                            class="text-gray-400 relative group p-1"
                            title="This is a system-defined role and cannot be updated"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            <!-- Tooltip -->
                            <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-max">
                              This is a system-defined role and cannot be updated
                              <div class="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
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

          <!-- Teams Tab -->
          <div v-if="activeTab === 'teams'" class="space-y-6">
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
              <div class="overflow-hidden shadow ring-1 ring-border-light ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-border-light">
                  <thead class="bg-surface-alt">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Team
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Description
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Members
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-surface divide-y divide-border-light">
                    <tr v-for="team in teams" :key="team.id" class="hover:bg-surface-alt">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div 
                            class="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                            :style="{ backgroundColor: team.color }"
                          ></div>
                          <div>
                            <div class="text-sm font-medium text-text-primary">{{ team.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-text-primary max-w-xs">
                          <p v-if="team.description" class="truncate">{{ team.description }}</p>
                          <p v-else class="text-text-muted italic">No description</p>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex -space-x-2">
                            <div 
                              v-for="member in getTeamMembers(team.id).slice(0, 3)" 
                              :key="member.id"
                              class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-white"
                            >
                              <img 
                                v-if="member.avatar" 
                                :src="`/storage/${member.avatar}`" 
                                :alt="member.name"
                                class="w-full h-full object-cover"
                              />
                              <span v-else class="text-white font-medium text-xs">
                                {{ member.name?.charAt(0)?.toUpperCase() || 'U' }}
                              </span>
                            </div>
                            <div 
                              v-if="getTeamMembers(team.id).length > 3"
                              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span class="text-gray-500 text-xs">+{{ getTeamMembers(team.id).length - 3 }}</span>
                            </div>
                            <div 
                              v-if="getTeamMembers(team.id).length === 0"
                              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span class="text-gray-500 text-xs">0</span>
                            </div>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm text-text-primary">{{ getTeamMembers(team.id).length }} members</div>
                          </div>
                        </div>
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
                          <button
                            @click="editTeam(team)"
                            class="text-primary-600 hover:text-primary-900"
                            title="Edit team"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            @click="deleteTeam(team)"
                            class="text-error-600 hover:text-error-900"
                            title="Delete team"
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
              <div v-if="teams.length === 0" class="text-center py-12">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-text-primary mb-2">No Teams</h3>
                <p class="text-text-secondary mb-4">Create teams to organize your team members by skills or projects.</p>
                <button
                  @click="showCreateTeamModal = true"
                  class="btn-primary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Create First Team
                </button>
              </div>
            </div>
          </div>

          <!-- User Groups Tab -->
          <div v-if="activeTab === 'user-groups'" class="space-y-6">
            <div class="card p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-text-primary">User Groups</h3>
                <button
                  @click="showCreateUserGroupModal = true"
                  class="btn-primary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Group
                </button>
              </div>

              <!-- User Groups Table -->
              <div class="overflow-hidden shadow ring-1 ring-border-light ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-border-light">
                  <thead class="bg-surface-alt">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Group
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Description
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Members
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-surface divide-y divide-border-light">
                    <tr v-for="group in userGroups" :key="group.id" class="hover:bg-surface-alt">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div 
                            class="w-4 h-4 rounded-full mr-3"
                            :style="{ backgroundColor: group.color }"
                          ></div>
                          <div class="text-sm font-medium text-text-primary">{{ group.name }}</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-text-primary">{{ group.description || '-' }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex -space-x-2">
                            <div 
                              v-for="user in group.users.slice(0, 3)" 
                              :key="user.id"
                              class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-white"
                            >
                              <img 
                                v-if="user.avatar" 
                                :src="`/storage/${user.avatar}`" 
                                :alt="user.name"
                                class="w-full h-full object-cover"
                              />
                              <span v-else class="text-white font-medium text-xs">
                                {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
                              </span>
                            </div>
                            <div 
                              v-if="group.users.length > 3"
                              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span class="text-gray-500 text-xs">+{{ group.users.length - 3 }}</span>
                            </div>
                            <div 
                              v-if="group.users.length === 0"
                              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span class="text-gray-500 text-xs">0</span>
                            </div>
                          </div>
                          <div class="ml-3 relative group">
                            <span 
                              class="text-sm text-text-secondary cursor-help"
                              @mouseenter="showGroupTooltip($event, group)"
                              @mouseleave="hideTooltip"
                            >
                              {{ group.users.length }} members
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          :class="[
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            group.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          ]"
                        >
                          {{ group.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="editUserGroup(group)"
                            class="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                            title="Edit group"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            @click="deleteUserGroup(group)"
                            class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete group"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="userGroups.length === 0">
                      <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                        No user groups found. Create your first group to get started.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Client Management Tab -->
          <div v-if="activeTab === 'clients'" class="space-y-6">
            <div class="card p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-text-primary">Client Management</h3>
                <div class="flex items-center space-x-3">
                  <button
                    @click="exportClientsToExcel"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Export Excel
                  </button>
                  <button
                    @click="showCreateClientModal = true"
                    class="btn-primary"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Client
                  </button>
            </div>
          </div>

              <!-- Search and Filters -->
              <div class="flex flex-col lg:flex-row gap-4 mb-6">
                <div class="flex-1">
                  <input
                    v-model="clientSearchQuery"
                    type="text"
                    placeholder="Search by company name..."
                    class="input"
                    @input="filterClients"
                  />
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                  <select v-model="clientTypeFilter" @change="filterClients" class="input w-full sm:w-40">
                    <option value="">All Types</option>
                    <option value="Agency">Agency</option>
                    <option value="Direct Client">Direct Client</option>
                  </select>
                  <select v-model="clientAMFilter" @change="filterClients" class="input w-full sm:w-48">
                    <option value="">All Account Managers</option>
                    <option v-for="am in accountManagers" :key="am.id" :value="am.id">
                      {{ am.name }}
                    </option>
                  </select>
                  <button
                    @click="clearClientFilters"
                    class="btn-outline text-sm px-4 py-2"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              <!-- Clients Table -->
              <div class="overflow-hidden shadow ring-1 ring-border-light ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-border-light">
                  <thead class="bg-surface-alt">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Company
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Contact
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Account Managers
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Type
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-surface divide-y divide-border-light">
                    <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-surface-alt">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 mr-3">
                            <img 
                              v-if="client.logo_url" 
                              :src="client.logo_url" 
                              :alt="client.company_name"
                              class="w-full h-full object-cover"
                              @error="handleLogoError"
                            />
                            <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                              <span class="text-white font-bold text-sm">
                                {{ client.company_name?.charAt(0)?.toUpperCase() || 'C' }}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-text-primary">{{ client.company_name }}</div>
                            <div class="text-sm text-text-muted">{{ client.website || 'No website' }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div class="text-sm text-text-primary">{{ client.email }}</div>
                          <div class="text-sm text-text-muted">{{ client.phone || 'No phone' }}</div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div v-if="client.primary_account_manager" class="flex items-center">
                          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img 
                              v-if="client.primary_account_manager.avatar" 
                              :src="`/storage/${client.primary_account_manager.avatar}`" 
                              :alt="client.primary_account_manager.name"
                              class="w-full h-full object-cover"
                            />
                            <span v-else class="text-white font-medium text-sm">
                              {{ client.primary_account_manager.name?.charAt(0)?.toUpperCase() || 'U' }}
                            </span>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-text-primary">{{ client.primary_account_manager.name }}</div>
                            <div class="text-sm text-text-muted">{{ client.primary_account_manager.email }}</div>
                          </div>
                        </div>
                        <div v-else class="text-sm text-text-muted">
                          No primary AM assigned
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          :class="[
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            client.client_type === 'Agency' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          ]"
                        >
                          {{ client.client_type }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          :class="[
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            client.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          ]"
                        >
                          {{ client.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="viewClient(client)"
                            class="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                            title="View client"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                          <button
                            @click="editClient(client)"
                            class="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                            title="Edit client"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            @click="deleteClient(client)"
                            class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete client"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredClients.length === 0">
                      <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                        <div v-if="clients.length === 0">
                          No clients found. Create your first client to get started.
                        </div>
                        <div v-else>
                          No clients match your current filters. Try adjusting your search criteria.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Project Status Tab -->
          <div v-if="activeTab === 'project-status'" class="space-y-6">
            <ProjectStatusTab />
          </div>

          <!-- Task Status Tab -->
          <div v-if="activeTab === 'task-status'" class="space-y-6">
            <TaskStatusTab />
            </div>

          <!-- Project Types Tab -->
          <div v-if="activeTab === 'project-types'" class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-text-primary">Project Types</h3>
                <p class="text-text-secondary mt-1">Manage project types for your organization</p>
              </div>
              <button
                @click="showCreateProjectTypeModal = true"
                class="btn-primary"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Project Type
              </button>
          </div>

            <!-- Project Types Table -->
            <div class="card overflow-hidden">
              <div v-if="projectTypesLoading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span class="ml-2 text-text-muted">Loading project types...</span>
              </div>

              <div v-else-if="projectTypes.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-text-primary mb-2">No project types found</h3>
                <p class="text-text-muted mb-4">Get started by creating your first project type.</p>
                <button @click="showCreateProjectTypeModal = true" class="btn-primary">
                  Add Project Type
                </button>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full divide-y divide-border-light">
                  <thead class="bg-surface-alt">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Project Type
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Description
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Sort Order
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-surface divide-y divide-border-light">
                    <tr
                      v-for="projectType in projectTypes"
                      :key="projectType.id"
                      class="hover:bg-surface-alt"
                    >
                      <!-- Project Type Name -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div
                            class="w-4 h-4 rounded-full mr-3"
                            :style="{ backgroundColor: projectType.color }"
                          ></div>
                          <div>
                            <div class="text-sm font-medium text-text-primary">{{ projectType.name }}</div>
                            <div v-if="projectType.is_system_defined" class="text-xs text-text-muted">System Defined</div>
                          </div>
                        </div>
                      </td>

                      <!-- Description -->
                      <td class="px-6 py-4">
                        <div class="text-sm text-text-primary max-w-xs truncate">
                          {{ projectType.description || 'No description' }}
                        </div>
                      </td>

                      <!-- Sort Order -->
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                        {{ projectType.sort_order }}
                      </td>

                      <!-- Status -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          :class="projectType.is_active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {{ projectType.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>

                      <!-- Actions -->
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="editProjectType(projectType)"
                            class="text-primary-600 hover:text-primary-900 transition-colors"
                            title="Edit Project Type"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            v-if="!projectType.is_system_defined"
                            @click="deleteProjectType(projectType)"
                            class="text-error-600 hover:text-error-900 transition-colors"
                            title="Delete Project Type"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                          <button
                            v-else
                            class="text-text-muted cursor-not-allowed"
                            title="System-defined project types cannot be deleted"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          

          <!-- Global Notifications Tab -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Global Notification Settings</h3>
              <p class="text-text-secondary">Global notification settings will be implemented here.</p>
            </div>
          </div>

          <!-- Theme & Colors Tab -->
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

    <!-- Create/Edit User Group Modal -->
    <UserGroupModal
      v-if="showCreateUserGroupModal || showEditUserGroupModal"
      :user-group="editingUserGroup"
      :is-edit="showEditUserGroupModal"
      @close="closeUserGroupModal"
      @saved="handleUserGroupSaved"
    />

    <!-- Create/Edit Client Modal -->
    <ClientModal
      :show="showCreateClientModal || showEditClientModal"
      :client="editingClient"
      :is-edit="showEditClientModal"
      @close="closeClientModal"
      @saved="handleClientSaved"
    />

    <!-- Teleported Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip.visible && (tooltip.role || tooltip.group)"
        class="fixed z-[9999] pointer-events-none"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="bg-gray-900 text-white text-sm rounded-lg shadow-xl p-3 w-[320px] border border-gray-700">
          <div class="font-medium text-white mb-3 text-center">
            Users in {{ tooltip.role ? tooltip.role.name : tooltip.group.name }}
          </div>
          <div class="space-y-2 max-h-[50vh] overflow-y-auto">
            <div 
              v-for="user in getTooltipUsers().sort((a, b) => a.name.localeCompare(b.name))" 
              :key="user.id"
              class="flex items-center space-x-3 hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-150"
            >
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                <img 
                  v-if="user.avatar" 
                  :src="`/storage/${user.avatar}`" 
                  :alt="user.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-white font-medium text-sm">
                  {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-white font-medium truncate">{{ user.name }}</div>
                <div class="text-gray-300 text-xs truncate">{{ user.email }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Project Type Modal -->
    <ProjectTypeModal
      v-if="showCreateProjectTypeModal || showEditProjectTypeModal"
      :show="showCreateProjectTypeModal || showEditProjectTypeModal"
      :project-type="selectedProjectType"
      :is-edit="showEditProjectTypeModal"
      @close="closeProjectTypeModal"
      @saved="handleProjectTypeSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi, clientApi, projectTypeApi } from '@/utils/api'
import { getContrastColor } from '@/utils/colors'
import * as XLSX from 'xlsx'
import AppLayout from '@/components/layout/AppLayout.vue'
import UserModal from '@/components/modals/UserModal.vue'
import ResetPasswordModal from '@/components/modals/ResetPasswordModal.vue'
import OrganizationRoleModal from '@/components/modals/OrganizationRoleModal.vue'
import TeamModal from '@/components/TeamModal.vue'
import UserGroupModal from '@/components/modals/UserGroupModal.vue'
import ClientModal from '@/components/modals/ClientModal.vue'
import ProjectTypeModal from '@/components/modals/ProjectTypeModal.vue'
import ProjectStatusTab from '@/components/org-settings/ProjectStatusTab.vue'
import TaskStatusTab from '@/components/org-settings/TaskStatusTab.vue'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('org-profile')

// Load active tab from localStorage
const loadActiveTab = () => {
  const savedTab = localStorage.getItem('orgSettingsActiveTab')
  if (savedTab && tabs.some(tab => tab.id === savedTab)) {
    activeTab.value = savedTab
  }
}

// Save active tab to localStorage
const saveActiveTab = (tabId: string) => {
  localStorage.setItem('orgSettingsActiveTab', tabId)
}
const users = ref([])
const pagination = ref(null)
const searchQuery = ref('')
const roleFilter = ref('')
const orgRoleFilter = ref('')
const statusFilter = ref('active') // Default to active
const showCreateUserModal = ref(false)
const showEditUserModal = ref(false)

// Organization Roles data
const orgRoles = ref([])
const showCreateOrgRoleModal = ref(false)
const showEditOrgRoleModal = ref(false)
const editingOrgRole = ref(null)
const showResetPasswordModal = ref(false)
const editingUser = ref(null)
const selectedUser = ref(null)

// Teams data
const teams = ref([])
const showCreateTeamModal = ref(false)
const showEditTeamModal = ref(false)
const editingTeam = ref(null)

// User Groups data
const userGroups = ref([])
const showCreateUserGroupModal = ref(false)
const showEditUserGroupModal = ref(false)
const editingUserGroup = ref(null)

// Client Management
const clients = ref([])
const filteredClients = ref([])
const showCreateClientModal = ref(false)
const showEditClientModal = ref(false)
const editingClient = ref(null)

// Project Types data
const projectTypes = ref([])
const projectTypesLoading = ref(false)
const showCreateProjectTypeModal = ref(false)
const showEditProjectTypeModal = ref(false)
const selectedProjectType = ref(null)

// Client search and filters
const clientSearchQuery = ref('')
const clientTypeFilter = ref('')
const clientAMFilter = ref('')
const accountManagers = ref([])

// Tooltip data
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  role: null,
  group: null
})

// Organization Profile
const orgProfile = reactive({
  name: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  timezone: 'UTC',
  logo: null
})
const orgProfileLoading = ref(false)
const orgProfileError = ref('')
const orgProfileSuccess = ref('')

const currentUser = computed(() => authStore.user)

const tabs = [
  {
    id: 'org-profile',
    name: 'Company Profile',
    icon: 'svg'
  },
  {
    id: 'users',
    name: 'User Management',
    icon: 'svg'
  },
  {
    id: 'org-roles',
    name: 'Org. Roles',
    icon: 'svg'
  },
  {
    id: 'teams',
    name: 'Teams',
    icon: 'svg'
  },
  {
    id: 'user-groups',
    name: 'User Groups',
    icon: 'svg'
  },
  {
    id: 'clients',
    name: 'Client Management',
    icon: 'svg'
  },
  {
    id: 'project-status',
    name: 'Project Status',
    icon: 'svg'
  },
  {
    id: 'task-status',
    name: 'Task Status',
    icon: 'svg'
  },
  {
    id: 'project-types',
    name: 'Project Types',
    icon: 'svg'
  },
  {
    id: 'notifications',
    name: 'Global Notifications',
    icon: 'svg'
  }
]

onMounted(() => {
  loadActiveTab()
  loadUsers()
  loadOrgProfile()
  loadOrgRoles()
  loadTeams()
  loadUserGroups()
  loadClients()
  loadAccountManagers()
})

const loadUsers = async (page = 1) => {
  try {
    const params: any = {
      page: page.toString(),
      per_page: '15',
      sort_by: 'name',
      sort_order: 'asc'
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (roleFilter.value) {
      params.role = roleFilter.value
    }
    
    if (orgRoleFilter.value) {
      params.organization_role_id = orgRoleFilter.value
    }
    
    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    const response = await authApi.getUsers(params)
    users.value = response.data
    pagination.value = {
      current_page: response.current_page,
      from: response.from,
      to: response.to,
      total: response.total,
      prev_page_url: response.prev_page_url,
      next_page_url: response.next_page_url
    }
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

const searchUsers = () => {
  loadUsers(1)
}

const filterUsers = () => {
  loadUsers(1)
}

const editUser = (user) => {
  editingUser.value = user
  showEditUserModal.value = true
}

const resetUserPassword = (user) => {
  selectedUser.value = user
  showResetPasswordModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
    return
  }

  try {
    await authApi.deleteUser(user.id)
    await loadUsers()
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

const canDeleteUser = (user) => {
  // Cannot delete yourself
  if (currentUser.value?.id === user.id) {
    return false
  }
  
  // Regular admins cannot delete super admins
  if (!currentUser.value?.isSuperAdmin && user.role === 'super_admin') {
    return false
  }
  
  return true
}

const closeUserModal = () => {
  showCreateUserModal.value = false
  showEditUserModal.value = false
  editingUser.value = null
}

const handleUserSaved = () => {
  closeUserModal()
  // Refresh all related data when user is saved
  loadUsers()
  loadOrgRoles()
  loadTeams()
  loadUserGroups()
}

const handlePasswordReset = () => {
  showResetPasswordModal.value = false
  selectedUser.value = null
}

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800'
    case 'admin':
      return 'bg-blue-100 text-blue-800'
    case 'user':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatRole = (role) => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'user':
      return 'User'
    default:
      return role
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// Organization Profile Methods
const loadOrgProfile = async () => {
  try {
    const response = await authApi.getOrganizationProfile()
    Object.assign(orgProfile, response)
  } catch (error) {
    console.error('Failed to load organization profile:', error)
    // Fallback to default values
    orgProfile.name = 'Orbit IQ Organization'
    orgProfile.description = 'A modern project management platform for teams'
    orgProfile.email = 'contact@orbitiq.com'
    orgProfile.phone = '+1 (555) 123-4567'
    orgProfile.address = '123 Business St, Suite 100\nSan Francisco, CA 94105'
    orgProfile.website = 'https://www.orbitiq.com'
    orgProfile.timezone = 'UTC'
  }
}

const handleOrgProfileSubmit = async () => {
  orgProfileLoading.value = true
  orgProfileError.value = ''
  orgProfileSuccess.value = ''

  try {
    await authApi.updateOrganizationProfile(orgProfile)
    
    orgProfileSuccess.value = 'Company profile updated successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      orgProfileSuccess.value = ''
    }, 3000)
  } catch (error) {
    orgProfileError.value = error.response?.data?.message || 'Failed to update company profile. Please try again.'
  } finally {
    orgProfileLoading.value = false
  }
}

const handleLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const response = await authApi.uploadOrganizationLogo(file)
    
    orgProfile.logo = response.logo
    orgProfileSuccess.value = 'Logo uploaded successfully!'
    
    setTimeout(() => {
      orgProfileSuccess.value = ''
    }, 3000)
  } catch (error) {
    orgProfileError.value = error.response?.data?.message || 'Failed to upload logo. Please try again.'
  }
}

const resetOrgProfile = () => {
  loadOrgProfile()
  orgProfileError.value = ''
  orgProfileSuccess.value = ''
}

// Organization Roles methods
const loadOrgRoles = async () => {
  try {
    const response = await authApi.getOrganizationRoles()
    orgRoles.value = response
  } catch (error) {
    console.error('Failed to load organization roles:', error)
  }
}

const editOrgRole = (role) => {
  editingOrgRole.value = role
  showEditOrgRoleModal.value = true
}

const deleteOrgRole = async (role) => {
  if (role.is_locked) {
    alert('System roles cannot be deleted.')
    return
  }
  
  if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
    try {
      await authApi.deleteOrganizationRole(role.id)
      await loadOrgRoles()
    } catch (error) {
      console.error('Failed to delete organization role:', error)
      alert('Failed to delete role. Please try again.')
    }
  }
}

const getRoleUsers = (roleId) => {
  const role = orgRoles.value.find(r => r.id === roleId)
  return role?.users || []
}

const getGroupUsers = (groupId) => {
  const group = userGroups.value.find(g => g.id === groupId)
  return group?.users || []
}

const getTooltipUsers = () => {
  if (tooltip.role) {
    return getRoleUsers(tooltip.role.id)
  } else if (tooltip.group) {
    return getGroupUsers(tooltip.group.id)
  }
  return []
}

const showTooltip = (event, role) => {
  if (getRoleUsers(role.id).length === 0) return
  
  // Get the actual trigger element (the span with the user count)
  const triggerElement = event.currentTarget
  const rect = triggerElement.getBoundingClientRect()
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const tooltipWidth = 320
  const padding = 20
  const gap = 15 // Gap between tooltip and trigger element
  
  // Calculate actual tooltip height based on number of users
  const userCount = getRoleUsers(role.id).length
  const headerHeight = 60 // Title + padding
  const userItemHeight = 50 // Each user row height
  const actualTooltipHeight = headerHeight + (userCount * userItemHeight)
  
  // Calculate horizontal center position
  let x = rect.left + (rect.width / 2) - (tooltipWidth / 2)
  
  // Determine vertical position - try above first, then below
  let y
  const spaceAbove = rect.top - padding
  const spaceBelow = viewportHeight - rect.bottom - padding
  
  if (spaceAbove >= actualTooltipHeight + gap) {
    // Position above the trigger element
    y = rect.top - actualTooltipHeight - gap
  } else if (spaceBelow >= actualTooltipHeight + gap) {
    // Position below the trigger element
    y = rect.bottom + gap
  } else {
    // Not enough space above or below, position where there's most space
    if (spaceAbove > spaceBelow) {
      y = Math.max(padding, rect.top - actualTooltipHeight - gap)
    } else {
      y = Math.min(viewportHeight - actualTooltipHeight - padding, rect.bottom + gap)
    }
  }
  
  // Adjust horizontal position if tooltip would be cut off
  if (x + tooltipWidth > viewportWidth - padding) {
    x = viewportWidth - tooltipWidth - padding
  }
  if (x < padding) {
    x = padding
  }
  
  // Ensure tooltip is always within viewport bounds
  tooltip.x = Math.max(padding, Math.min(x, viewportWidth - tooltipWidth - padding))
  tooltip.y = Math.max(padding, Math.min(y, viewportHeight - actualTooltipHeight - padding))
  tooltip.role = role
  tooltip.visible = true
}

const showGroupTooltip = (event, group) => {
  if (getGroupUsers(group.id).length === 0) return
  
  // Get the actual trigger element (the span with the user count)
  const triggerElement = event.currentTarget
  const rect = triggerElement.getBoundingClientRect()
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const tooltipWidth = 320
  const padding = 20
  const gap = 15 // Gap between tooltip and trigger element
  
  // Calculate actual tooltip height based on number of users
  const userCount = getGroupUsers(group.id).length
  const headerHeight = 60 // Title + padding
  const userItemHeight = 50 // Each user row height
  const actualTooltipHeight = headerHeight + (userCount * userItemHeight)
  
  // Calculate horizontal center position
  let x = rect.left + (rect.width / 2) - (tooltipWidth / 2)
  
  // Determine vertical position - try above first, then below
  let y
  const spaceAbove = rect.top - padding
  const spaceBelow = viewportHeight - rect.bottom - padding
  
  if (spaceAbove >= actualTooltipHeight) {
    y = rect.top - actualTooltipHeight - gap
  } else {
    if (spaceBelow >= actualTooltipHeight) {
      y = rect.bottom + gap
    } else {
      y = Math.min(viewportHeight - actualTooltipHeight - padding, rect.bottom + gap)
    }
  }
  
  // Adjust horizontal position if tooltip would be cut off
  if (x + tooltipWidth > viewportWidth - padding) {
    x = viewportWidth - tooltipWidth - padding
  }
  if (x < padding) {
    x = padding
  }
  
  // Ensure tooltip is always within viewport bounds
  tooltip.x = Math.max(padding, Math.min(x, viewportWidth - tooltipWidth - padding))
  tooltip.y = Math.max(padding, Math.min(y, viewportHeight - actualTooltipHeight - padding))
  tooltip.group = group
  tooltip.role = null // Clear role when showing group tooltip
  tooltip.visible = true
}

const hideTooltip = () => {
  tooltip.visible = false
  tooltip.role = null
  tooltip.group = null
}

const handleOrgRoleSuccess = () => {
  showCreateOrgRoleModal.value = false
  showEditOrgRoleModal.value = false
  editingOrgRole.value = null
  // Refresh all related data when org role is saved
  loadOrgRoles()
  loadUsers()
  loadAccountManagers() // Refresh AM list for client management
}

const handleTeamSuccess = () => {
  showCreateTeamModal.value = false
  showEditTeamModal.value = false
  editingTeam.value = null
  // Refresh all related data when team is saved
  loadTeams()
  loadUsers()
}

// Teams methods
const loadTeams = async () => {
  try {
    const response = await authApi.getTeams()
    teams.value = response
    
    // Load team members for each team
    for (const team of teams.value) {
      try {
        const teamDetails = await authApi.getTeam(team.id)
        team.members = teamDetails.members || []
      } catch (error) {
        console.error(`Failed to load members for team ${team.name}:`, error)
        team.members = []
      }
    }
  } catch (error) {
    console.error('Failed to load teams:', error)
  }
}

const editTeam = (team) => {
  editingTeam.value = team
  showEditTeamModal.value = true
}

const deleteTeam = async (team) => {
  if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
    try {
      await authApi.deleteTeam(team.id)
      await loadTeams()
    } catch (error) {
      console.error('Failed to delete team:', error)
      alert('Failed to delete team. Please try again.')
    }
  }
}

// User Groups methods
const loadUserGroups = async () => {
  try {
    const response = await authApi.getUserGroups()
    userGroups.value = response.data || []
  } catch (error) {
    console.error('Failed to load user groups:', error)
  }
}

const editUserGroup = (userGroup) => {
  editingUserGroup.value = userGroup
  showEditUserGroupModal.value = true
}

const deleteUserGroup = async (userGroup) => {
  if (confirm(`Are you sure you want to delete the group "${userGroup.name}"?`)) {
    try {
      await authApi.deleteUserGroup(userGroup.id)
      await loadUserGroups()
    } catch (error) {
      console.error('Failed to delete user group:', error)
      alert('Failed to delete user group. Please try again.')
    }
  }
}

const closeUserGroupModal = () => {
  showCreateUserGroupModal.value = false
  showEditUserGroupModal.value = false
  editingUserGroup.value = null
}

const handleUserGroupSaved = () => {
  closeUserGroupModal()
  // Refresh all related data when user group is saved
  loadUserGroups()
  loadUsers()
}

// Client Management Methods
const loadClients = async () => {
  try {
    const response = await clientApi.getClients()
    clients.value = response.data || []
    // Initialize filtered clients and apply any existing filters
    filterClients()
  } catch (error) {
    console.error('Failed to load clients:', error)
  }
}

const editClient = (client) => {
  editingClient.value = { ...client }
  showEditClientModal.value = true
}

const deleteClient = async (client) => {
  if (confirm(`Are you sure you want to delete ${client.company_name}?`)) {
    try {
      await clientApi.deleteClient(client.id)
      console.log('Client deleted successfully')
      loadClients()
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
  }
}

const viewClient = (client) => {
  // Navigate to client detail view
  router.push(`/clients/${client.id}`)
}

const closeClientModal = () => {
  showCreateClientModal.value = false
  showEditClientModal.value = false
  editingClient.value = null
}

const handleClientSaved = () => {
  loadClients()
  closeClientModal()
}

// Project Type methods
const loadProjectTypes = async () => {
  projectTypesLoading.value = true
  try {
    const response = await projectTypeApi.getProjectTypes()
    projectTypes.value = response.data || []
  } catch (error) {
    console.error('Failed to load project types:', error)
  } finally {
    projectTypesLoading.value = false
  }
}

const editProjectType = (projectType) => {
  selectedProjectType.value = projectType
  showEditProjectTypeModal.value = true
}

const deleteProjectType = async (projectType) => {
  if (!confirm(`Are you sure you want to delete "${projectType.name}"?`)) {
    return
  }

  try {
    await projectTypeApi.deleteProjectType(projectType.id.toString())
    await loadProjectTypes()
  } catch (error) {
    console.error('Failed to delete project type:', error)
    alert('Failed to delete project type. Please try again.')
  }
}

const closeProjectTypeModal = () => {
  showCreateProjectTypeModal.value = false
  showEditProjectTypeModal.value = false
  selectedProjectType.value = null
}

const handleProjectTypeSaved = () => {
  loadProjectTypes()
  closeProjectTypeModal()
}

// Watch for tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'project-types') {
    loadProjectTypes()
  }
}, { immediate: true })

// Load account managers for filter dropdown
const loadAccountManagers = async () => {
  try {
    const response = await clientApi.getAccountManagers()
    accountManagers.value = response || []
  } catch (error) {
    console.error('Failed to load account managers:', error)
  }
}

// Filter clients based on search and filter criteria
const filterClients = () => {
  let filtered = [...clients.value]

  // Search by company name
  if (clientSearchQuery.value.trim()) {
    const query = clientSearchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(client => 
      client.company_name?.toLowerCase().includes(query)
    )
  }

  // Filter by client type
  if (clientTypeFilter.value) {
    filtered = filtered.filter(client => 
      client.client_type === clientTypeFilter.value
    )
  }

  // Filter by account manager
  if (clientAMFilter.value) {
    filtered = filtered.filter(client => {
      const primaryAMId = client.primary_account_manager?.id
      const secondaryAMIds = client.secondary_account_managers?.map(am => am.id) || []
      return primaryAMId === parseInt(clientAMFilter.value) || 
             secondaryAMIds.includes(parseInt(clientAMFilter.value))
    })
  }

  filteredClients.value = filtered
}

// Clear all filters
const clearClientFilters = () => {
  clientSearchQuery.value = ''
  clientTypeFilter.value = ''
  clientAMFilter.value = ''
  filterClients()
}

// Export clients to Excel
const exportClientsToExcel = () => {
  // Create a new workbook
  const wb = XLSX.utils.book_new()
  
  // Prepare data for export
  const exportData = filteredClients.value.map(client => ({
    'Company Name': client.company_name || '',
    'Email': client.email || '',
    'Phone': client.phone || '',
    'Website': client.website || '',
    'Address': client.address || '',
    'Client Type': client.client_type || '',
    'Status': client.is_active ? 'Active' : 'Inactive',
    'Primary Account Manager': client.primary_account_manager?.name || '',
    'Secondary Account Managers': client.secondary_account_managers?.map(am => am.name).join(', ') || '',
    'Created Date': client.created_at ? new Date(client.created_at).toLocaleDateString() : ''
  }))

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData)
  
  // Set column widths
  const colWidths = [
    { wch: 25 }, // Company Name
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 25 }, // Website
    { wch: 40 }, // Address
    { wch: 15 }, // Client Type
    { wch: 10 }, // Status
    { wch: 25 }, // Primary AM
    { wch: 30 }, // Secondary AMs
    { wch: 15 }  // Created Date
  ]
  ws['!cols'] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Clients')
  
  // Generate filename with current date
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  const filename = `clients_export_${dateStr}.xlsx`
  
  // Save file
  XLSX.writeFile(wb, filename)
}

const getTotalAccountManagers = (client) => {
  let count = 0
  if (client.primary_account_manager) count++
  if (client.secondary_account_managers) count += client.secondary_account_managers.length
  return count
}

const handleLogoError = (event) => {
  // Hide the broken image and show the fallback
  event.target.style.display = 'none'
  const fallback = event.target.nextElementSibling
  if (fallback) {
    fallback.style.display = 'flex'
  }
}


const getTeamMembers = (teamId) => {
  const team = teams.value.find(t => t.id === teamId)
  return team?.members || []
}

const manageTeamMembers = (team) => {
  // This will open a modal to manage team members
  console.log('Manage team members for:', team.name)
}

// Watch for tab changes and refresh relevant data
watch(activeTab, (newTab, oldTab) => {
  // Only refresh if we're actually switching tabs (not initial load)
  if (oldTab && newTab !== oldTab) {
    switch (newTab) {
      case 'users':
        // Refresh users and org roles data when switching to user management
        loadUsers()
        loadOrgRoles()
        break
      case 'org-roles':
        // Refresh org roles and users data when switching to org roles
        loadOrgRoles()
        loadUsers()
        break
      case 'teams':
        // Refresh teams and users data when switching to teams
        loadTeams()
        loadUsers()
        break
      case 'user-groups':
        // Refresh user groups and users data when switching to user groups
        loadUserGroups()
        loadUsers()
        break
      case 'clients':
        // Refresh clients and account managers data when switching to clients
        loadClients()
        loadAccountManagers()
        break
      case 'project-status':
        // Project status data is handled by the ProjectStatusTab component
        break
      case 'task-status':
        // Task status data is handled by the TaskStatusTab component
        break
      default:
        // For other tabs, no specific refresh needed
        break
    }
  }
})
</script>
