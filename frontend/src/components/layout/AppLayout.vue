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
          <div class="w-5 h-5 flex items-center justify-center flex-shrink-0" :class="sidebarCollapsed ? '' : 'mr-3'">
            <i class="fas fa-home"></i>
          </div>
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
          <div class="w-5 h-5 flex items-center justify-center flex-shrink-0" :class="sidebarCollapsed ? '' : 'mr-3'">
            <i class="fas fa-folder-open"></i>
          </div>
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
          <div class="w-5 h-5 flex items-center justify-center flex-shrink-0" :class="sidebarCollapsed ? '' : 'mr-3'">
            <i class="fas fa-tasks"></i>
          </div>
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
                {{ getInitials(user?.name || '') }}
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
            <i
              v-if="!sidebarCollapsed"
              class="fas fa-chevron-down w-4 h-4 text-text-muted transition-transform"
              :class="{ 'rotate-180': showProfileDropdown }"
            ></i>
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
                <i class="fas fa-user w-4 h-4 mr-3"></i>
                Profile
              </router-link>
              
              <router-link
                v-if="user && user.role && ['super_admin', 'admin'].includes(user.role)"
                to="/org-settings"
                @click="showProfileDropdown = false"
                class="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-alt transition-colors"
              >
                <i class="fas fa-cog w-4 h-4 mr-3"></i>
                Org. Settings
              </router-link>
              
              <div class="border-t border-border-light my-1"></div>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
              >
                <i class="fas fa-sign-out-alt w-4 h-4 mr-3"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out" :class="sidebarCollapsed ? 'pl-16' : 'pl-64'">
      <!-- Top Bar - Sticky Header with Global Search -->
      <header
        class="sticky top-0 z-40 bg-surface border-b border-border-light px-6 py-3"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 flex-1">
            <!-- Sidebar Toggle Button -->
            <button
              @click="toggleSidebar"
              class="p-2 text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
              title="Toggle Navigation"
            >
              <i class="fas fa-bars w-6 h-6"></i>
            </button>
            
            <!-- Global Search Bar -->
            <div class="flex-1 max-w-2xl relative">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search h-5 w-5 text-text-muted"></i>
                </div>
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  @input="handleSearch"
                  @focus="showSearchResults = true"
                  @blur="handleSearchBlur"
                  type="text"
                  placeholder="Search projects, tasks, users... (Ctrl+F)"
                  class="block w-full pl-10 pr-12 py-2 border border-border-light rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <kbd class="inline-flex items-center px-2 py-1 text-xs font-medium text-text-muted bg-surface-alt rounded border border-border-light">
                    {{ isMac ? '⌘' : 'Ctrl' }}+F
                  </kbd>
                </div>
              </div>
              
              <!-- Search Results Dropdown -->
              <div
                v-if="showSearchResults && (searchQuery || searchResults.length > 0)"
                class="absolute top-full mt-2 w-full bg-surface border border-border-light rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
              >
                <div v-if="searchQuery && searchResults.length === 0 && !searchLoading" class="p-4 text-center text-text-muted">
                  No results found for "{{ searchQuery }}"
                </div>
                <div v-if="searchLoading" class="p-4 text-center text-text-muted">
                  Searching...
                </div>
                <div v-if="searchResults.length > 0" class="py-2">
                  <div
                    v-for="result in searchResults"
                    :key="`${result.type}-${result.id}`"
                    @click="navigateToResult(result)"
                    class="px-4 py-3 hover:bg-surface-alt cursor-pointer border-b border-border-light last:border-b-0"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                          :class="getResultIcon(result.type).color"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getResultIcon(result.type).icon"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-text-primary truncate">
                          {{ result.title }}
                        </p>
                        <p class="text-xs text-text-secondary truncate">
                          {{ result.description }}
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-alt text-text-muted">
                          {{ result.type }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Notifications Bell -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button
                @click="toggleNotifications"
                class="p-2 text-text-muted hover:text-text-primary transition-colors relative"
                title="Notifications"
              >
                <i class="fas fa-bell w-6 h-6"></i>
                
                <!-- Unread count badge -->
                <span
                  v-if="unreadNotificationsCount > 0"
                  class="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount }}
                </span>
              </button>
              
              <!-- Notifications Overlay -->
              <div
                v-if="showNotifications"
                class="absolute top-full right-0 mt-2 w-80 bg-surface border border-border-light rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
              >
                <div class="p-4 border-b border-border-light">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-text-primary">Notifications</h3>
                    <button
                      v-if="unreadNotificationsCount > 0"
                      @click="markAllAsRead"
                      class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                </div>
                
                <div class="max-h-80 overflow-y-auto">
                  <div v-if="notifications.length === 0" class="p-4 text-center text-text-muted">
                    No notifications yet
                  </div>
                  
                  <div v-else class="py-2">
                    <div
                      v-for="notification in notifications"
                      :key="notification.id"
                      @click="handleNotificationClick(notification)"
                      class="px-4 py-3 hover:bg-surface-alt cursor-pointer border-b border-border-light last:border-b-0"
                      :class="!notification.read ? 'bg-primary-50' : ''"
                    >
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0 mt-1">
                          <div
                            class="w-2 h-2 rounded-full"
                            :class="!notification.read ? 'bg-primary-500' : 'bg-transparent'"
                          ></div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-text-primary truncate">
                            {{ notification.title }}
                          </p>
                          <p class="text-sm text-text-secondary mt-1">
                            {{ notification.message }}
                          </p>
                          <p class="text-xs text-text-muted mt-2">
                            {{ formatNotificationTime(notification.created_at) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="p-3 border-t border-border-light bg-surface-alt">
                  <button
                    @click="viewAllNotifications"
                    class="w-full text-sm text-primary-600 hover:text-primary-700 font-medium text-center py-1"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
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
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getInitials } from '@/utils/helpers'
import { projectApi, taskApi } from '@/utils/api'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const showProfileDropdown = ref(false)
const sidebarCollapsed = ref(false)
const isCompact = ref(false)

// Search functionality
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showSearchResults = ref(false)
const searchLoading = ref(false)
const searchTimeout = ref<NodeJS.Timeout>()

// Notifications functionality
const showNotifications = ref(false)
const notifications = ref<any[]>([
  // Mock notifications for demo - will be replaced with real API calls later
  {
    id: 1,
    title: 'Project Update',
    message: 'Marketing Campaign project has been updated',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    title: 'Task Assigned',
    message: 'You have been assigned a new task in Development project',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    title: 'Team Meeting',
    message: 'Team meeting scheduled for tomorrow at 10 AM',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
])

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter(notification => !notification.read).length
})

// Detect if user is on Mac
const isMac = computed(() => {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0
})

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

const isProjectDetailPage = computed(() => {
  const route = router.currentRoute.value
  return route.name === 'Project' && route.params.id
})

const pageTitle = computed(() => {
  const route = router.currentRoute.value
  
  // For project detail pages, we'll let the ProjectView handle its own title
  if (isProjectDetailPage.value) {
    return 'Project'
  }
  
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
  
  // For project detail pages, we'll let the ProjectView handle its own description
  if (isProjectDetailPage.value) {
    return ''
  }
  
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

// Handle scroll for compact header
const handleScroll = () => {
  const scrollY = window.scrollY
  isCompact.value = scrollY > 50
}

// Search functionality
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(async () => {
    const query = searchQuery.value.trim()
    if (!query) {
      searchResults.value = []
      return
    }
    
    searchLoading.value = true
    try {
      const [projects, tasks] = await Promise.all([
        projectApi.getProjects({ search: query }),
        taskApi.getTasks({ search: query })
      ])
      
      const results: Array<{
        id: string | number
        type: string
        title: string
        description: string
      }> = []
      
      // Add project results
      if (projects.data) {
        projects.data.forEach((project: any) => {
          results.push({
            id: project.id,
            type: 'project',
            title: project.name,
            description: `${project.project_number} • ${project.client?.company_name || 'No client'}`
          })
        })
      }
      
      // Add task results
      if (tasks.data) {
        tasks.data.forEach((task: any) => {
          results.push({
            id: task.id,
            type: 'task',
            title: task.name,
            description: `${task.project?.name || 'No project'} • ${task.status}`
          })
        })
      }
      
      searchResults.value = results.slice(0, 10) // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 300) // Debounce search
}

const handleSearchBlur = () => {
  // Delay hiding to allow clicking on results
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const navigateToResult = (result: any) => {
  showSearchResults.value = false
  searchQuery.value = ''
  
  if (result.type === 'project') {
    router.push(`/project/${result.id}`)
  } else if (result.type === 'task') {
    router.push(`/task/${result.id}`)
  }
}

const getResultIcon = (type: string) => {
  const icons = {
    project: {
      icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      color: 'bg-blue-500'
    },
    task: {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'bg-green-500'
    },
    user: {
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'bg-purple-500'
    }
  }
  return icons[type as keyof typeof icons] || icons.project
}

// Notifications functionality
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const handleNotificationClick = (notification: any) => {
  // Mark as read when clicked
  notification.read = true
  showNotifications.value = false
  
  // Navigate based on notification type
  // This will be implemented later with real notification types
  console.log('Notification clicked:', notification)
}

const formatNotificationTime = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

const viewAllNotifications = () => {
  showNotifications.value = false
  // Navigate to notifications page - to be implemented later
  router.push('/notifications')
}

// Keyboard shortcut handler
const handleKeydown = (event: KeyboardEvent) => {
  // Check for Ctrl+F (Windows/Linux) or Cmd+F (Mac)
  if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showProfileDropdown.value = false
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('scroll', handleScroll)
  document.addEventListener('keydown', handleKeydown)
  loadSidebarState()
  window.addEventListener('toggle-sidebar', toggleSidebar)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('toggle-sidebar', toggleSidebar)
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>
