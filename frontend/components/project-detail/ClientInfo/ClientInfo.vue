<template>
  <div>
    <!-- Client Information -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Client Information</h3>
              <p class="text-sm text-gray-500">Client details and contact information</p>
            </div>
          </div>
          <!-- Edit Mode Action Buttons -->
          <div v-if="isEditingClientInfo" class="flex items-center space-x-2">
            <button type="button" @click="discardClientInfoChanges" class="btn-outline">
              Discard
            </button>
            <button
              type="button"
              @click="saveClientInfo"
              :disabled="savingClientInfo"
              class="btn-primary"
            >
              <div
                v-if="savingClientInfo"
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 inline-block"
              ></div>
              Save
            </button>
          </div>
          <!-- View Mode Edit Button -->
          <button
            v-else
            @click="enableEditing"
            v-tooltip="'edit'"
            :disabled="loadingClientInfo || !client"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              v-if="loadingClientInfo"
              class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"
            ></div>
            <i v-else class="fas fa-edit w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="client" class="space-y-6">
          <!-- Client Header -->
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img v-if="client.logo_url" 
                   :src="client.logo_url" 
                   :alt="client.company_name"
                   class="w-full h-full object-cover" />
              <span v-else class="text-gray-500 text-xl font-semibold">
                {{ getCompanyInitials(client.company_name) }}
              </span>
            </div>
            <div>
              <h4 class="text-xl font-semibold text-gray-900">{{ client.company_name }}</h4>
              <p v-if="client.website" class="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                {{ client.website }}
              </p>
            </div>
          </div>

          <!-- Client Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Company Name</label>
                <input
                  v-if="isEditingClientInfo"
                  v-model="editingClientInfo.company_name"
                  type="text"
                  class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter company name"
                />
                <p v-else class="text-sm font-medium text-gray-900">{{ client.company_name }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Contact Person</label>
                <input
                  v-if="isEditingClientInfo"
                  v-model="editingClientInfo.contact_person"
                  type="text"
                  class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter contact person"
                />
                <p v-else class="text-sm font-medium text-gray-900">{{ client.contact_person || '-' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Phone</label>
                <input
                  v-if="isEditingClientInfo"
                  v-model="editingClientInfo.phone"
                  type="text"
                  class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter phone number"
                />
                <p v-else class="text-sm font-medium text-gray-900">{{ client.phone || '-' }}</p>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Email</label>
                <input
                  v-if="isEditingClientInfo"
                  v-model="editingClientInfo.email"
                  type="email"
                  class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email"
                />
                <p v-else class="text-sm font-medium text-gray-900">{{ client.email || '-' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Address</label>
                <input
                  v-if="isEditingClientInfo"
                  v-model="editingClientInfo.address"
                  type="text"
                  class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter address"
                />
                <p v-else class="text-sm font-medium text-gray-900">{{ client.address || '-' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Industry</label>
                <input
                  v-if="isEditingClientInfo"
                  v-model="editingClientInfo.industry"
                  type="text"
                  class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter industry"
                />
                <p v-else class="text-sm font-medium text-gray-900">{{ client.industry || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Client Description -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Description</label>
            <textarea
              v-if="isEditingClientInfo"
              v-model="editingClientInfo.description"
              rows="4"
              class="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              placeholder="Enter description"
            ></textarea>
            <p v-else class="text-sm text-gray-700 whitespace-pre-wrap">{{ client.description || '-' }}</p>
          </div>
        </div>

        <!-- No Client State -->
        <div v-else class="text-center py-12">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Client Information</h3>
          <p class="text-gray-500">Client details will appear here once assigned to the project.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ClientInfo.ts"></script>
<style scoped src="./ClientInfo.css"></style>
