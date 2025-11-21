<template>
  <!-- Team Members Card -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="text-violet-600" :size="'medium'" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Team Members</h3>
            <p class="text-sm text-gray-500">Groups and individual team members</p>
          </div>
        </div>
        <button
          @click="enableEditing"
          v-tooltip="'edit'"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="fas fa-edit w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="space-y-6">
        <!-- Group Teams Section -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i class="fas fa-layer-group mr-2 text-gray-500 text-sm"></i>
            Group Teams
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
            >
              T Task - WLIQ/India
              <button class="ml-2 text-blue-600 hover:text-blue-800 transition-colors">×</button>
            </span>
            <span
              class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm"
            >
              W Warranty Period Team
              <button class="ml-2 text-purple-600 hover:text-purple-800 transition-colors">
                ×
              </button>
            </span>
          </div>
        </div>

        <!-- Individual Team Members Section -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i class="fas fa-user-friends mr-2 text-gray-500 text-sm"></i>
            Individual Members
          </h4>
          <div class="flex flex-wrap gap-2">
            <div
              class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm"
            >
              <div
                class="w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-xs font-medium">A</span>
              </div>
              <span class="text-sm font-medium text-gray-900">Aagna Paneri</span>
              <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
            </div>
            <div
              class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm"
            >
              <div
                class="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-xs font-medium">A</span>
              </div>
              <span class="text-sm font-medium text-gray-900">Aditi Singh</span>
              <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
            </div>
            <div
              class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm"
            >
              <div
                class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-xs font-medium">A</span>
              </div>
              <span class="text-sm font-medium text-gray-900">Akash Patel</span>
              <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamMembers.ts"></script>
<style scoped src="./TeamMembers.css"></style>
