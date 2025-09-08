<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name -->
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

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                v-model="form.email"
                type="email"
                :disabled="!canEditEmail"
                :class="[
                  'input',
                  !canEditEmail ? 'bg-gray-100 cursor-not-allowed' : ''
                ]"
                placeholder="Enter email address"
                required
              />
              <p v-if="!canEditEmail" class="text-xs text-gray-500 mt-1">
                Only super admin can modify email addresses.
              </p>
            </div>

            <!-- Password (only for new users) -->
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
              <label class="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
              <input
                v-model="form.password_confirmation"
                type="password"
                class="input"
                placeholder="Confirm password"
                required
              />
            </div>

            <!-- System Role -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                System Role
                <span v-if="isClientLinkedUser" class="text-xs text-gray-500 ml-2">(Fixed for client users)</span>
              </label>
              <select v-model="form.role" class="input" :disabled="isClientLinkedUser" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option v-if="canCreateSuperAdmin" value="super_admin">Super Admin</option>
              </select>
            </div>

            <!-- User Status (only for edit mode) -->
            <div v-if="isEdit">
              <label class="block text-sm font-medium text-text-primary mb-2">User Status</label>
              <div class="flex items-center space-x-3">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="form.is_active"
                    class="sr-only"
                  />
                  <div class="relative">
                    <div 
                      class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out"
                      :class="form.is_active ? 'bg-primary-500' : 'bg-gray-300'"
                    ></div>
                    <div 
                      class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out"
                      :class="form.is_active ? 'transform translate-x-5' : 'transform translate-x-0'"
                    ></div>
                  </div>
                  <span class="ml-3 text-sm font-medium text-text-primary">
                    {{ form.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </label>
              </div>
              <p class="text-xs text-text-secondary mt-1">
                {{ form.is_active ? 'User can log in and access the system' : 'User cannot log in and is disabled' }}
              </p>
            </div>

            <!-- Organization Roles -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Organization Roles
                <span v-if="isClientLinkedUser" class="text-xs text-gray-500 ml-2">(Fixed for client users)</span>
              </label>
              <div class="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3" :class="{ 'opacity-50': isClientLinkedUser }">
                <label 
                  v-for="orgRole in availableOrganizationRoles" 
                  :key="orgRole.id"
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  :class="{ 'cursor-not-allowed': isClientLinkedUser }"
                >
                  <input
                    type="checkbox"
                    :value="orgRole.id"
                    v-model="form.organization_role_ids"
                    :disabled="isClientLinkedUser"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-text-primary">{{ orgRole.name }}</span>
                </label>
              </div>
              <p class="text-xs text-text-secondary mt-1">
                <span v-if="isClientLinkedUser">Organization role is automatically set to Client</span>
                <span v-else>Select one or more organization roles (Client role is reserved for client persons)</span>
              </p>
            </div>

            <!-- AM Assignment (for PM users) -->
            <div v-if="isPMSelected">
              <label class="block text-sm font-medium text-text-primary mb-2">Assigned AMs</label>
              <div class="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                <label 
                  v-for="am in amUsers" 
                  :key="am.id"
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    :value="am.id"
                    v-model="form.assigned_am_ids"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-text-primary">{{ am.name }} ({{ am.email }})</span>
                </label>
              </div>
              <p class="text-xs text-text-secondary mt-1">Select one or more AMs to assign to this PM</p>
            </div>

            <!-- Timezone -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Timezone</label>
              <select v-model="form.timezone" class="input">
                <option v-for="timezone in timezones" :key="timezone.value" :value="timezone.value">
                  {{ timezone.label }}
                </option>
              </select>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="$emit('close')"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                {{ loading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/utils/api'

interface Props {
  user?: any
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits(['close', 'saved'])

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user',
  organization_role_ids: [],
  assigned_am_ids: [],
  timezone: 'UTC',
  is_active: true
})

const currentUser = computed(() => authStore.user)
const organizationRoles = ref<any[]>([])
const amUsers = ref<any[]>([])

const canCreateSuperAdmin = computed(() => {
  return currentUser.value?.role === 'super_admin'
})

const isPMSelected = computed(() => {
  return form.organization_role_ids.some((roleId: any) => {
    const role = organizationRoles.value.find((r: any) => r.id === roleId)
    return role?.name === 'PM'
  })
})

const isClientLinkedUser = computed(() => {
  // Check if user has client organization role (ID 19)
  if (props.user?.organization_roles) {
    return props.user.organization_roles.some((role: any) => role.id === 19)
  }
  // Fallback: check if user has organization_role_id set to 19 (client role)
  return props.user?.organization_role_id === 19
})

const canEditEmail = computed(() => {
  // Email can only be edited by super admin
  return currentUser.value?.role === 'super_admin'
})

const availableOrganizationRoles = computed(() => {
  // Filter out the Client role (ID: 19) as it's reserved for client persons
  return organizationRoles.value.filter((role: any) => role.id !== 19)
})

const timezones = computed(() => {
  return [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'Asia/Kolkata', label: 'IST (India Standard Time)' }
  ]
})

onMounted(async () => {
  // Load organization roles and AM users
  await Promise.all([
    loadOrganizationRoles(),
    loadAMUsers()
  ])
  
  if (props.isEdit && props.user) {
    form.name = props.user.name || ''
    form.email = props.user.email || ''
    form.role = props.user.role || 'user'
    form.organization_role_ids = props.user.organization_roles?.map((role: any) => role.id) || []
    form.assigned_am_ids = props.user.assigned_ams?.map((am: any) => am.id) || []
    form.timezone = props.user.timezone || 'UTC'
    form.is_active = props.user.is_active !== undefined ? props.user.is_active : true
  }
})

const loadOrganizationRoles = async () => {
  try {
    const response = await authApi.getOrganizationRoles()
    organizationRoles.value = response
  } catch (error) {
    console.error('Failed to load organization roles:', error)
  }
}

const loadAMUsers = async () => {
  try {
    const response = await authApi.getAMUsers()
    amUsers.value = response
  } catch (error) {
    console.error('Failed to load AM users:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (props.isEdit) {
      await authApi.updateUser(props.user.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        organization_role_ids: form.organization_role_ids,
        assigned_am_ids: form.assigned_am_ids,
        timezone: form.timezone,
        is_active: form.is_active
      })
    } else {
      await authApi.createUser(form)
    }
    
    emit('saved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
