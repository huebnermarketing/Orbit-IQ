<template>
  <!-- Project Management Card -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Project Management</h3>
            <p class="text-sm text-gray-500">Team and timeline details</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Owner</label>
            <div v-if="project?.account_manager" class="flex items-center space-x-2">
              <div class="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                <img v-if="project.account_manager.avatar" 
                     :src="`/storage/${project.account_manager.avatar}`" 
                     :alt="project.account_manager.name"
                     class="w-full h-full object-cover" />
                <span v-else class="text-white font-medium text-xs">
                  {{ getInitials(project.account_manager.name) }}
                </span>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ project.account_manager.name }}</p>
            </div>
            <span v-else class="text-sm text-gray-500">-</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Start Date</label>
            <p class="text-sm font-medium text-gray-900">{{ project?.start_date ? formatDate(project.start_date) : 'No start date' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Quoted Hours</label>
            <p class="text-sm font-medium text-gray-900">0</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Created</label>
            <p class="text-sm font-medium text-gray-900">{{ project?.created_at ? formatDate(project.created_at) : '-' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Reminder</label>
            <div class="flex items-center space-x-1">
              <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-gray-500">No Reminder</p>
            </div>
          </div>
        </div>
      
        <!-- Right Column -->
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Manager</label>
            <div v-if="project?.project_manager" class="flex items-center space-x-2">
              <div class="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center overflow-hidden">
                <img v-if="project.project_manager.avatar" 
                     :src="`/storage/${project.project_manager.avatar}`" 
                     :alt="project.project_manager.name"
                     class="w-full h-full object-cover" />
                <span v-else class="text-white font-medium text-xs">
                  {{ getInitials(project.project_manager.name) }}
                </span>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ project.project_manager.name }}</p>
            </div>
            <span v-else class="text-sm text-gray-500">-</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Due Date</label>
            <p class="text-sm font-medium text-red-600">{{ project?.due_date ? formatDate(project.due_date) : 'No Due date' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Utilized Hours</label>
            <div class="flex items-center space-x-2">
              <p class="text-sm font-medium text-gray-900">0:00 Hours</p>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 0%"></div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Delivery Date</label>
            <p class="text-sm font-medium text-gray-900">No Delivery date</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ProjectManagement.ts"></script>
<style scoped src="./ProjectManagement.css"></style>
