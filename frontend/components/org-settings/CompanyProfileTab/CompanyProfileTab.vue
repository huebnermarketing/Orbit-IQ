<template>
  <div class="space-y-6">
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-text-primary mb-6">Company Profile</h3>

      <!-- Success Message -->
      <div v-if="orgProfileSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-green-800">{{ orgProfileSuccess }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="orgProfileError" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ orgProfileError }}</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleOrgProfileSubmit" class="space-y-6">
        <!-- Company Logo -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Company Logo</label>
          <div class="flex items-center space-x-4">
            <div
              class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="orgProfile.logo"
                :src="`/storage/${orgProfile.logo}`"
                alt="Company Logo"
                class="w-full h-full object-cover"
              />
              <svg
                v-else
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <div>
              <input
                ref="logoInput"
                type="file"
                accept="image/*"
                @change="handleLogoUpload"
                class="hidden"
              />
              <button type="button" @click="logoInput?.click()" class="btn-outline">
                Upload Logo
              </button>
              <p class="text-xs text-text-secondary mt-1">Recommended: 200x200px, PNG or JPG</p>
            </div>
          </div>
        </div>

        <!-- Company Name -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Company Name</label>
          <input
            v-model="orgProfile.name"
            type="text"
            class="input"
            placeholder="Enter company name"
            required
          />
        </div>

        <!-- Company Description -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Description</label>
          <textarea
            v-model="orgProfile.description"
            class="input"
            rows="4"
            placeholder="Enter company description"
          ></textarea>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Email</label>
            <input
              v-model="orgProfile.email"
              type="email"
              class="input"
              placeholder="contact@company.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Phone</label>
            <input
              v-model="orgProfile.phone"
              type="tel"
              class="input"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Address</label>
          <textarea
            v-model="orgProfile.address"
            class="input"
            rows="3"
            placeholder="Enter company address"
          ></textarea>
        </div>

        <!-- Website -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Website</label>
          <input
            v-model="orgProfile.website"
            type="url"
            class="input"
            placeholder="https://www.company.com"
          />
        </div>

        <!-- Timezone -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Default Timezone</label>
          <select v-model="orgProfile.timezone" class="input">
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

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="resetOrgProfile" class="btn-outline">Reset</button>
          <button type="submit" :disabled="orgProfileLoading" class="btn-primary">
            {{ orgProfileLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" src="./CompanyProfileTab.ts"></script>

<style scoped src="./CompanyProfileTab.css"></style>
