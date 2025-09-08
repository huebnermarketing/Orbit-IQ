<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 sidebar flex flex-col transition-all duration-300 ease-in-out"
      :class="sidebarCollapsed ? 'w-16' : 'w-64'"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div class="flex items-center" :class="sidebarCollapsed ? 'justify-center w-full' : 'space-x-3'">
          <div 
            class="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="sidebarCollapsed ? 'w-12 h-12' : 'w-8 h-8'"
          >
            <svg 
              class="text-white flex-shrink-0" 
              :class="sidebarCollapsed ? 'w-7 h-7' : 'w-5 h-5'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span v-if="!sidebarCollapsed" class="text-xl font-bold gradient-text">Orbit IQ</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 space-y-2 overflow-y-auto" :class="sidebarCollapsed ? 'px-2' : 'px-4'">
        <router-link
          to="/dashboard"
          :class="[
            sidebarCollapsed ? 'nav-item-collapsed' : 'nav-item',
            $route.name === 'Dashboard' ? 'nav-item-active' : 'nav-item-inactive'
          ]"
          :title="sidebarCollapsed ? 'Dashboard' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
          </svg>
          <span v-if="!sidebarCollapsed">Dashboard</span>
        </router-link>


        <router-link
          to="/projects"
          :class="[
            sidebarCollapsed ? 'nav-item-collapsed' : 'nav-item',
            $route.path.startsWith('/project') ? 'nav-item-active' : 'nav-item-inactive'
          ]"
          :title="sidebarCollapsed ? 'Projects' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span v-if="!sidebarCollapsed">Projects</span>
        </router-link>

        <router-link
          to="/tasks"
          :class="[
            sidebarCollapsed ? 'nav-item-collapsed' : 'nav-item',
            $route.path.startsWith('/task') ? 'nav-item-active' : 'nav-item-inactive'
          ]"
          :title="sidebarCollapsed ? 'Tasks' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span v-if="!sidebarCollapsed">Tasks</span>
        </router-link>



      </nav>

      <!-- User Profile Section - Fixed at Bottom -->
      <div class="border-t border-border-light mt-auto" :class="sidebarCollapsed ? 'p-2' : 'p-4'">
        <div class="relative">
          <!-- Profile Button -->
          <button
            @click="toggleProfileDropdown"
            class="w-full flex items-center hover:bg-surface-alt rounded-lg p-2 -m-2 transition-colors"
            :class="sidebarCollapsed ? 'justify-center' : 'space-x-3'"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                v-if="user?.avatar" 
                :src="`/storage/${user.avatar}`" 
                :alt="user.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white font-medium text-sm">
                {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </div>
            <div v-if="!sidebarCollapsed" class="flex-1 min-w-0 text-left">
              <p class="text-sm font-medium text-text-primary truncate">
                {{ user?.name || 'Loading...' }}
              </p>
              <p class="text-xs text-text-secondary truncate">
                {{ user?.email || 'Loading...' }}
              </p>
            </div>
            <svg 
              v-if="!sidebarCollapsed"
              class="w-4 h-4 text-text-muted transition-transform"
              :class="{ 'rotate-180': showProfileDropdown }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="showProfileDropdown"
            class="absolute bottom-full mb-2 bg-surface border border-border-light rounded-lg shadow-lg z-50"
            :class="sidebarCollapsed ? 'left-0 w-48' : 'left-0 right-0'"
          >
            <div class="py-1">
              <router-link
                to="/settings"
                @click="showProfileDropdown = false"
                class="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-alt transition-colors"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile
              </router-link>
              
              <router-link
                v-if="user && user.role && ['super_admin', 'admin'].includes(user.role)"
                to="/org-settings"
                @click="showProfileDropdown = false"
                class="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-alt transition-colors"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Org. Settings
              </router-link>
              
              <div class="border-t border-border-light my-1"></div>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out" :class="sidebarCollapsed ? 'pl-16' : 'pl-64'">
      <!-- Top Bar -->
      <header class="bg-surface border-b border-border-light px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Sidebar Toggle Button -->
            <button
              @click="toggleSidebar"
              class="p-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-text-primary">
                {{ pageTitle }}
              </h1>
              <p class="text-text-secondary mt-1">
                {{ pageDescription }}
              </p>
            </div>
          </div>
          
          <!-- Notifications -->
          <!-- <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z"></path>
              </svg>
            </button>
          </div> -->
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const showProfileDropdown = ref(false)
const sidebarCollapsed = ref(false)

// Load sidebar state from localStorage
const loadSidebarState = () => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = JSON.parse(savedState)
  }
}

// Save sidebar state to localStorage
const saveSidebarState = () => {
  localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed.value))
}

const pageTitle = computed(() => {
  const route = router.currentRoute.value
  switch (route.name) {
    case 'Dashboard': return 'Dashboard'
    case 'Project': return 'Project'
    case 'Task': return 'Task'
    case 'Team': return 'Team'
    case 'Settings': return 'Settings'
    default: return 'Orbit IQ'
  }
})

const pageDescription = computed(() => {
  const route = router.currentRoute.value
  switch (route.name) {
    case 'Dashboard': return 'Overview of your projects and tasks'
    case 'Project': return 'Project details and management'
    case 'Task': return 'Task details and management'
    case 'Team': return 'Team collaboration and management'
    case 'Settings': return 'Account and application settings'
    default: return 'Project Management System'
  }
})

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}


const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  saveSidebarState()
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadSidebarState()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
