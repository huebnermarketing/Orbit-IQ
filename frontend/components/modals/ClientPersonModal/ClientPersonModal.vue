<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-border-light">
        <h3 class="text-xl font-bold text-text-primary">{{ isEdit ? 'Edit Client Person' : 'Add Client Person' }}</h3>
        <button @click="$emit('close')" class="text-text-muted hover:text-text-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Name <span class="text-error-500">*</span></label>
          <input v-model="form.name" type="text" required class="input" placeholder="Enter client person name" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Email <span class="text-error-500">*</span></label>
          <input v-model="form.email" type="email" required :disabled="!canEditEmail" :class="['input', !canEditEmail ? 'bg-gray-100 cursor-not-allowed' : '']" placeholder="Enter email address" />
          <p v-if="!canEditEmail && isUserActivated" class="text-xs text-text-muted mt-1">Only super admin can modify email addresses.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">Phone</label>
          <input v-model="form.phone" type="tel" class="input" placeholder="Enter phone number" />
        </div>
        <div v-if="isEdit">
          <label class="block text-sm font-medium text-text-primary mb-2">Status</label>
          <select v-model="form.status" class="input">
            <option v-for="option in availableStatusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <p class="text-xs text-text-muted mt-1">
            <span v-if="clientPerson?.status === 'pending'">User must setup password via invitation link to become Active</span>
            <span v-else>Can change between Active/Inactive but cannot go back to Pending</span>
          </p>
        </div>
        <div v-if="isEdit && isUserActivated" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-800">Client User Restrictions</h4>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>System role is automatically set to "user" and cannot be changed</li>
                  <li>Organization role is automatically set to "Client" and cannot be changed</li>
                  <li>Email address can only be modified by super admin</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="flex space-x-3 pt-4">
          <button type="button" @click="$emit('close')" class="btn-outline flex-1">Cancel</button>
          <button type="submit" :disabled="loading" class="btn-primary flex-1">
            <span v-if="loading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white -ml-1 mr-3 inline-block"></div>
              {{ isEdit ? 'Updating...' : 'Adding...' }}
            </span>
            <span v-else>{{ isEdit ? 'Update Client Person' : 'Add Client Person' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script  lang="ts" src="./ClientPersonModal.ts"></script>
<style scoped src="./ClientPersonModal.css"></style>