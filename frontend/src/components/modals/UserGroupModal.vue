<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-text-primary mb-4">
                  {{ isEdit ? 'Edit User Group' : 'Create User Group' }}
                </h3>

                <!-- Group Name -->
                <div class="mb-4">
                  <label for="name" class="block text-sm font-medium text-text-primary mb-1">
                    Group Name *
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="input"
                    placeholder="Enter group name"
                  />
                </div>

                <!-- Description -->
                <div class="mb-4">
                  <label for="description" class="block text-sm font-medium text-text-primary mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    class="input"
                    placeholder="Enter group description (optional)"
                  ></textarea>
                </div>

                <!-- Group Color -->
                <div class="mb-4">
                  <label for="color" class="block text-sm font-medium text-text-primary mb-1">
                    Group Color *
                  </label>
                  <div class="flex items-center space-x-3">
                    <input
                      id="color"
                      v-model="form.color"
                      type="color"
                      required
                      class="w-12 h-10 border border-border-light rounded cursor-pointer"
                    />
                    <input
                      v-model="form.color"
                      type="text"
                      required
                      pattern="^#[0-9A-Fa-f]{6}$"
                      class="input flex-1"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <!-- Active Status -->
                <div class="mb-4">
                  <label class="flex items-center">
                    <input
                      v-model="form.is_active"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-text-primary">Active</span>
                  </label>
                </div>

                <!-- Users Selection -->
                <div class="mb-4">
                  <label for="users" class="block text-sm font-medium text-text-primary mb-1">
                    Add Users
                  </label>
                  
                  <!-- Search Input -->
                  <div class="relative mb-2">
                    <input
                      v-model="userSearchQuery"
                      type="text"
                      placeholder="Search users..."
                      class="input w-full pl-10"
                    />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Selected Users Display -->
                  <div v-if="selectedUsers.length > 0" class="mb-2">
                    <div class="text-xs text-gray-500 mb-1">Selected Users ({{ selectedUsers.length }}):</div>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="user in selectedUsers"
                        :key="user.id"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {{ user.name }}
                        <button
                          type="button"
                          @click="removeUser(user.id)"
                          class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>

                  <!-- Users Dropdown -->
                  <div class="relative">
                    <div class="max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white">
                      <div v-for="user in filteredUsers" :key="user.id" class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer" @click="toggleUser(user)">
                        <input
                          :id="`user-${user.id}`"
                          :checked="form.user_ids.includes(user.id)"
                          type="checkbox"
                          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded pointer-events-none"
                        />
                        <div class="ml-2 flex-1">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          <div class="text-xs text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                      <div v-if="filteredUsers.length === 0" class="px-3 py-2 text-sm text-gray-500">
                        {{ userSearchQuery ? 'No users found matching your search' : 'No active users available' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p class="text-sm text-red-600">{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : (isEdit ? 'Update Group' : 'Create Group') }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { authApi } from '@/utils/api'

const props = defineProps({
  userGroup: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const error = ref('')
const availableUsers = ref([])
const userSearchQuery = ref('')

const form = reactive({
  name: '',
  description: '',
  color: '#3B82F6',
  is_active: true,
  user_ids: []
})

// Computed properties for searchable user selection
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) {
    return availableUsers.value
  }
  
  const query = userSearchQuery.value.toLowerCase()
  return availableUsers.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  )
})

const selectedUsers = computed(() => {
  return availableUsers.value.filter(user => 
    form.user_ids.includes(user.id)
  )
})

// Load available users
const loadAvailableUsers = async () => {
  try {
    const response = await authApi.getActiveUsers()
    availableUsers.value = response
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

// User selection methods
const toggleUser = (user) => {
  const index = form.user_ids.indexOf(user.id)
  if (index > -1) {
    form.user_ids.splice(index, 1)
  } else {
    form.user_ids.push(user.id)
  }
}

const removeUser = (userId) => {
  const index = form.user_ids.indexOf(userId)
  if (index > -1) {
    form.user_ids.splice(index, 1)
  }
}

// Initialize form data
const initializeForm = () => {
  if (props.isEdit && props.userGroup) {
    form.name = props.userGroup.name || ''
    form.description = props.userGroup.description || ''
    form.color = props.userGroup.color || '#3B82F6'
    form.is_active = props.userGroup.is_active !== false
    form.user_ids = props.userGroup.users ? props.userGroup.users.map(user => user.id) : []
  } else {
    form.name = ''
    form.description = ''
    form.color = '#3B82F6'
    form.is_active = true
    form.user_ids = []
  }
  // Clear search when form is initialized
  userSearchQuery.value = ''
}

// Watch for prop changes
watch(() => props.userGroup, initializeForm, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = {
      name: form.name,
      description: form.description,
      color: form.color,
      is_active: form.is_active,
      user_ids: form.user_ids
    }

    if (props.isEdit && props.userGroup) {
      await authApi.updateUserGroup(props.userGroup.id, data)
    } else {
      await authApi.createUserGroup(data)
    }

    emit('saved')
  } catch (err: any) {
    console.error('Failed to save user group:', err)
    error.value = err.response?.data?.message || 'Failed to save user group. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAvailableUsers()
  initializeForm()
})
</script>
