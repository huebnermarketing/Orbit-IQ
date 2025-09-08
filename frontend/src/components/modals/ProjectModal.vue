<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">
              {{ isEdit ? 'Edit Project' : 'Create New Project' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-text-muted hover:text-text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Project Name and Number -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Name <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="input"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Number <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.project_number"
                  type="text"
                  required
                  class="input"
                  placeholder="Auto-generated"
                />
                <p class="text-xs text-text-muted mt-1">6-digit number (auto-generated, can be modified)</p>
              </div>
            </div>

            <!-- Project Description -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="input"
                placeholder="Enter project description"
              ></textarea>
            </div>

            <!-- Project Status and Priority -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Status <span class="text-error-500">*</span>
                </label>
                <select v-model="form.status" required class="input">
                  <option value="">Select Status</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Priority <span class="text-error-500">*</span>
                </label>
                <select v-model="form.priority" required class="input">
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Due Date
              </label>
              <input
                v-model="form.due_date"
                type="date"
                class="input"
              />
            </div>

            <!-- Project Color -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Project Color
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="form.color"
                  type="color"
                  class="w-12 h-10 border border-border-light rounded cursor-pointer"
                />
                <span class="text-sm text-text-muted">Choose a color for this project</span>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="alert-error">
              <div class="flex">
                <svg class="w-5 h-5 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-error-800">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-border-light">
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
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface Project {
  id?: number
  name: string
  project_number: string
  description: string
  status: string
  priority: string
  due_date: string
  color: string
}

interface Props {
  show: boolean
  project?: Project | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  project: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  saved: [project: Project]
}>()

const loading = ref(false)
const error = ref('')

const form = reactive<Project>({
  name: '',
  project_number: '',
  description: '',
  status: '',
  priority: '',
  due_date: '',
  color: '#3B82F6'
})

// Generate 6-digit project number
const generateProjectNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Watch for project changes to populate form
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.name = newProject.name || ''
    form.project_number = newProject.project_number || ''
    form.description = newProject.description || ''
    form.status = newProject.status || ''
    form.priority = newProject.priority || ''
    form.due_date = newProject.due_date || ''
    form.color = newProject.color || '#3B82F6'
  } else {
    // Reset form and generate new project number
    form.name = ''
    form.project_number = generateProjectNumber()
    form.description = ''
    form.status = ''
    form.priority = ''
    form.due_date = ''
    form.color = '#3B82F6'
  }
}, { immediate: true })

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const projectData: Project = {
      ...form,
      id: props.isEdit ? props.project?.id : Date.now() // Mock ID
    }

    emit('saved', projectData)
  } catch (err) {
    error.value = 'Failed to save project. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
