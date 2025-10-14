import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Types
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface Client {
  id: number
  company_name: string
}

interface Subclient {
  id: number
  name: string
}

interface ProjectStatus {
  id: number
  name: string
  color: string
}

interface ProjectType {
  id: number
  name: string
  color: string
}

interface Project {
  id: number
  name: string
  project_number: string
  description?: string
  client?: Client
  subclient?: Subclient
  funding_source?: string
  hour_type?: string
  project_status?: ProjectStatus
  project_type?: ProjectType
  created_at: string
  due_date?: string
  account_manager?: User
  project_manager?: User
}

interface TableColumn {
  key: string
  label: string
  visible: boolean
}

export default defineComponent({
  name: 'ProjectsView',
  setup() {
    // State
    const projects = ref<Project[]>([])
    const loading = ref(true)
    const searchQuery = ref('')
    const statusFilter = ref('')
    const priorityFilter = ref('')
    const showColumnMenu = ref(false)
    
    // Table columns configuration
    const tableColumns = ref<TableColumn[]>([
      { key: 'name', label: 'Project Name', visible: true },
      { key: 'client', label: 'Client/Subclient', visible: true },
      { key: 'funding', label: 'Funding Source', visible: true },
      { key: 'status', label: 'Status', visible: true },
      { key: 'type', label: 'Project Type', visible: true },
      { key: 'created_date', label: 'Created Date', visible: true },
      { key: 'due_date', label: 'Due Date', visible: true },
      { key: 'am', label: 'Account Manager', visible: true },
      { key: 'pm', label: 'Project Manager', visible: true }
    ])

    // Computed
    const visibleColumns = computed(() => {
      return tableColumns.value.filter(column => column.visible)
    })

    const filteredProjects = computed(() => {
      let filtered = projects.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(project => {
          return (
            project.name.toLowerCase().includes(query) ||
            project.project_number.toLowerCase().includes(query) ||
            project.client?.company_name.toLowerCase().includes(query) ||
            project.subclient?.name.toLowerCase().includes(query)
          )
        })
      }

      // Status filter
      if (statusFilter.value) {
        filtered = filtered.filter(project => {
          return project.project_status?.name.toLowerCase() === statusFilter.value.toLowerCase()
        })
      }

      // Priority filter (if needed, currently not in data structure)
      if (priorityFilter.value) {
        // Implement priority filtering when priority field is added to Project type
      }

      return filtered
    })

    // Methods
    const loadProjects = async () => {
      try {
        loading.value = true
        const config = useRuntimeConfig()
        const token = useCookie('auth_token')
        
        const response = await $fetch<{ data: Project[] }>(`${config.public.apiBase}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
          }
        })
        
        projects.value = response.data || []
      } catch (error) {
        console.error('Failed to load projects:', error)
        projects.value = []
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date: string | null | undefined): string => {
      if (!date) return '-'
      
      try {
        const d = new Date(date)
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }
        return d.toLocaleDateString('en-US', options)
      } catch {
        return '-'
      }
    }

    const getInitials = (name: string): string => {
      if (!name) return '?'
      
      const parts = name.trim().split(' ').filter(p => p.length > 0)
      if (parts.length >= 2) {
        const firstChar = parts[0]?.[0]
        const lastChar = parts[parts.length - 1]?.[0]
        if (firstChar && lastChar) {
          return (firstChar + lastChar).toUpperCase()
        }
      }
      return name.substring(0, 2).toUpperCase()
    }

    const isColumnVisible = (key: string): boolean => {
      const column = tableColumns.value.find(col => col.key === key)
      return column ? column.visible : false
    }

    const getStatusClass = (status: string): string => {
      const statusLower = status.toLowerCase()
      
      const statusClasses: Record<string, string> = {
        'planning': 'bg-blue-100 text-blue-800',
        'active': 'bg-green-100 text-green-800',
        'on-hold': 'bg-yellow-100 text-yellow-800',
        'on hold': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-gray-100 text-gray-800',
        'cancelled': 'bg-red-100 text-red-800',
        'archived': 'bg-gray-100 text-gray-600'
      }
      
      return statusClasses[statusLower] || 'bg-gray-100 text-gray-800'
    }

    const viewProject = (projectId: number) => {
      navigateTo(`/projects/${projectId}`)
    }

    const handleCreateProject = () => {
      // Navigate to create project page or open modal
      navigateTo('/projects/create')
    }

    // Lifecycle
    onMounted(() => {
      loadProjects()
    })

    // Close column menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        showColumnMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      projects,
      loading,
      searchQuery,
      statusFilter,
      priorityFilter,
      showColumnMenu,
      tableColumns,
      visibleColumns,
      filteredProjects,
      loadProjects,
      formatDate,
      getInitials,
      isColumnVisible,
      getStatusClass,
      viewProject,
      handleCreateProject
    }
  }
})