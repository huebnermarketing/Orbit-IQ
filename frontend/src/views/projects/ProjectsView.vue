<template>
  <AppLayout>
    <div class="w-full space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">Projects</h1>
          <p class="text-text-secondary mt-1">Manage and track your projects</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="btn-primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Project
        </button>
      </div>

      <!-- Filters and Search -->
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="input"
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="statusFilter" class="input w-full sm:w-40">
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <select v-model="priorityFilter" class="input w-full sm:w-40">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <!-- Projects Table -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-text-muted">Loading projects...</span>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2">No projects found</h3>
        <p class="text-text-muted mb-4">Get started by creating your first project.</p>
        <button @click="showCreateModal = true" class="btn-primary">
          Create Project
        </button>
      </div>

      <div v-else class="card overflow-hidden">
        <!-- Table Header with Column Visibility -->
        <div class="px-6 py-4 border-b border-border-light bg-surface-alt">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-text-primary">Projects</h3>
            <div class="relative">
              <button
                @click="showColumnMenu = !showColumnMenu"
                class="p-2 text-text-muted hover:text-text-primary transition-colors"
                title="Show/Hide Columns"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </button>
              
              <!-- Column Visibility Menu -->
              <div
                v-if="showColumnMenu"
                class="absolute right-0 mt-2 w-48 bg-surface border border-border-light rounded-lg shadow-lg z-10"
              >
                <div class="p-2">
                  <div class="text-xs font-medium text-text-secondary mb-2 px-2">Show/Hide Columns</div>
                  <div class="space-y-1">
                    <label
                      v-for="column in tableColumns"
                      :key="column.key"
                      class="flex items-center px-2 py-1 hover:bg-surface-alt rounded cursor-pointer"
                    >
                      <input
                        v-model="column.visible"
                        type="checkbox"
                        class="mr-2 rounded border-border-light text-primary-600 focus:ring-primary-500"
                      />
                      <span class="text-sm text-text-primary">{{ column.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-border-light">
            <thead class="bg-surface-alt">
              <tr>
                <th
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-border-light">
              <tr
                v-for="project in filteredProjects"
                :key="project.id"
                class="hover:bg-surface-alt"
              >
                <!-- Project Name -->
                <td v-if="isColumnVisible('name')" class="px-6 py-4 whitespace-nowrap">
                  <div class="cursor-pointer" @click="viewProject(project.id)">
                    <div class="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">{{ project.name }}</div>
                    <div class="text-sm text-text-muted">{{ project.project_number }}</div>
                  </div>
                </td>

                <!-- Client/Subclient -->
                <td v-if="isColumnVisible('client')" class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-text-primary">{{ project.client?.company_name }}</div>
                  <div v-if="project.sub_client?.name" class="text-sm text-text-muted">{{ project.sub_client.name }}</div>
                </td>

                <!-- Funding Source -->
                <td v-if="isColumnVisible('funding')" class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-text-primary capitalize">{{ project.funding_source }}</div>
                  <div class="text-sm text-text-muted capitalize">{{ project.hour_type }}</div>
                </td>

                <!-- Project Status -->
                <td v-if="isColumnVisible('status')" class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="project.project_status"
                    :style="{ backgroundColor: project.project_status.color, color: 'white' }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ project.project_status.name }}
                  </span>
                  <span v-else class="text-sm text-text-muted">No Status</span>
                </td>

                <!-- Project Type -->
                <td v-if="isColumnVisible('type')" class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="project.project_type"
                    :style="{ backgroundColor: project.project_type.color, color: 'white' }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ project.project_type.name }}
                  </span>
                  <span v-else class="text-sm text-text-muted">N/A</span>
                </td>

                <!-- Created Date -->
                <td v-if="isColumnVisible('created_date')" class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                  {{ formatDate(project.created_at) }}
                </td>

                <!-- Due Date -->
                <td v-if="isColumnVisible('due_date')" class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                  {{ formatDate(project.due_date) }}
                </td>

                <!-- Last Updated -->
                <td v-if="isColumnVisible('last_updated')" class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                  {{ formatDate(project.updated_at) }}
                </td>

                <!-- Account Manager -->
                <td v-if="isColumnVisible('am')" class="px-6 py-4 whitespace-nowrap">
                  <div v-if="project.account_manager" class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center overflow-hidden">
                        <img 
                          v-if="project.account_manager.avatar" 
                          :src="`/storage/${project.account_manager.avatar}`" 
                          :alt="project.account_manager.name"
                          class="w-full h-full object-cover"
                        />
                        <span v-else class="text-xs font-medium text-white">{{ getInitials(project.account_manager.name) }}</span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-text-primary">{{ project.account_manager.name }}</div>
                      <div class="text-sm text-text-muted">{{ project.account_manager.email }}</div>
                    </div>
                  </div>
                  <span v-else class="text-sm text-text-muted">Not assigned</span>
                </td>

                <!-- Project Manager -->
                <td v-if="isColumnVisible('pm')" class="px-6 py-4 whitespace-nowrap">
                  <div v-if="project.project_manager" class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center overflow-hidden">
                        <img 
                          v-if="project.project_manager.avatar" 
                          :src="`/storage/${project.project_manager.avatar}`" 
                          :alt="project.project_manager.name"
                          class="w-full h-full object-cover"
                        />
                        <span v-else class="text-xs font-medium text-white">{{ getInitials(project.project_manager.name) }}</span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-text-primary">{{ project.project_manager.name }}</div>
                      <div class="text-sm text-text-muted">{{ project.project_manager.email }}</div>
                    </div>
                  </div>
                  <span v-else class="text-sm text-text-muted">Not assigned</span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <ProjectModal
      v-if="showCreateModal"
      :show="showCreateModal"
      @close="showCreateModal = false"
      @saved="handleProjectSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectModal from '@/components/modals/ProjectModal.vue'
import { authApi } from '@/utils/api'
import { getInitials } from '@/utils/helpers'

const router = useRouter()

// Reactive data
const loading = ref(false)
const showCreateModal = ref(false)
const showColumnMenu = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Table columns configuration
const tableColumns = ref([
  { key: 'name', label: 'Project Name', visible: true },
  { key: 'client', label: 'Client/Subclient', visible: true },
  { key: 'funding', label: 'Funding Source', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'type', label: 'Project Type', visible: true },
  { key: 'created_date', label: 'Created Date', visible: true },
  { key: 'due_date', label: 'Due Date', visible: true },
  { key: 'last_updated', label: 'Last Updated', visible: false },
  { key: 'am', label: 'Account Manager', visible: true },
  { key: 'pm', label: 'Project Manager', visible: true }
])

// Projects data - will be loaded from API
const projects = ref([])

// Computed properties
const filteredProjects = computed(() => {
  let filtered = projects.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.project_number.toLowerCase().includes(query) ||
      project.client?.company_name.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(project => project.project_status?.name === statusFilter.value)
  }

  return filtered
})

const visibleColumns = computed(() => {
  return tableColumns.value.filter(column => column.visible)
})

// Methods
// Note: Status and type colors are now dynamically loaded from the database
// No need for hardcoded badge classes

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const isColumnVisible = (columnKey: string) => {
  const column = tableColumns.value.find(col => col.key === columnKey)
  return column ? column.visible : false
}

// getInitials function is now imported from utils/helpers

const saveColumnPreferences = () => {
  const preferences = tableColumns.value.reduce((acc, column) => {
    acc[column.key] = column.visible
    return acc
  }, {} as Record<string, boolean>)
  localStorage.setItem('project-table-columns', JSON.stringify(preferences))
}

const loadColumnPreferences = () => {
  try {
    const saved = localStorage.getItem('project-table-columns')
    if (saved) {
      const preferences = JSON.parse(saved)
      tableColumns.value.forEach(column => {
        if (preferences.hasOwnProperty(column.key)) {
          column.visible = preferences[column.key]
        }
      })
    }
  } catch (error) {
    console.warn('Failed to load column preferences:', error)
  }
}

const viewProject = (projectId: number) => {
  router.push(`/project/${projectId}`)
}

const loadProjects = async () => {
  loading.value = true
  try {
    const response = await authApi.getProjects()
    projects.value = response.data || []
    console.log('Projects loaded:', projects.value)
  } catch (error) {
    console.error('Failed to load projects:', error)
  } finally {
    loading.value = false
  }
}

const handleProjectSaved = (project: any) => {
  console.log('Project saved:', project)
  // Add the new project to the list
  projects.value.unshift(project)
  showCreateModal.value = false
}

// Watch for column visibility changes and save preferences
watch(tableColumns, () => {
  saveColumnPreferences()
}, { deep: true })

// Close column menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showColumnMenu.value = false
  }
}

onMounted(() => {
  // Load column preferences
  loadColumnPreferences()
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
  
  // Load projects from API
  loadProjects()
})

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})
</script>
