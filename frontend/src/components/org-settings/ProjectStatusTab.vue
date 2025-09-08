<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-text-primary">Project Statuses</h3>
        <p class="text-text-secondary">Manage project statuses organized by categories</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Status
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          class="input"
          placeholder="Search statuses..."
        />
      </div>
      <div class="flex gap-2">
        <select v-model="categoryFilter" class="input">
          <option value="">All Categories</option>
          <option value="todo">ToDo</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <select v-model="statusFilter" class="input">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Statuses by Category -->
    <div v-else-if="groupedStatuses && Object.keys(groupedStatuses).length > 0" class="space-y-6">
      <div v-for="(statuses, category) in groupedStatuses" :key="category" class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-md font-semibold text-text-primary">
            {{ getCategoryLabel(category) }}
          </h4>
          <span class="text-sm text-text-secondary">
            {{ statuses.length }} status{{ statuses.length !== 1 ? 'es' : '' }}
          </span>
        </div>

        <!-- Statuses Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="status in statuses"
            :key="status.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :style="{ 
                    backgroundColor: status.color,
                    color: getContrastColor(status.color)
                  }"
                >
                  {{ status.name }}
                </span>
                <span
                  v-if="status.is_locked"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  System
                </span>
              </div>
              <div class="flex items-center space-x-1">
                <button
                  @click="editStatus(status)"
                  class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit status"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                
                <!-- Show lock icon for system-defined statuses -->
                <div v-if="status.is_locked" class="p-1 text-blue-500" title="System-defined status (locked)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                
                <!-- Show delete icon for user-defined statuses -->
                <button
                  v-else
                  @click="deleteStatus(status)"
                  class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete status"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-text-secondary">Category:</span>
                <span class="text-text-primary">{{ getCategoryLabel(status.category) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-text-secondary">Status:</span>
                <span
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    status.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ status.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-text-secondary">Sort Order:</span>
                <span class="text-text-primary">{{ status.sort_order }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
      </svg>
      <h3 class="text-lg font-medium text-text-primary mb-2">No Project Statuses</h3>
      <p class="text-text-secondary mb-4">Create your first project status to get started.</p>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add First Status
      </button>
    </div>

    <!-- Modals -->
    <ProjectStatusModal
      :show="showCreateModal || showEditModal"
      :project-status="selectedStatus"
      :is-edit="showEditModal"
      @close="closeModals"
      @saved="handleStatusSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { projectStatusApi } from '@/utils/api'
import { getContrastColor } from '@/utils/colors'
import ProjectStatusModal from '@/components/modals/ProjectStatusModal.vue'

const loading = ref(false)
const projectStatuses = ref([])
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedStatus = ref(null)

const categoryOptions = {
  todo: 'ToDo',
  in_progress: 'In Progress',
  closed: 'Closed'
}

const getCategoryLabel = (category: string) => {
  return categoryOptions[category as keyof typeof categoryOptions] || category
}


const groupedStatuses = computed(() => {
  let filtered = projectStatuses.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((status: any) =>
      status.name.toLowerCase().includes(query) ||
      status.category.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter((status: any) => status.category === categoryFilter.value)
  }

  // Apply status filter
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter((status: any) => status.is_active === isActive)
  }

  // Group by category
  const grouped: any = {}
  filtered.forEach((status: any) => {
    if (!grouped[status.category]) {
      grouped[status.category] = []
    }
    grouped[status.category].push(status)
  })

  // Sort statuses within each category by sort_order, then by name
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a: any, b: any) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order
      }
      return a.name.localeCompare(b.name)
    })
  })

  return grouped
})

const loadProjectStatuses = async () => {
  loading.value = true
  try {
    const response = await projectStatusApi.getGroupedByCategory()
    // The API returns { statuses: { category1: [...], category2: [...] }, categories: [...] }
    // We need to flatten the grouped statuses into a single array
    if (response.statuses) {
      projectStatuses.value = Object.values(response.statuses).flat()
    } else {
      projectStatuses.value = []
    }
  } catch (error) {
    console.error('Error loading project statuses:', error)
    projectStatuses.value = []
  } finally {
    loading.value = false
  }
}

const editStatus = (status: any) => {
  selectedStatus.value = status
  showEditModal.value = true
}

const deleteStatus = async (status: any) => {
  if (status.is_system_defined) {
    alert('Cannot delete system-defined statuses')
    return
  }

  if (!confirm(`Are you sure you want to delete the status "${status.name}"?`)) {
    return
  }

  try {
    await projectStatusApi.deleteProjectStatus(status.id)
    await loadProjectStatuses()
  } catch (error) {
    console.error('Error deleting project status:', error)
    alert('Failed to delete status. Please try again.')
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedStatus.value = null
}

const handleStatusSaved = () => {
  loadProjectStatuses()
}

onMounted(() => {
  loadProjectStatuses()
})

// Watch for filter changes to trigger re-computation
watch([searchQuery, categoryFilter, statusFilter], () => {
  // The computed property will automatically update
})
</script>
