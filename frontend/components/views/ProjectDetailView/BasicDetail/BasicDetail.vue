<template>
  <!-- Project Header -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Basic Details</h3>
            <p class="text-sm text-gray-500">Project overview and details</p>
          </div>
        </div>
        <!-- Edit Mode Action Buttons -->
        <div v-if="isEditing" class="flex items-center space-x-2">
          <button
            @click="saveChanges"
            :disabled="saving"
            class="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i>
            Save
          </button>
          <button
            @click="discardChanges"
            class="px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
          >
            Discard
          </button>
        </div>
        <!-- View Mode Edit Button -->
        <button
          v-else
          @click="enableEditing"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit Basic Details"
        >
          <i class="fas fa-edit w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Project Details Grid -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Code</label>
            <input
              v-if="isEditing"
              v-model="editingData.project_number"
              type="text"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project code"
            />
            <p v-else class="text-sm font-medium text-gray-900">{{ project?.project_number || '-' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Client</label>
            <select
              v-if="isEditing"
              v-model="editingData.client_id"
              @change="onClientChange"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.company_name }}
              </option>
            </select>
            <p v-else class="text-sm font-medium text-gray-900">{{ project?.client?.company_name || '-' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Status</label>
            <select
              v-if="isEditing"
              v-model="editingData.project_status_id"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option v-for="status in projectStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
            <div v-else>
              <span v-if="project?.project_status"
                    :style="{ backgroundColor: project.project_status.color, color: 'white' }"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                {{ project.project_status.name }}
              </span>
              <span v-else class="text-xs text-gray-500">-</span>
            </div>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Job Code</label>
            <input
              v-if="isEditing"
              v-model="editingData.job_code"
              type="text"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job code"
            />
            <p v-else class="text-sm font-medium text-gray-900">{{ project?.job_code || '-' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Sub-Client</label>
            <select
              v-if="isEditing"
              v-model="editingData.sub_client_id"
              class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!editingData.client_id"
            >
              <option value="">Select Sub Client</option>
              <option v-for="subClient in subClients" :key="subClient.id" :value="subClient.id">
                {{ subClient.name }}
              </option>
            </select>
            <p v-else class="text-sm font-medium text-gray-900">{{ project?.sub_client?.name || 'Select Sub Client' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./BasicDetail.ts"></script>
<style scoped src="./BasicDetail.css"></style>
