<template>
  <AppLayout>
    <!-- Welcome Section -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold mb-2">Welcome back, {{ user?.name || 'User' }}!</h2>
            <p class="text-primary-100 text-lg">Ready to tackle your projects today?</p>
          </div>
          <div class="hidden md:block">
            <div class="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 bg-secondary-100 rounded-lg">
            <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-text-secondary">Projects</p>
            <p class="text-2xl font-bold text-text-primary">0</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 bg-accent-100 rounded-lg">
            <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-text-secondary">Tasks</p>
            <p class="text-2xl font-bold text-text-primary">0</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-text-secondary">Team Members</p>
            <p class="text-2xl font-bold text-text-primary">1</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Activity -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-text-primary">Welcome to Orbit IQ!</p>
              <p class="text-xs text-text-secondary">Your account has been created successfully</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div class="space-y-3">

          <button class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
            <div class="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-text-primary">Create Project</p>
              <p class="text-xs text-text-secondary">Start a new project</p>
            </div>
          </button>

          <button class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
            <div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-text-primary">Invite Team Members</p>
              <p class="text-xs text-text-secondary">Collaborate with your team</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>
