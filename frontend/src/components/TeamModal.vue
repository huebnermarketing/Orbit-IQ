<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEdit ? 'Edit Team' : 'Create New Team' }}
        </h3>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="space-y-4">
          <!-- Team Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter team name"
            />
            <div v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name[0] }}</div>
          </div>

          <!-- Team Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter team description"
            ></textarea>
            <div v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description[0] }}</div>
          </div>

          <!-- Team Color -->
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">
              Team Color *
            </label>
            <div class="flex items-center space-x-3">
              <input
                id="color"
                v-model="form.color"
                type="color"
                required
                class="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                v-model="form.color"
                type="text"
                required
                pattern="^#[0-9A-Fa-f]{6}$"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="#3B82F6"
              />
            </div>
            <div v-if="errors.color" class="text-red-500 text-sm mt-1">{{ errors.color[0] }}</div>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              id="is_active"
              v-model="form.is_active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="is_active" class="ml-2 block text-sm text-gray-700">
              Active Team
            </label>
          </div>

          <!-- Team Members -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            
            <!-- Multiselect Dropdown -->
            <div class="relative" ref="dropdownContainer">
              <!-- Dropdown Trigger -->
              <button
                type="button"
                @click="toggleUserDropdown"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left bg-white"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">
                    {{ form.member_ids.length > 0 
                      ? `${form.member_ids.length} user${form.member_ids.length > 1 ? 's' : ''} selected` 
                      : 'Select team members...' 
                    }}
                  </span>
                  <svg 
                    class="w-5 h-5 text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': showUserDropdown }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>
            </div>

            <!-- Teleported Dropdown Content -->
            <Teleport to="body">
              <div 
                v-if="showUserDropdown && dropdownPosition"
                class="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-xl max-h-64 overflow-y-auto"
                :style="{
                  left: dropdownPosition.x + 'px',
                  top: dropdownPosition.y + 'px',
                  width: dropdownPosition.width + 'px'
                }"
              >
                <!-- Search Input -->
                <div class="p-3 border-b border-gray-200">
                  <input
                    v-model="userSearchQuery"
                    type="text"
                    placeholder="Search users..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    @click.stop
                  />
                </div>

                <!-- Users List -->
                <div class="py-1">
                  
                  <div v-if="filteredUsers.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
                    {{ userSearchQuery ? 'No users found matching your search.' : 'No users available.' }}
                  </div>
                  
                  <div
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    @click.stop="toggleUserInTeam(user.id)"
                  >
                    <div class="flex items-center space-x-3">
                      <!-- Checkbox -->
                      <input
                        type="checkbox"
                        :checked="isUserInTeam(user.id)"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        @click.stop="toggleUserInTeam(user.id)"
                      />
                      
                      <!-- User Avatar -->
                      <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden">
                        <img 
                          v-if="user.avatar" 
                          :src="`/storage/${user.avatar}`" 
                          :alt="user.name"
                          class="w-full h-full object-cover"
                        />
                        <span v-else class="text-white font-medium text-xs">
                          {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                        </span>
                      </div>
                      
                      <!-- User Info -->
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ user?.name || 'Unknown User' }}</div>
                        <div class="text-xs text-gray-500">{{ user?.email || 'No email' }}</div>
                      </div>
                    </div>
                    
                    <!-- Role Selector (only for selected users) -->
                    <div v-if="isUserInTeam(user.id)" class="ml-2">
                      <select
                        :value="getUserRole(user.id)"
                        @change="updateUserRole(user.id, $event.target.value)"
                        @click.stop
                        class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="member">Member</option>
                        <option value="lead">Lead</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </Teleport>

            <!-- Selected Team Members Summary -->
            <div v-if="form.member_ids.length > 0" class="mt-3 p-3 bg-gray-50 rounded-md">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Selected Team Members ({{ form.member_ids.length }})
              </div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="memberId in form.member_ids"
                  :key="memberId"
                  class="flex items-center space-x-2 bg-white px-2 py-1 rounded-md border text-xs"
                >
                  <div class="w-5 h-5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      v-if="getUserById(memberId)?.avatar" 
                      :src="`/storage/${getUserById(memberId)?.avatar}`" 
                      :alt="getUserById(memberId)?.name || 'User'"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white font-medium text-xs">
                      {{ getUserById(memberId)?.name?.charAt(0)?.toUpperCase() || 'U' }}
                    </span>
                  </div>
                  <span class="text-gray-700">{{ getUserById(memberId)?.name || 'Unknown User' }}</span>
                  <span class="text-gray-500">({{ getUserRole(memberId) }})</span>
                  <button
                    @click="toggleUserInTeam(memberId)"
                    class="text-red-500 hover:text-red-700 ml-1"
                    title="Remove user"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (isEdit ? 'Update Team' : 'Create Team') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import { authApi } from '@/utils/api'

interface Props {
  team?: any
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  team: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  success: []
}>()

