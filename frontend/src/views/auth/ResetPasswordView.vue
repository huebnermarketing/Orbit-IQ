<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
    
    <div class="max-w-md w-full space-y-8">
      <!-- Header Section -->
      <div class="text-center">
        <!-- Logo -->
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        
        <!-- Title -->
        <h1 class="mt-6 text-3xl font-bold text-gray-900">
          Reset Your Password
        </h1>
        
        <!-- Email Display -->
        <div v-if="form.email" class="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
          <div class="flex items-center justify-center space-x-2">
            <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Resetting password for:</span>
            <span class="text-sm font-semibold text-indigo-600">{{ form.email }}</span>
          </div>
        </div>
        
        <p class="mt-4 text-sm text-gray-600">
          Enter your new password below to complete the reset process
        </p>
      </div>
      
      <!-- Form Card -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                name="password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="rounded-xl bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-red-800">{{ error }}</p>
                <!-- Request New Link Button -->
                <div v-if="showRequestNewLink" class="mt-3">
                  <button
                    @click="requestNewLink"
                    :disabled="loading"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="-ml-1 mr-2 h-4 w-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    {{ loading ? 'Sending...' : 'Request New Reset Link' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="rounded-xl bg-green-50 border border-green-200 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
                <p class="text-xs text-green-600 mt-1">Please check your email and click the new reset link.</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              {{ loading ? 'Resetting Password...' : 'Reset Password' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <router-link to="/login" class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/utils/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const success = ref(false)
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorType = ref('')
const showRequestNewLink = ref(false)

const form = reactive({
  password: '',
  password_confirmation: '',
  token: '',
  email: ''
})

onMounted(() => {
  // Extract token and email from URL parameters
  form.token = route.query.token as string || ''
  form.email = route.query.email as string || ''
  
  if (!form.token || !form.email) {
    error.value = 'Invalid or missing reset token. Please request a new password reset.'
    showRequestNewLink.value = true
  }
})

const handleSubmit = async () => {
  if (!form.token || !form.email) {
    error.value = 'Invalid or missing reset token. Please request a new password reset.'
    showRequestNewLink.value = true
    return
  }

  if (form.password !== form.password_confirmation) {
    error.value = 'Passwords do not match.'
    return
  }

  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters long.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await authApi.resetPassword({
      token: form.token,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    
    success.value = true
    successMessage.value = 'Password reset successfully! You can now log in with your new password.'
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (err: any) {
    if (err.response?.data?.errors?.password) {
      error.value = err.response.data.errors.password[0]
    } else if (err.response?.data?.errors?.token) {
      error.value = err.response.data.errors.token[0]
    } else {
      error.value = err.response?.data?.message || 'Failed to reset password. Please try again.'
      errorType.value = err.response?.data?.error_type || ''
      showRequestNewLink.value = ['invalid_token', 'expired_token'].includes(errorType.value)
    }
  } finally {
    loading.value = false
  }
}

const requestNewLink = async () => {
  if (!form.email) return
  
  loading.value = true
  error.value = ''
  success.value = false
  errorType.value = ''
  showRequestNewLink.value = false
  
  try {
    await authApi.forgotPassword(form.email)
    success.value = true
    successMessage.value = 'A new password reset link has been sent to your email address.'
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to send new reset link. Please try again.'
    showRequestNewLink.value = true
  } finally {
    loading.value = false
  }
}
</script>
