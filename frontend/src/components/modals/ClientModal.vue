<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">
              {{ isEdit ? 'Edit Client' : 'Add New Client' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-text-muted hover:text-text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Company Name -->
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-text-primary mb-2">Company Name *</label>
                <input
                  v-model="form.company_name"
                  type="text"
                  class="input"
                  placeholder="Enter company name"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="input"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Phone</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="input"
                  placeholder="Enter phone number"
                />
              </div>

              <!-- Website -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Website</label>
                <input
                  v-model="form.website"
                  type="url"
                  class="input"
                  placeholder="https://example.com"
                />
              </div>

              <!-- Client Type -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Client Type *</label>
                <select
                  v-model="form.client_type"
                  class="input"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Agency">Agency</option>
                  <option value="Direct Client">Direct Client</option>
                </select>
              </div>

              <!-- Primary Account Manager -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Primary Account Manager</label>
                <select
                  v-model="form.primary_account_manager_id"
                  class="input"
                >
                  <option value="">Select Primary AM ({{ accountManagers.length }} available)</option>
                  <option v-for="manager in accountManagers" :key="manager.id" :value="manager.id">
                    {{ manager.name }} ({{ manager.email }})
                  </option>
                </select>
              </div>

              <!-- Secondary Account Managers -->
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-text-primary mb-2">Secondary Account Managers</label>
                
                <!-- Search Input -->
                <div class="mb-3">
                  <input
                    v-model="managerSearchQuery"
                    type="text"
                    class="input"
                    placeholder="Search account managers..."
                  />
                </div>

                <!-- Selected Managers -->
                <div class="mb-3">
                  <div v-if="selectedManagers.length > 0" class="flex flex-wrap gap-2">
                    <span
                      v-for="manager in selectedManagers"
                      :key="manager.id"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {{ manager.name }}
                      <button
                        type="button"
                        @click="removeManager(manager.id)"
                        class="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </span>
                  </div>
                  <div v-else class="text-sm text-text-muted italic">
                    No secondary account managers selected
                  </div>
                </div>

                <!-- Available Managers List -->
                <div class="max-h-32 overflow-y-auto border border-gray-300 rounded-md">
                  <div v-if="filteredManagers.length === 0" class="px-3 py-2 text-sm text-text-muted">
                    No account managers available ({{ accountManagers.length }} total)
                  </div>
                  <div
                    v-for="manager in filteredManagers"
                    :key="manager.id"
                    @click="toggleManager(manager)"
                    class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ manager.name }}</div>
                        <div class="text-sm text-text-muted">{{ manager.email }}</div>
                      </div>
                      <div v-if="isManagerSelected(manager.id)" class="text-primary-600">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address -->
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-text-primary mb-2">Address</label>
                <textarea
                  v-model="form.address"
                  rows="3"
                  class="input"
                  placeholder="Enter company address"
                ></textarea>
              </div>

              <!-- Active Status -->
              <div class="sm:col-span-2">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    v-model="form.is_active"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="is_active" class="ml-2 block text-sm text-text-primary">
                    Active
                  </label>
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
                {{ loading ? 'Saving...' : (isEdit ? 'Update Client' : 'Create Client') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { clientApi } from '@/utils/api'

interface Props {
  show: boolean
  client?: any
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  client: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const loading = ref(false)
const accountManagers = ref([])
const managerSearchQuery = ref('')
const selectedManagers = ref([])

const form = ref({
  company_name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  primary_account_manager_id: '',
  secondary_account_manager_ids: [],
  client_type: '',
  is_active: true
})

const filteredManagers = computed(() => {
  if (!managerSearchQuery.value) return accountManagers.value
  
  const query = managerSearchQuery.value.toLowerCase()
  return accountManagers.value.filter((manager: any) => 
    manager.name.toLowerCase().includes(query) || 
    manager.email.toLowerCase().includes(query)
  )
})

const isManagerSelected = (managerId: number) => {
  return selectedManagers.value.some((manager: any) => manager.id === managerId)
}

const toggleManager = (manager: any) => {
  if (isManagerSelected(manager.id)) {
    removeManager(manager.id)
  } else {
    selectedManagers.value.push(manager)
  }
}

const removeManager = (managerId: number) => {
  selectedManagers.value = selectedManagers.value.filter((manager: any) => manager.id !== managerId)
}

const loadAccountManagers = async () => {
  try {
    const response = await clientApi.getAccountManagers()
    accountManagers.value = response || []
  } catch (error) {
    console.error('Failed to load account managers:', error)
  }
}

const initializeForm = () => {
  if (props.client && props.isEdit) {
    form.value = {
      company_name: props.client.company_name || '',
      email: props.client.email || '',
      phone: props.client.phone || '',
      website: props.client.website || '',
      address: props.client.address || '',
      primary_account_manager_id: props.client.primary_account_manager_id || '',
      secondary_account_manager_ids: props.client.secondary_account_manager_ids || [],
      client_type: props.client.client_type || '',
      is_active: props.client.is_active !== false
    }
    
    // Set selected managers for display
    selectedManagers.value = props.client.secondary_account_managers || []
  } else {
    form.value = {
      company_name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      primary_account_manager_id: '',
      secondary_account_manager_ids: [],
      client_type: '',
      is_active: true
    }
    selectedManagers.value = []
  }
  managerSearchQuery.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Update form with selected managers
    form.value.secondary_account_manager_ids = selectedManagers.value.map((manager: any) => manager.id)
    
    if (props.isEdit && props.client) {
      await clientApi.updateClient(props.client.id, form.value)
    } else {
      await clientApi.createClient(form.value)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Failed to save client:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.client, (newClient) => {
  initializeForm()
}, { immediate: true, deep: true })

watch(() => props.show, async (newValue) => {
  if (newValue) {
    await loadAccountManagers()
    // Initialize form after account managers are loaded
    initializeForm()
  }
})

onMounted(() => {
  loadAccountManagers()
})
</script>
