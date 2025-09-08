<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-surface px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-text-primary">
              {{ isEdit ? 'Edit Project Status' : 'Add Project Status' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-text-muted hover:text-text-primary transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- System Status Warning -->
        <div v-if="isLocked" class="px-6 py-4 bg-info-50 border-b border-info-200">
          <div class="flex">
            <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-info-800">
                This is a system-defined status. You can edit the name, color, and sort order, but it cannot be deleted or made inactive.
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="bg-surface px-6 py-4 space-y-4">
          <!-- Status Name -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Status Name <span class="text-error-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="input"
              placeholder="Enter status name"
              required
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Category <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              class="input"
              required
            >
              <option value="">Select a category</option>
              <option value="todo">ToDo</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              Status Color <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-3">
              <input
                v-model="form.color"
                type="color"
                class="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                required
              />
              <input
                v-model="form.color"
                type="text"
                class="input flex-1"
                placeholder="#3B82F6"
                pattern="^#[0-9A-Fa-f]{6}$"
                required
              />
              <button
                type="button"
                @click="form.color = getRandomColor()"
                class="btn-outline text-xs px-3 py-2"
                title="Pick a random color"
              >
                🎨
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Choose a color for the status badge</p>
          </div>

          <!-- Status Preview -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Preview</label>
            <div class="flex items-center space-x-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :style="{ 
                  backgroundColor: form.color,
                  color: getContrastColor(form.color)
                }"
              >
                {{ form.name || 'Status Name' }}
              </span>
              <span class="text-sm text-gray-500">
                in {{ getCategoryLabel(form.category) || 'Category' }}
              </span>
            </div>
          </div>

          <!-- Active Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                :class="[
                  'rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50',
                  { 'opacity-50 cursor-not-allowed': isLocked }
                ]"
                :disabled="isLocked"
              />
              <span class="ml-2 text-sm text-text-primary">Active</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">
              {{ isLocked ? 'System-defined statuses are always active' : 'Inactive statuses won\'t be available for selection' }}
            </p>
          </div>

          <!-- Sort Order -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Sort Order</label>
            <input
              v-model.number="form.sort_order"
              type="number"
              min="0"
              class="input"
              placeholder="0"
            />
            <p class="text-xs text-gray-500 mt-1">Lower numbers appear first within the category</p>
          </div>

          <!-- System Defined Warning -->
        

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary"
            >
              {{ loading ? 'Saving...' : (isEdit ? 'Update Status' : 'Create Status') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { projectStatusApi } from '@/utils/api'
import { getContrastColor, getRandomColor } from '@/utils/colors'

interface Props {
  show: boolean
  projectStatus?: any
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

const loading = ref(false)
const error = ref('')

const isLocked = computed(() => props.projectStatus?.is_locked || false)

const form = reactive({
  name: '',
  category: '',
  color: '#3B82F6',
  is_active: true,
  sort_order: 0
})

const categoryOptions = {
  todo: 'ToDo',
  in_progress: 'In Progress',
  closed: 'Closed'
}

const getCategoryLabel = (category: string) => {
  return categoryOptions[category as keyof typeof categoryOptions] || category
}


const initializeForm = () => {
  // Clear any previous errors
  error.value = ''
  
  if (props.isEdit && props.projectStatus) {
    form.name = props.projectStatus.name || ''
    form.category = props.projectStatus.category || ''
    form.color = props.projectStatus.color || '#3B82F6'
    form.is_active = props.projectStatus.is_active ?? true
    form.sort_order = props.projectStatus.sort_order || 0
  } else {
    form.name = ''
    form.category = ''
    form.color = '#3B82F6'
    form.is_active = true
    form.sort_order = 0
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const statusData = {
      name: form.name,
      category: form.category,
      color: form.color,
      is_active: form.is_active,
      sort_order: form.sort_order
    }

    if (props.isEdit && props.projectStatus) {
      await projectStatusApi.updateProjectStatus(props.projectStatus.id, statusData)
    } else {
      await projectStatusApi.createProjectStatus(statusData)
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving project status:', err)
    
    // Extract error message from API response - prioritize specific validation errors
    if (err.response?.data?.errors) {
      // Handle validation errors first (most specific)
      const errors = err.response.data.errors
      const errorMessages = Object.values(errors).flat()
      error.value = errorMessages.join(', ')
    } else if (err.response?.data?.message) {
      // Fall back to generic message
      error.value = err.response.data.message
    } else {
      error.value = 'Failed to save project status. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

// Watch for changes in props to reinitialize form
watch(() => props.show, (newShow) => {
  if (newShow) {
    initializeForm()
  }
})

watch(() => props.projectStatus, () => {
  if (props.show) {
    initializeForm()
  }
}, { deep: true })
</script>
