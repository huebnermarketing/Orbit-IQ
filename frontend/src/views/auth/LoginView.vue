<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Floating Orbs -->
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Header Section -->
      <div class="text-center">
        <!-- Logo with Glow Effect -->
        <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 mb-6 relative group animate-pulse-glow">
          <div class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 animate-pulse opacity-75"></div>
          <div class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
          <svg class="h-10 w-10 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        
        <!-- Title with Gradient Text -->
        <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
          Orbit IQ
        </h1>
      </div>

      <!-- Login Card -->
      <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <!-- Card Glow Effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl"></div>
        
        <!-- Content -->
        <div class="relative z-10">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p class="text-gray-300">Enter your credentials to access your account</p>
          </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-200">
              Email Address
            </label>
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="relative w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-200">
              Password
            </label>
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                required
                class="relative w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <!-- MFA Code Field (shown when MFA is required) -->
          <div v-if="mfaRequired" class="animate-fade-in space-y-2">
            <label for="mfa_code" class="block text-sm font-medium text-gray-200">
              MFA Code
            </label>
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <input
                id="mfa_code"
                v-model="form.mfa_code"
                type="text"
                maxlength="6"
                class="relative w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-center text-lg tracking-widest"
                placeholder="000000"
              />
            </div>
            <p class="mt-2 text-sm text-gray-300">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-purple-500 focus:ring-purple-500 border-white/20 rounded bg-white/10"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            {{ loading ? 'Signing in...' : mfaRequired ? 'Verify & Sign In' : 'Sign In' }}
          </button>
        </form>

          <!-- Error Message -->
          <div v-if="error" class="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-300">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-400">
          © {{ currentYear }} Orbit IQ. All rights reserved.
        </p>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal 
      v-if="showForgotPassword" 
      @close="showForgotPassword = false"
      @success="handleForgotPasswordSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  mfa_code: '',
  remember: false
})

const loading = ref(false)
const error = ref('')
const mfaRequired = ref(false)
const showForgotPassword = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const loginData = {
      email: form.email,
      password: form.password,
      remember: form.remember,
      ...(mfaRequired.value && { mfa_code: form.mfa_code })
    }

    const response = await authStore.login(loginData.email, loginData.password, loginData.mfa_code, loginData.remember)
    
    // Check if MFA is required
    if (response.mfa_required) {
      mfaRequired.value = true
      form.mfa_code = ''
      return
    }

    // Login successful
    router.push('/dashboard')
  } catch (err: any) {
    console.error('Login error:', err)
    
    // Handle specific error messages
    if (err.response?.data?.message === 'Invalid credentials') {
      error.value = 'Invalid email or password. Please check your credentials and try again.'
    } else {
      error.value = err.response?.data?.message || 'Login failed. Please try again.'
    }
    
    // Reset MFA state on error
    if (mfaRequired.value) {
      mfaRequired.value = false
      form.mfa_code = ''
    }
  } finally {
    loading.value = false
  }
}

const handleForgotPasswordSuccess = () => {
  showForgotPassword.value = false
  // Show success message
  error.value = ''
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 60px rgba(168, 85, 247, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4), 0 0 90px rgba(168, 85, 247, 0.2);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
