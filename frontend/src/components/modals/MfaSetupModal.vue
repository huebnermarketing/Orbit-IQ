<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">Enable Two-Factor Authentication</h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Step 1: QR Code -->
          <div v-if="step === 1" class="space-y-6">
            <div class="text-center">
              <h4 class="text-lg font-semibold text-text-primary mb-2">Step 1: Scan QR Code</h4>
              <p class="text-text-secondary mb-4">
                Use your authenticator app to scan this QR code
              </p>
            </div>

            <div class="flex justify-center">
              <div class="bg-white p-4 rounded-lg border-2 border-gray-200">
                <div v-if="qrCodeUrl" class="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                  <img 
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`"
                    alt="QR Code for MFA Setup"
                    class="w-full h-full object-contain"
                    @error="handleQrCodeError"
                  />
                </div>
                <div v-else class="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                    </svg>
                    <p class="text-sm text-gray-500">Loading QR Code...</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-blue-800">
                    <strong>Don't have an authenticator app?</strong> Download Google Authenticator, Authy, or Microsoft Authenticator from your app store.
                  </p>
                </div>
              </div>
            </div>

            <!-- Manual Entry -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Can't scan the QR code?</h4>
              <p class="text-sm text-gray-600 mb-2">Enter this code manually in your authenticator app:</p>
              <div class="flex items-center space-x-2">
                <code class="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono">{{ mfaSecret }}</code>
                <button 
                  @click="copySecret"
                  class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="$emit('close')"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                @click="step = 2"
                class="btn-primary"
              >
                Next Step
              </button>
            </div>
          </div>

          <!-- Step 2: Verification -->
          <div v-if="step === 2" class="space-y-6">
            <div class="text-center">
              <h4 class="text-lg font-semibold text-text-primary mb-2">Step 2: Verify Setup</h4>
              <p class="text-text-secondary mb-4">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Verification Code
              </label>
              <input
                v-model="verificationCode"
                type="text"
                maxlength="6"
                class="input text-center text-lg tracking-widest"
                placeholder="000000"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="step = 1"
                class="btn-outline"
              >
                Back
              </button>
              <button
                @click="enableMfa"
                :disabled="loading || verificationCode.length !== 6"
                class="btn-primary"
              >
                {{ loading ? 'Enabling...' : 'Enable MFA' }}
              </button>
            </div>
          </div>

          <!-- Step 3: Backup Codes -->
          <div v-if="step === 3" class="space-y-6">
            <div class="text-center">
              <h4 class="text-lg font-semibold text-text-primary mb-2">Step 3: Save Backup Codes</h4>
              <p class="text-text-secondary mb-4">
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="(code, index) in backupCodes"
                  :key="index"
                  class="font-mono text-sm bg-white p-2 rounded border text-center"
                >
                  {{ code }}
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-yellow-800">
                    <strong>Important:</strong> Each backup code can only be used once. Store them in a safe place.
                  </p>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                @click="completeSetup"
                class="btn-primary"
              >
                Complete Setup
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authApi } from '@/utils/api'

const emit = defineEmits(['close', 'success'])

const step = ref(1)
const loading = ref(false)
const error = ref('')
const verificationCode = ref('')
const qrCodeUrl = ref('')
const backupCodes = ref<string[]>([])
const mfaSecret = ref('')

onMounted(async () => {
  try {
    const response = await authApi.setupMfa()
    qrCodeUrl.value = response.qr_code_url
    mfaSecret.value = response.secret
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to setup MFA. Please try again.'
  }
})

const enableMfa = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await authApi.enableMfa({
      secret: mfaSecret.value,
      verification_code: verificationCode.value
    })
    
    backupCodes.value = response.backup_codes
    step.value = 3
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to enable MFA. Please try again.'
  } finally {
    loading.value = false
  }
}

const completeSetup = () => {
  emit('success')
}

const handleQrCodeError = () => {
  console.error('Failed to load QR code image')
}

const copySecret = async () => {
  try {
    await navigator.clipboard.writeText(mfaSecret.value)
    // You could add a toast notification here
    console.log('Secret copied to clipboard')
  } catch (err) {
    console.error('Failed to copy secret:', err)
  }
}
</script>
