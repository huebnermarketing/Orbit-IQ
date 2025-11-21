<template>
  <!-- Project Management Card -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <ClipboardListIcon class="text-amber-600" size="large" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Project Management</h3>
            <p class="text-sm text-gray-500">Team and timeline details</p>
          </div>
        </div>
        <!-- Edit Mode Action Buttons -->
        <div v-if="isEditingProjectManagement" class="flex items-center space-x-2">
          <button type="button" @click="discardProjectManagementChanges" class="btn-outline">
            Discard
          </button>
          <button
            type="button"
            @click="saveProjectManagement"
            :disabled="savingProjectManagement"
            class="btn-primary"
          >
            <div
              v-if="savingProjectManagement"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 inline-block"
            ></div>
            Save
          </button>
        </div>
        <!-- View Mode Edit Button -->
        <button
          v-else
          @click="enableEditing"
          v-tooltip="'edit'"
          :disabled="loadingProjectManagement"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div
            v-if="loadingProjectManagement"
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"
          ></div>
          <i v-else class="fas fa-edit w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- Project Owner -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Project Owner</label
          >
          <div v-if="project?.account_manager" class="flex items-center space-x-2">
            <div
              class="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="project.account_manager.avatar"
                :src="`/storage/${project.account_manager.avatar}`"
                :alt="project.account_manager.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white font-medium text-xs">
                {{ getInitials(project.account_manager.name) }}
              </span>
            </div>
            <p class="text-sm font-medium text-gray-900">
              {{ project.account_manager.name }}
            </p>
          </div>
          <span v-else class="text-sm text-gray-500">-</span>
        </div>

        <!-- Project Manager -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Project Manager</label
          >
          <div v-if="project?.project_manager" class="flex items-center space-x-2">
            <div
              class="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="project.project_manager.avatar"
                :src="`/storage/${project.project_manager.avatar}`"
                :alt="project.project_manager.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white font-medium text-xs">
                {{ getInitials(project.project_manager.name) }}
              </span>
            </div>
            <p class="text-sm font-medium text-gray-900">
              {{ project.project_manager.name }}
            </p>
          </div>
          <span v-else class="text-sm text-gray-500">-</span>
        </div>

        <!-- Start Date -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Start Date</label
          >
          <p class="text-sm font-medium text-gray-900">
            {{ project?.start_date ? formatDate(project.start_date) : 'No start date' }}
          </p>
        </div>

        <!-- Due Date -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Due Date</label
          >
          <p class="text-sm font-medium text-red-600">
            {{ project?.due_date ? formatDate(project.due_date) : 'No Due date' }}
          </p>
        </div>

        <!-- Quoted Hours -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Quoted Hours</label
          >
          <p class="text-sm font-medium text-gray-900">0</p>
        </div>

        <!-- Utilized Hours -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Utilized Hours</label
          >
          <div class="flex items-center space-x-2">
            <p class="text-sm font-medium text-gray-900">0:00 Hours</p>
            <div class="flex-1 bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- Created -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Created</label
          >
          <p class="text-sm font-medium text-gray-900">
            {{ project?.created_at ? formatDate(project.created_at) : '-' }}
          </p>
        </div>

        <!-- Delivery Date -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Delivery Date</label
          >
          <p class="text-sm font-medium text-gray-900">No Delivery date</p>
        </div>

        <!-- Reminder -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Reminder</label
          >
          <div class="flex items-center space-x-1">
            <i class="far fa-clock text-gray-400 text-xs"></i>
            <p class="text-sm text-gray-500">No Reminder</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ProjectManagement.ts"></script>
<style scoped src="./ProjectManagement.css"></style>
