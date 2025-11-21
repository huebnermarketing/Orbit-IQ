<template>
  <!-- Project Header -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <i class="far fa-building text-indigo-600 text-lg"></i>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Basic Details</h3>
            <p class="text-sm text-gray-500">Project overview and details</p>
          </div>
        </div>
        <!-- Edit Mode Action Buttons -->
        <div v-if="isEditingBasicDetails" class="flex items-center space-x-2">
          <button type="button" @click="discardBasicDetailsChanges" class="btn-outline">
            Discard
          </button>
          <button
            type="button"
            @click="saveBasicDetails"
            :disabled="savingBasicDetails"
            class="btn-primary"
          >
            <div
              v-if="savingBasicDetails"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 inline-block"
            ></div>
            Save
          </button>
        </div>
        <!-- View Mode Edit Button -->
        <button
          v-else
          @click="enableEditingBasicDetails"
          v-tooltip="'edit'"
          :disabled="loadingBasicDetails"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div
            v-if="loadingBasicDetails"
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"
          ></div>
          <i v-else class="fas fa-edit w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Project Details Grid -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Project Code -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Project Code</label
          >
          <input
            v-if="isEditingBasicDetails"
            v-model="editingBasicDetails.project_number"
            type="text"
            class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project code"
          />
          <p v-else class="text-sm font-medium text-gray-900">
            {{ project?.project_number || '-' }}
          </p>
        </div>

        <!-- Client -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Client</label
          >
          <BaseSelect
            v-if="isEditingBasicDetails"
            v-model="editingBasicDetails.client_id"
            :options="clientOptions"
            placeholder="Select Client"
            size="sm"
            @change="onBasicDetailsClientChange"
            wrapper-class="bg-white"
          />
          <p v-else class="text-sm font-medium text-gray-900">
            {{ project?.client?.company_name || '-' }}
          </p>
        </div>

        <!-- Status -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Status</label
          >
          <BaseSelect
            v-if="isEditingBasicDetails"
            v-model="editingBasicDetails.project_status_id"
            :options="projectStatusOptions"
            placeholder="Select Status"
            size="sm"
            wrapper-class="bg-white"
          />
          <div v-else>
            <span
              v-if="project?.project_status"
              :style="{ backgroundColor: project.project_status.color, color: 'white' }"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
            >
              {{ project.project_status.name }}
            </span>
            <span v-else class="text-xs text-gray-500">-</span>
          </div>
        </div>

        <!-- Sub-Client -->
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
            >Sub-Client</label
          >
          <BaseSelect
            v-if="isEditingBasicDetails"
            v-model="editingBasicDetails.sub_client_id"
            :options="subClientOptions"
            placeholder="Select Sub Client"
            size="sm"
            :disabled="!editingBasicDetails.client_id"
            wrapper-class="bg-white"
          />
          <p v-else class="text-sm font-medium text-gray-900">
            {{ project?.sub_client?.name || 'Select Sub Client' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./BasicDetail.ts"></script>
<style scoped src="./BasicDetail.css"></style>
