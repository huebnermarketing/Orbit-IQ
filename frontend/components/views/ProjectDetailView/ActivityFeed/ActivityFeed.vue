<template>
  <div>
    <!-- Activity Feed -->
    <div class="space-y-4">
      <div v-for="activity in activities" :key="activity.id" class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <i :class="getActivityIcon(activity.type)" class="text-blue-600 text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(activity.created_at) }}</p>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
            <div v-if="activity.user" class="flex items-center mt-2">
              <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-gray-600">{{ getInitials(activity.user.name) }}</span>
              </div>
              <span class="text-xs text-gray-500 ml-2">{{ activity.user.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="activities.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
        <p class="text-gray-500">Activity feed will appear here as team members work on the project.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ActivityFeed.ts"></script>
<style scoped src="./ActivityFeed.css"></style>
