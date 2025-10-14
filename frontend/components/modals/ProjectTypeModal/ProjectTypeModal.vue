<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">{{ isEdit ? 'Edit Project Type' : 'Create New Project Type' }}</h3>
            <button @click="$emit('close')" class="text-text-muted hover:text-text-primary transition-colors">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Project Type Name <span class="text-error-500">*</span></label>
              <input v-model="form.name" type="text" required :disabled="isEdit && projectType?.is_system_defined" class="input" :class="{ 'opacity-50 cursor-not-allowed': isEdit && projectType?.is_system_defined }" placeholder="Enter project type name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Description</label>
              <textarea v-model="form.description" rows="3" :disabled="isEdit && projectType?.is_system_defined" class="input" :class="{ 'opacity-50 cursor-not-allowed': isEdit && projectType?.is_system_defined }" placeholder="Enter project type description"></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Color <span class="text-error-500">*</span></label>
                <div class="flex items-center space-x-2">
                  <input v-model="form.color" type="color" :disabled="isEdit && projectType?.is_system_defined" class="w-12 h-10 border border-border-light rounded cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': isEdit && projectType?.is_system_defined }" />
                  <input v-model="form.color" type="text" :disabled="isEdit && projectType?.is_system_defined" class="input flex-1" :class="{ 'opacity-50 cursor-not-allowed': isEdit && projectType?.is_system_defined }" placeholder="#3B82F6" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Sort Order</label>
                <input v-model.number="form.sort_order" type="number" min="0" :disabled="isEdit && projectType?.is_system_defined" class="input" :class="{ 'opacity-50 cursor-not-allowed': isEdit && projectType?.is_system_defined }" placeholder="0" />
              </div>
            </div>
            <div>
              <label class="flex items-center">
                <input v-model="form.is_active" type="checkbox" :disabled="isEdit && projectType?.is_system_defined" class="rounded border-border-light text-primary-600 focus:ring-primary-500" :class="{ 'opacity-50 cursor-not-allowed': isEdit && projectType?.is_system_defined }" />
                <span class="ml-2 text-sm text-text-primary">Active</span>
              </label>
            </div>
            <div v-if="isEdit && projectType?.is_system_defined" class="bg-info-50 border border-info-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-info-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-info-800">This is a system-defined project type (Fixed Cost, Maintenance, Hosting, Adhoc, SaaS). System-defined project types cannot be modified or deleted as they are core to the platform.</p>
                </div>
              </div>
            </div>
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
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-border-light">
              <button type="button" @click="$emit('close')" class="btn-outline">Cancel</button>
              <button type="submit" :disabled="loading || (isEdit && projectType?.is_system_defined)" class="btn-primary" :class="{ 'opacity-50 cursor-not-allowed': isEdit && projectType?.is_system_defined }">
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

<script setup lang="ts" src="./ProjectTypeModal.ts"></script>
<style scoped src="./ProjectTypeModal.css"></style>