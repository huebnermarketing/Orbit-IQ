<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-border-light">
        <h3 class="text-xl font-bold text-text-primary">
          {{ isEdit ? 'Edit Client Person' : 'Add Client Person' }}
        </h3>
        <button @click="$emit('close')" class="text-text-muted hover:text-text-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">
            Name <span class="text-error-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="input"
            placeholder="Enter client person name"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">
            Email <span class="text-error-500">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            :disabled="!canEditEmail"
            :class="[
              'input',
              !canEditEmail ? 'bg-gray-100 cursor-not-allowed' : ''
            ]"
            placeholder="Enter email address"
          />
          <p v-if="!canEditEmail && isUserActivated" class="text-xs text-text-muted mt-1">
            Only super admin can modify email addresses.
          </p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">
            Phone
          </label>
          <input
            v-model="form.phone"
            type="tel"
            class="input"
            placeholder="Enter phone number"
          />
        </div>

        <!-- Status (only for edit mode) -->
        <div v-if="isEdit">
          <label class="block text-sm font-medium text-text-primary mb-2">
            Status
          </label>
          <select v-model="form.status" class="input">
            <option 
              v-for="option in availableStatusOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <p class="text-xs text-text-muted mt-1">
            <span v-if="clientPerson?.status === 'pending'">
              User must setup password via invitation link to become Active
            </span>
            <span v-else>
              Can change between Active/Inactive but cannot go back to Pending
            </span>
          </p>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary flex-1"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEdit ? 'Updating...' : 'Adding...' }}
            </span>
            <span v-else>
              {{ isEdit ? 'Update Client Person' : 'Add Client Person' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { clientApi } from '@/utils/api'
import { useAuthStore } from '@/stores/auth'

interface Props {
  show: boolean
  clientId: string
  clientPerson?: any
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  status: 'pending'
})

const availableStatusOptions = computed(() => {
  if (!props.isEdit) {
    // For new client persons, only pending is available
    return [{ value: 'pending', label: 'Pending' }]
  }
  
  const currentStatus = props.clientPerson?.status
  
  if (currentStatus === 'pending') {
    // If currently pending, can only stay pending (user must setup password via link)
    return [
      { value: 'pending', label: 'Pending' }
    ]
  } else {
    // If active or inactive, can change between active/inactive but not back to pending
    return [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  }
})

const isUserActivated = computed(() => {
  return props.clientPerson?.status === 'active' || props.clientPerson?.status === 'inactive'
})

const isSuperAdmin = computed(() => {
  return authStore.user?.role === 'super_admin'
})

const canEditEmail = computed(() => {
  // Email can be edited if:
  // 1. User is not activated (pending), OR
  // 2. Current user is super admin
  return !isUserActivated.value || isSuperAdmin.value
})

const initializeForm = () => {
  if (props.clientPerson && props.isEdit) {
    form.value = {
      name: props.clientPerson.name || '',
      email: props.clientPerson.email || '',
      phone: props.clientPerson.phone || '',
      status: props.clientPerson.status || 'pending'
    }
  } else {
    form.value = {
      name: '',
      email: '',
      phone: '',
      status: 'pending'
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (props.isEdit && props.clientPerson) {
      await clientApi.updateClientPerson(props.clientId, props.clientPerson.id, form.value)
    } else {
      await clientApi.createClientPerson(props.clientId, form.value)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Failed to save client person:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    initializeForm()
  }
})

watch(() => props.clientPerson, () => {
  initializeForm()
}, { deep: true })
</script>