const loading = ref(false)
const errors = ref({})
const users = ref([])
const userSearchQuery = ref('')
const showUserDropdown = ref(false)
const dropdownPosition = ref(null)
const dropdownContainer = ref(null)

const form = reactive({
  name: '',
  description: '',
  color: '#3B82F6',
  is_active: true,
  member_ids: [],
  member_roles: {} // userId -> role mapping
})

// Computed properties
const filteredUsers = computed(() => {
  if (!users.value || !Array.isArray(users.value)) {
    return []
  }
  
  // Filter out null/undefined users first
  const validUsers = users.value.filter(user => user && user.id)
  
  let result = validUsers
  
  // Apply search filter if query exists
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase()
    result = validUsers.filter(user => 
      (user.name && user.name.toLowerCase().includes(query)) || 
      (user.email && user.email.toLowerCase().includes(query))
    )
  }
  
  // Sort users alphabetically by name
  result = result.sort((a, b) => {
    const nameA = (a.name || '').toLowerCase()
    const nameB = (b.name || '').toLowerCase()
    return nameA.localeCompare(nameB)
  })
  
  return result
})

// Watch for team prop changes
watch(() => props.team, (newTeam) => {
  if (newTeam) {
    form.name = newTeam.name || ''
    form.description = newTeam.description || ''
    form.color = newTeam.color || '#3B82F6'
    form.is_active = newTeam.is_active !== false
    
    // Load team members
    if (newTeam.members) {
      form.member_ids = newTeam.members.map(member => member.id)
      form.member_roles = {}
      newTeam.members.forEach(member => {
        form.member_roles[member.id] = member.pivot?.role || 'member'
      })
    }
  }
}, { immediate: true })

// Load users function
const loadUsers = async () => {
  try {
    // Request all users without pagination
    const response = await authApi.getUsers({ per_page: 1000 })
    
    // Handle paginated response structure
    if (response && response.data && Array.isArray(response.data)) {
      users.value = response.data
    } else if (response && Array.isArray(response)) {
      users.value = response
    } else if (response && response.users && Array.isArray(response.users)) {
      users.value = response.users
    } else {
      users.value = []
    }
  } catch (error) {
    console.error('Failed to load users:', error)
    users.value = []
  }
}

// Load users on component mount
onMounted(() => {
  loadUsers()
})

// Dropdown management
const toggleUserDropdown = () => {
  if (!showUserDropdown.value) {
    // Opening dropdown - calculate position
    if (dropdownContainer.value) {
      const rect = dropdownContainer.value.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      
      // Calculate position below the trigger
      let top = rect.bottom + 4 // 4px gap
      let left = rect.left
      let width = rect.width
      
      // Adjust if dropdown would go off screen
      if (top + 256 > viewportHeight) { // 256px is max-h-64
        top = rect.top - 256 - 4 // Position above instead
      }
      
      if (left + width > viewportWidth) {
        left = viewportWidth - width - 16 // 16px margin
      }
      
      if (left < 16) {
        left = 16
      }
      
      dropdownPosition.value = {
        x: left,
        y: top,
        width: width
      }
    }
  } else {
    // Closing dropdown
    dropdownPosition.value = null
  }
  
  showUserDropdown.value = !showUserDropdown.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && !event.target.closest('.fixed')) {
    showUserDropdown.value = false
    dropdownPosition.value = null
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Clean up listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// User management methods
const isUserInTeam = (userId) => {
  return form.member_ids.includes(userId)
}

const getUserRole = (userId) => {
  return form.member_roles[userId] || 'member'
}

const getUserById = (userId) => {
  if (!users.value || !Array.isArray(users.value)) return null
  return users.value.find(user => user && user.id === userId)
}

const toggleUserInTeam = (userId) => {
  if (isUserInTeam(userId)) {
    // Remove user from team
    form.member_ids = form.member_ids.filter(id => id !== userId)
    delete form.member_roles[userId]
  } else {
    // Add user to team
    form.member_ids.push(userId)
    form.member_roles[userId] = 'member'
  }
}

const updateUserRole = (userId, role) => {
  form.member_roles[userId] = role
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    // Prepare team data (exclude member management for now)
    const teamData = {
      name: form.name,
      description: form.description,
      color: form.color,
      is_active: form.is_active
    }

    if (props.isEdit && props.team) {
      await authApi.updateTeam(props.team.id, teamData)
      
      // Handle member changes separately
      if (form.member_ids.length > 0) {
        await authApi.addTeamMembers(props.team.id, {
          user_ids: form.member_ids,
          roles: form.member_roles
        })
      }
    } else {
      const newTeam = await authApi.createTeam(teamData)
      
      // Add members to new team
      if (form.member_ids.length > 0) {
        await authApi.addTeamMembers(newTeam.team.id, {
          user_ids: form.member_ids,
          roles: form.member_roles
        })
      }
    }
    
    emit('success')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    } else {
      console.error('Failed to save team:', error)
      alert('Failed to save team. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>
