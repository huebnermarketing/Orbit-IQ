<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-text-primary">
            {{ isEditing ? 'Edit Organization Role' : 'Create Organization Role' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-text-muted hover:text-text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

          <!-- Locked Role Warning -->
          <div v-if="isLocked" class="p-4 bg-warning-50 border border-warning-200 rounded-lg mb-4">
            <div class="flex">
              <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div class="ml-3">
                <p class="text-sm text-warning-800">
                  This is a locked system role and cannot be modified. Only custom roles can be edited.
                </p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Role Name -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Role Name</label>
            <input
              v-model="form.name"
              type="text"
              class="input"
              :class="{ 'opacity-50 cursor-not-allowed': isLocked }"
              placeholder="Enter role name"
              :disabled="isLocked"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              v-model="form.description"
              class="input"
              :class="{ 'opacity-50 cursor-not-allowed': isLocked }"
              rows="3"
              placeholder="Enter role description"
              :disabled="isLocked"
            ></textarea>
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Color</label>
            <div class="flex items-center space-x-3">
              <input
                v-model="form.color"
                type="color"
                class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                v-model="form.color"
                type="text"
                class="input flex-1"
                placeholder="#4D6CFA"
                pattern="^#[0-9A-Fa-f]{6}$"
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
            <p class="text-xs text-text-muted mt-1">Choose a color for the role badge</p>
          </div>

          <!-- Role Preview -->
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
                {{ form.name || 'Role Name' }}
              </span>
            </div>
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
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              v-model="form.is_active"
              type="checkbox"
              id="is_active"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="is_active" class="ml-2 block text-sm text-text-primary">
              Active
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-error-50 border border-error-200 rounded-lg">
            <p class="text-sm text-error-800">{{ error }}</p>
          </div>

          <!-- Actions -->
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
              :disabled="loading || isLocked"
              class="btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': isLocked }"
            >
              {{ loading ? 'Saving...' : (isEditing ? 'Update Role' : 'Create Role') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { authApi } from '@/utils/api'
import { getContrastColor, getRandomColor } from '@/utils/colors'

const props = defineProps<{
  role?: any
}>()

const isLocked = computed(() => props.role?.is_locked || false)

const emit = defineEmits<{
  close: []
  success: []
}>()

const loading = ref(false)
const error = ref('')

const isEditing = computed(() => !!props.role)

const form = reactive({
  name: '',
  description: '',
  color: '#4D6CFA',
  sort_order: 0,
  is_active: true
})

// Watch for role prop changes
watch(() => props.role, (newRole) => {
  if (newRole) {
    form.name = newRole.name || ''
    form.description = newRole.description || ''
    form.color = newRole.color || '#4D6CFA'
    form.sort_order = newRole.sort_order || 0
    form.is_active = newRole.is_active ?? true
  } else {
    // Reset form for new role
    form.name = ''
    form.description = ''
    form.color = '#4D6CFA'
    form.sort_order = 0
    form.is_active = true
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (isEditing.value) {
      await authApi.updateOrganizationRole(props.role.id, form)
    } else {
      await authApi.createOrganizationRole(form)
    }
    
    emit('success')
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save role. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
