<template>
  <!-- Team Members Card -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Team Members</h3>
            <p class="text-sm text-gray-500">Groups and individual team members</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="space-y-6">
        <!-- Group Teams Section -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Group Teams
          </h4>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
              T Task - WLIQ/India
              <button class="ml-2 text-blue-600 hover:text-blue-800 transition-colors">×</button>
            </span>
            <span class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
              W Warranty Period Team
              <button class="ml-2 text-purple-600 hover:text-purple-800 transition-colors">×</button>
            </span>
          </div>
        </div>
      
        <!-- Individual Team Members Section -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            Individual Members
          </h4>
          <div class="flex flex-wrap gap-2">
            <div class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <div class="w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-medium">A</span>
              </div>
              <span class="text-sm font-medium text-gray-900">Aagna Paneri</span>
              <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
            </div>
            <div class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <div class="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-medium">A</span>
              </div>
              <span class="text-sm font-medium text-gray-900">Aditi Singh</span>
              <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
            </div>
            <div class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
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
