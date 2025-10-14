<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">{{ isEdit ? 'Edit Sub-Client' : 'Add New Sub-Client' }}</h3>
            <button @click="$emit('close')" class="text-text-muted hover:text-text-primary transition-colors">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Sub-Client Name <span class="text-error-500">*</span></label>
              <input v-model="form.name" type="text" class="input" placeholder="Enter sub-client name" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Email ID</label>
              <input v-model="form.email" type="email" class="input" placeholder="Enter email address (optional)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
              <input v-model="form.phone" type="tel" class="input" placeholder="Enter phone number (optional)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Website</label>
              <input v-model="form.website" type="url" class="input" placeholder="Enter website URL (optional)" />
            </div>
            <div v-if="error" class="alert-error">
              <div class="flex">
                <svg class="h-5 w-5 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3"><p class="text-sm">{{ error }}</p></div>
              </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="$emit('close')" class="btn-outline">Cancel</button>
              <button type="submit" :disabled="loading" class="btn-primary">{{ loading ? 'Saving...' : (isEdit ? 'Update Sub-Client' : 'Add Sub-Client') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script  lang="ts" src="./SubClientModal.ts"></script>
<style scoped src="./SubClientModal.css"></style>