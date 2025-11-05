<template>
  <!-- Financial Info Card -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Financial Info</h3>
            <p class="text-sm text-gray-500">Budget and funding details</p>
          </div>
        </div>
        <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Hour Type</label>
            <p class="text-sm font-medium text-gray-900">{{ project?.hour_type || 'Billable' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Funding Source</label>
            <p class="text-sm font-medium text-gray-900">{{ project?.funding_source || '-' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Type</label>
            <span v-if="project?.project_type" 
                  :style="{ backgroundColor: project.project_type.color, color: 'white' }"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              {{ project.project_type.name }}
            </span>
            <span v-else class="text-xs text-gray-500">-</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Micro Budget</label>
            <div class="flex items-center">
              <div class="w-10 h-5 bg-gray-300 rounded-full relative">
                <div class="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Estimate</label>
            <p class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">-</p>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Bucket Code</label>
            <p class="text-sm font-medium text-gray-900">{{ project?.client?.company_name || 'Client' }} {{ project?.project_type?.name || 'Project' }} Agreement</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Invoice Number</label>
            <p class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">Invoice Number</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./FinancialInfo.ts"></script>
<style scoped src="./FinancialInfo.css"></style>
