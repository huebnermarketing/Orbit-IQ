<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">Reset Password</h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="mb-6">
            <p class="text-text-secondary">
              Reset password for <strong>{{ user?.name }}</strong> ({{ user?.email }})
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">New Password</label>
              <input
                v-model="form.password"
                type="password"
                class="input"
                placeholder="Enter new password"
                required
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Confirm New Password</label>
              <input
                v-model="form.password_confirmation"
                type="password"
                class="input"
                placeholder="Confirm new password"
                required
              />
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
                {{ loading ? 'Resetting...' : 'Reset Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authApi } from '@/utils/api'

interface Props {
  user: any
}

const props = defineProps<Props>()

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const error = ref('')

const form = reactive({
  password: '',
  password_confirmation: ''
})

const handleSubmit = async () => {
  if (form.password !== form.password_confirmation) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authApi.resetUserPassword(props.user.id, form)
    emit('saved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
