<template>
  <div>
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
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Active
            </span>
            <span
              v-if="mfaStatus?.enabled"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              MFA Enabled
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <div class="card p-4">
          <nav class="space-y-1">
            <button
              v-for="section in settingsSections"
              :key="section.id"
              @click="activeSection = section.id"
              class="settings-nav-item"
              :class="
                activeSection === section.id
                  ? 'settings-nav-item-active'
                  : 'settings-nav-item-inactive'
              "
            >
              <i :class="section.icon" class="w-5 h-5 mr-3"></i>
              {{ section.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">
        <div class="card p-6">
          <!-- Profile Section -->
          <div v-if="activeSection === 'profile'">
            <h2 class="text-xl font-semibold text-text-primary mb-4">Profile Information</h2>
            <p class="text-text-secondary mb-6">Update your personal information</p>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                <input
                  type="text"
                  class="input"
                  :value="user?.name || ''"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Email</label>
                <input
                  type="email"
                  class="input"
                  :value="user?.email || ''"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Phone</label>
                <input type="tel" class="input" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div v-else-if="activeSection === 'security'">
            <h2 class="text-xl font-semibold text-text-primary mb-4">Security Settings</h2>
            <p class="text-text-secondary mb-6">Manage your password and security preferences</p>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2"
                  >Current Password</label
                >
                <input type="password" class="input" placeholder="Enter current password" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">New Password</label>
                <input type="password" class="input" placeholder="Enter new password" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2"
                  >Confirm New Password</label
                >
                <input type="password" class="input" placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          <!-- Notifications Section -->
          <div v-else-if="activeSection === 'notifications'">
            <h2 class="text-xl font-semibold text-text-primary mb-4">Notification Preferences</h2>
            <p class="text-text-secondary mb-6">Choose what notifications you want to receive</p>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-text-primary">Email Notifications</p>
                  <p class="text-xs text-text-secondary">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  class="w-5 h-5 text-primary-600 border-border-light rounded"
                  checked
                />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-text-primary">Task Updates</p>
                  <p class="text-xs text-text-secondary">Get notified about task changes</p>
                </div>
                <input
                  type="checkbox"
                  class="w-5 h-5 text-primary-600 border-border-light rounded"
                  checked
                />
              </div>
            </div>
          </div>

          <!-- Preferences Section -->
          <div v-else-if="activeSection === 'preferences'">
            <h2 class="text-xl font-semibold text-text-primary mb-4">Preferences</h2>
            <p class="text-text-secondary mb-6">Customize your experience</p>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Language</label>
                <select class="input">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Timezone</label>
                <select class="input">
                  <option value="utc">UTC</option>
                  <option value="est">EST</option>
                  <option value="pst">PST</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Theme & Colors Section -->
          <div v-else-if="activeSection === 'theme'" class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Theme & Colors</h3>
              <p class="text-text-secondary mb-6">
                Customize your interface appearance with different themes and color schemes.
              </p>

              <!-- Theme Selector -->
              <ThemeSelector @theme-changed="handleThemeChanged" />
            </div>

            <!-- Color Showcase -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Color System Showcase</h3>
              <p class="text-text-secondary mb-6">
                Preview how colors look in your selected theme.
              </p>

              <ColorShowcase />
            </div>
          </div>

          <!-- Save Button -->
          <div class="mt-6 pt-6 border-t border-border-light">
            <button class="btn btn-primary">
              <i class="fas fa-save mr-2"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./SettingsView.ts"></script>
<style scoped src="./SettingsView.css"></style>
