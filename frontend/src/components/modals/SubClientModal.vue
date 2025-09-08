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
              {{ isEdit ? 'Edit Sub-Client' : 'Add New Sub-Client' }}
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
            <!-- Sub-Client Name -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Sub-Client Name</label>
              <input
                v-model="form.name"
                type="text"
                class="input"
                placeholder="Enter sub-client name"
                required
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Email ID</label>
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
              <label class="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
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
                placeholder="Enter website URL"
              />
            </div>

            <!-- Error Message -->
            <div v-if="error" class="alert-error">
              <div class="flex">
                <svg class="h-5 w-5 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm">{{ error }}</p>
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
                {{ loading ? 'Saving...' : (isEdit ? 'Update Sub-Client' : 'Add Sub-Client') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { clientApi } from '@/utils/api'

interface Props {
  clientId: string
  subClient?: any
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  website: ''
})

onMounted(() => {
  if (props.isEdit && props.subClient) {
    form.name = props.subClient.name || ''
    form.email = props.subClient.email || ''
    form.phone = props.subClient.phone || ''
    form.website = props.subClient.website || ''
  }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (props.isEdit) {
      await clientApi.updateSubClient(props.clientId, props.subClient.id, form)
    } else {
      await clientApi.createSubClient(props.clientId, form)
    }
    
    emit('saved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
