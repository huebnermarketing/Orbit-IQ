import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

interface SearchResult {
  id: string | number
  type: string
  title: string
  description: string
}

interface Notification {
  id: number
  title: string
  message: string
  read: boolean
  created_at: Date
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const showProfileDropdown = ref(false)
    const sidebarCollapsed = ref(false)

    // Search functionality
    const searchInput = ref<HTMLInputElement>()
    const searchQuery = ref('')
    const searchResults = ref<SearchResult[]>([])
    const showSearchResults = ref(false)
    const searchLoading = ref(false)
    const searchTimeout = ref<ReturnType<typeof setTimeout>>()

    // Notifications functionality
    const showNotifications = ref(false)
    const notifications = ref<Notification[]>([
      {
        id: 1,
        title: 'Project Update',
        message: 'Marketing Campaign project has been updated',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 2,
        title: 'Task Assigned',
        message: 'You have been assigned a new task in Development project',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: 3,
        title: 'Team Meeting',
        message: 'Team meeting scheduled for tomorrow at 10 AM',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ])

    const unreadNotificationsCount = computed(() => {
      return notifications.value.filter(notification => !notification.read).length
    })

    const isMac = computed(() => {
      if (process.client) {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0
      }
      return false
    })

    // Helper function for user initials
    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Load sidebar state from cookie
    const loadSidebarState = () => {
      if (process.client) {
        const savedState = localStorage.getItem('sidebarCollapsed')
        if (savedState !== null) {
          sidebarCollapsed.value = JSON.parse(savedState)
        }
      }
    }

    // Save sidebar state to localStorage
    const saveSidebarState = () => {
      if (process.client) {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed.value))
      }
    }

    const toggleProfileDropdown = () => {
      showProfileDropdown.value = !showProfileDropdown.value
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/auth/login')
    }

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
      saveSidebarState()
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
            $fetch('/api/projects', {
              query: { search: query },
              headers: useRequestHeaders(['cookie'])
            }) as Promise<any>,
            $fetch('/api/tasks', {
              query: { search: query },
              headers: useRequestHeaders(['cookie'])
            }) as Promise<any>
          ])
          
          const results: SearchResult[] = []
          
          // Add project results
          if (projects?.data) {
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
          if (tasks?.data) {
            tasks.data.forEach((task: any) => {
              results.push({
                id: task.id,
                type: 'task',
                title: task.name,
                description: `${task.project?.name || 'No project'} • ${task.status}`
              })
            })
          }
          
          searchResults.value = results.slice(0, 10)
        } catch (error) {
          console.error('Search error:', error)
          searchResults.value = []
        } finally {
          searchLoading.value = false
        }
      }, 300)
    }

    const handleSearchBlur = () => {
      setTimeout(() => {
        showSearchResults.value = false
      }, 200)
    }

    const navigateToResult = (result: SearchResult) => {
      showSearchResults.value = false
      searchQuery.value = ''
      
      if (result.type === 'project') {
        router.push(`/projects/${result.id}`)
      } else if (result.type === 'task') {
        router.push(`/tasks/${result.id}`)
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

    const handleNotificationClick = (notification: Notification) => {
      notification.read = true
      showNotifications.value = false
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
      router.push('/notifications')
    }

    // Keyboard shortcut handler
    const handleKeydown = (event: KeyboardEvent) => {
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
      if (process.client) {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('keydown', handleKeydown)
        loadSidebarState()
      }
    })

    onUnmounted(() => {
      if (process.client) {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleKeydown)
        
        if (searchTimeout.value) {
          clearTimeout(searchTimeout.value)
        }
      }
    })

    return {
      user,
      showProfileDropdown,
      sidebarCollapsed,
      searchInput,
      searchQuery,
      searchResults,
      showSearchResults,
      searchLoading,
      showNotifications,
      notifications,
      unreadNotificationsCount,
      isMac,
      getInitials,
      toggleProfileDropdown,
      handleLogout,
      toggleSidebar,
      handleSearch,
      handleSearchBlur,
      navigateToResult,
      getResultIcon,
      toggleNotifications,
      markAllAsRead,
      handleNotificationClick,
      formatNotificationTime,
      viewAllNotifications
    }
  }
})