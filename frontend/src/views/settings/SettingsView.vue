<template>
  <AppLayout>
    <div class="w-full space-y-8">
      <!-- Success Message -->
      <div v-if="success" class="bg-success-50 border border-success-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-success-800">{{ success }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-error-50 border border-error-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-error-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Profile Header -->
      <div class="card p-8">
        <div class="flex items-center space-x-6">
          <AvatarUpload
            :avatar-url="user?.avatar ? `/storage/${user.avatar}` : null"
            :name="user?.name"
            :size="96"
            @upload="handleAvatarUpload"
            @error="handleAvatarError"
          />
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-text-primary">{{ user?.name || 'Loading...' }}</h1>
            <p class="text-text-secondary text-lg">{{ user?.email || 'Loading...' }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                Active
              </span>
              <span v-if="mfaStatus?.enabled" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                MFA Enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tabs -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Navigation -->
        <div class="lg:col-span-2">
          <nav class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="() => { activeTab = tab.id; saveActiveTab(tab.id) }"
              :class="[
                'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                  : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-3" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div class="lg:col-span-10">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Profile Information</h3>
              <form @submit.prevent="updateProfile" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                    <input
                      v-model="profileForm.name"
                      type="text"
                      class="input"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      class="input"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">Timezone</label>
                  <select v-model="profileForm.timezone" class="input">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                <div class="flex justify-end">
                  <button type="submit" :disabled="profileLoading" class="btn-primary">
                    {{ profileLoading ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Change Password -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Change Password</h3>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">Current Password</label>
                  <input
                    v-model="passwordForm.current_password"
                    type="password"
                    class="input"
                    placeholder="Enter current password"
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2">New Password</label>
                    <input
                      v-model="passwordForm.new_password"
                      type="password"
                      class="input"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2">Confirm New Password</label>
                    <input
                      v-model="passwordForm.new_password_confirmation"
                      type="password"
                      class="input"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div class="flex justify-end">
                  <button type="submit" :disabled="passwordLoading" class="btn-primary">
                    {{ passwordLoading ? 'Updating...' : 'Update Password' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <!-- MFA Status -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-text-primary">Two-Factor Authentication</h3>
                  <p class="text-text-secondary">Add an extra layer of security to your account</p>
                </div>
                <div class="flex items-center space-x-3">
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    mfaStatus?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ mfaStatus?.enabled ? 'Enabled' : 'Disabled' }}
                  </span>
                  <button
                    v-if="!mfaStatus?.enabled"
                    @click="setupMfa"
                    class="btn-primary"
                  >
                    Enable MFA
                  </button>
                  <button
                    v-else
                    @click="disableMfa"
                    class="btn-outline"
                  >
                    Disable MFA
                  </button>
                </div>
              </div>
              
              <div v-if="mfaStatus?.enabled" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-green-800">
                      Two-factor authentication is enabled. You have {{ mfaStatus.backup_codes_count }} backup codes remaining.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Backup Codes -->
            <div v-if="mfaStatus?.enabled" class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Backup Codes</h3>
              <p class="text-text-secondary mb-4">
                Backup codes can be used to access your account if you lose your authenticator device.
              </p>
              <button @click="regenerateBackupCodes" class="btn-outline">
                Regenerate Backup Codes
              </button>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Email Notifications</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-text-primary">Project Updates</h4>
                    <p class="text-sm text-text-secondary">Get notified when projects are updated</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" checked>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-text-primary">Task Assignments</h4>
                    <p class="text-sm text-text-secondary">Get notified when tasks are assigned to you</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" checked>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-text-primary">Team Invitations</h4>
                    <p class="text-sm text-text-secondary">Get notified when you're invited to teams</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" checked>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Theme Tab -->
          <div v-if="activeTab === 'theme'" class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Theme & Colors</h3>
              <p class="text-text-secondary mb-6">Customize your interface appearance with different themes and color schemes.</p>
              
              <!-- Theme Selector -->
              <ThemeSelector @theme-changed="handleThemeChanged" />
            </div>

            <!-- Color Showcase -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Color System Showcase</h3>
              <p class="text-text-secondary mb-6">Preview how colors look in your selected theme.</p>
              
              <ColorShowcase />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MFA Setup Modal -->
    <MfaSetupModal 
      v-if="showMfaSetup" 
      @close="showMfaSetup = false"
      @success="handleMfaSetupSuccess"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/utils/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import MfaSetupModal from '@/components/modals/MfaSetupModal.vue'
import AvatarUpload from '@/components/common/AvatarUpload.vue'
import ThemeSelector from '@/components/theme/ThemeSelector.vue'
import ColorShowcase from '@/components/theme/ColorShowcase.vue'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const activeTab = ref('profile')

// Load active tab from localStorage
const loadActiveTab = () => {
  const savedTab = localStorage.getItem('settingsActiveTab')
  if (savedTab && tabs.some(tab => tab.id === savedTab)) {
    activeTab.value = savedTab
  }
}

// Save active tab to localStorage
const saveActiveTab = (tabId: string) => {
  localStorage.setItem('settingsActiveTab', tabId)
}
const showMfaSetup = ref(false)
const profileLoading = ref(false)
const passwordLoading = ref(false)
const mfaLoading = ref(false)
const mfaStatus = ref({ enabled: false, backup_codes_count: 0 })
const error = ref('')
const success = ref('')

const profileForm = reactive({
  name: '',
  email: '',
  timezone: 'UTC'
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const tabs = [
  {
    id: 'profile',
    name: 'Profile',
    icon: 'svg'
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'svg'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: 'svg'
  },
  {
    id: 'theme',
    name: 'Theme & Colors',
    icon: 'svg'
  }
]

onMounted(() => {
  loadActiveTab()
  if (user.value) {
    profileForm.name = user.value.name || ''
    profileForm.email = user.value.email || ''
    profileForm.timezone = user.value.timezone || 'UTC'
  }
  loadMfaStatus()
})

const loadMfaStatus = async () => {
  try {
    const response = await authApi.getMfaStatus()
    mfaStatus.value = {
      enabled: response.mfa_enabled,
      backup_codes_count: response.backup_codes_count
    }
  } catch (error) {
    console.error('Failed to load MFA status:', error)
    mfaStatus.value = { enabled: false, backup_codes_count: 0 }
  }
}

const updateProfile = async () => {
  profileLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const response = await authApi.updateProfile(profileForm)
    authStore.updateUser(response.user)
    success.value = 'Profile updated successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to update profile. Please try again.'
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    error.value = 'New passwords do not match.'
    return
  }
  
  passwordLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    await authApi.changePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
      new_password_confirmation: passwordForm.new_password_confirmation
    })
    
    success.value = 'Password changed successfully!'
    
    // Clear form
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.new_password_confirmation = ''
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to change password. Please try again.'
  } finally {
    passwordLoading.value = false
  }
}

const setupMfa = () => {
  showMfaSetup.value = true
}

const disableMfa = async () => {
  if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
    return
  }
  
  mfaLoading.value = true
  error.value = ''
  
  try {
    await authApi.disableMfa({ password: prompt('Please enter your password to confirm:') })
    await loadMfaStatus()
    success.value = 'Two-factor authentication has been disabled.'
    
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to disable MFA. Please try again.'
  } finally {
    mfaLoading.value = false
  }
}

const regenerateBackupCodes = async () => {
  if (!confirm('This will invalidate your existing backup codes. Are you sure you want to continue?')) {
    return
  }
  
  mfaLoading.value = true
  error.value = ''
  
  try {
    const response = await authApi.regenerateBackupCodes()
    // Show backup codes in a modal or alert
    alert('New backup codes generated:\n\n' + response.backup_codes.join('\n') + '\n\nPlease save these codes in a safe place.')
    await loadMfaStatus()
    success.value = 'Backup codes regenerated successfully.'
    
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to regenerate backup codes. Please try again.'
  } finally {
    mfaLoading.value = false
  }
}

const handleMfaSetupSuccess = () => {
  showMfaSetup.value = false
  loadMfaStatus()
  success.value = 'Two-factor authentication has been enabled successfully!'
  
  setTimeout(() => {
    success.value = ''
  }, 3000)
}

const handleAvatarUpload = async (file: File) => {
  try {
    const response = await authApi.uploadAvatar(file)
    authStore.updateUser(response.user)
    success.value = 'Avatar updated successfully!'
    
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to upload avatar. Please try again.'
  }
}

const handleAvatarError = (message: string) => {
  error.value = message
}

const handleThemeChanged = async (themeName: string) => {
  try {
    await authApi.updateThemePreference(themeName)
    success.value = 'Theme updated successfully!'
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = 'Failed to save theme preference. Please try again.'
  }
}
</script>
