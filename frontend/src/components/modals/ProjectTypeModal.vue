<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">
              {{ isEdit ? 'Edit Project Type' : 'Create New Project Type' }}
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
            <!-- Project Type Name -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Project Type Name <span class="text-error-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                :disabled="isEdit && project?.is_system_defined"
                class="input"
                :class="{ 'opacity-50 cursor-not-allowed': isEdit && project?.is_system_defined }"
                placeholder="Enter project type name"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                :disabled="isEdit && project?.is_system_defined"
                class="input"
                :class="{ 'opacity-50 cursor-not-allowed': isEdit && project?.is_system_defined }"
                placeholder="Enter project type description"
              ></textarea>
            </div>

            <!-- Color and Sort Order -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Color <span class="text-error-500">*</span>
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="form.color"
                    type="color"
                    :disabled="isEdit && project?.is_system_defined"
                    class="w-12 h-10 border border-border-light rounded cursor-pointer"
                    :class="{ 'opacity-50 cursor-not-allowed': isEdit && project?.is_system_defined }"
                  />
                  <input
                    v-model="form.color"
                    type="text"
                    :disabled="isEdit && project?.is_system_defined"
                    class="input flex-1"
                    :class="{ 'opacity-50 cursor-not-allowed': isEdit && project?.is_system_defined }"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Sort Order
                </label>
                <input
                  v-model.number="form.sort_order"
                  type="number"
                  min="0"
                  :disabled="isEdit && project?.is_system_defined"
                  class="input"
                  :class="{ 'opacity-50 cursor-not-allowed': isEdit && project?.is_system_defined }"
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Active Status -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="form.is_active"
                  type="checkbox"
                  :disabled="isEdit && project?.is_system_defined"
                  class="rounded border-border-light text-primary-600 focus:ring-primary-500"
                  :class="{ 'opacity-50 cursor-not-allowed': isEdit && project?.is_system_defined }"
                />
                <span class="ml-2 text-sm text-text-primary">Active</span>
              </label>
            </div>

            <!-- System Defined Warning -->
            <div v-if="isEdit && project?.is_system_defined" class="bg-info-50 border border-info-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-info-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-info-800">
                    This is a system-defined project type (Fixed Cost, Maintenance, Hosting, Adhoc, SaaS). 
                    System-defined project types cannot be modified or deleted as they are core to the platform.
                  </p>
                </div>
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
                :disabled="loading || (isEdit && project?.is_system_defined)"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': isEdit && project?.is_system_defined }"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Saving...' : (isEdit ? 'Update Project Type' : 'Create Project Type') }}
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
import { projectTypeApi } from '@/utils/api'

interface ProjectType {
  id?: number
  name: string
  description: string
  color: string
  sort_order: number
  is_active: boolean
  is_system_defined?: boolean
}

interface Props {
  show: boolean
  projectType?: ProjectType | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  projectType: null,
  isEdit: false
})

const emit = defineEmits<{
  close: []
  saved: [projectType: ProjectType]
}>()

const loading = ref(false)
const error = ref('')

const form = reactive<ProjectType>({
  name: '',
  description: '',
  color: '#3B82F6',
  sort_order: 0,
  is_active: true
})

// Watch for project type changes to populate form
watch(() => props.projectType, (newProjectType) => {
  if (newProjectType) {
    form.name = newProjectType.name || ''
    form.description = newProjectType.description || ''
    form.color = newProjectType.color || '#3B82F6'
    form.sort_order = newProjectType.sort_order || 0
    form.is_active = newProjectType.is_active ?? true
  } else {
    // Reset form
    form.name = ''
    form.description = ''
    form.color = '#3B82F6'
    form.sort_order = 0
    form.is_active = true
  }
}, { immediate: true })

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    let response
    if (props.isEdit && props.projectType?.id) {
      response = await projectTypeApi.updateProjectType(props.projectType.id.toString(), form)
    } else {
      response = await projectTypeApi.createProjectType(form)
    }

    emit('saved', response.data)
  } catch (err: any) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      const firstError = Object.values(errors)[0] as string[]
      error.value = firstError[0] || 'Validation failed'
    } else {
      error.value = err.response?.data?.message || 'Failed to save project type. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>
