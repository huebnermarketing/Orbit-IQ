<template>
  <div v-if="show" class="create-project-dialog-overlay" @click.self="$emit('close')">
    <div class="create-project-dialog-panel">
      <div class="create-project-dialog-header">
        <h3 class="create-project-dialog-title">
          {{ isEdit ? 'Edit Project' : 'Create New Project' }}
        </h3>
        <button type="button" class="create-project-dialog-close-button" @click="$emit('close')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Main Content - 50/50 Split -->
      <div class="create-project-dialog-content">
        <!-- Left Side - Form Fields -->
        <div class="create-project-dialog-form-section">
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
                  <span class="text-xs text-text-muted"
                    >(6-digit number (auto-generated, can be modified))</span
                  >
                </label>
                <input
                  v-model="form.project_number"
                  type="text"
                  required
                  class="input"
                  placeholder="Auto-generated"
                />
              </div>
            </div>

            <!-- Client and Sub-Client -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Choose Client <span class="text-error-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.client_id"
                  :options="clientOptions"
                  placeholder="Select Client"
                  @change="onClientChange"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Select Sub-Client
                </label>
                <BaseSelect
                  v-model="form.sub_client_id"
                  :options="subClientOptions"
                  placeholder="Select Sub-Client"
                  :disabled="!form.client_id"
                />
              </div>
            </div>

            <!-- Funding Source and Hour Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Funding Source <span class="text-error-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.funding_source"
                  :options="[
                    { label: 'Fixed', value: 'fixed' },
                    { label: 'Hourly', value: 'hourly' },
                  ]"
                  placeholder="Select Funding Source"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Hour Type <span class="text-error-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.hour_type"
                  :options="[
                    { label: 'Billable', value: 'billable' },
                    { label: 'Non-Billable', value: 'non_billable' },
                    { label: 'Internal', value: 'internal' },
                  ]"
                  placeholder="Select Hour Type"
                />
              </div>
            </div>

            <!-- AM and PM -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Account Manager <span class="text-error-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.am_id"
                  :options="amUserOptions"
                  placeholder="Select AM"
                  @change="onAMChange"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Manager
                </label>
                <BaseSelect
                  v-model="form.pm_id"
                  :options="pmUserOptions"
                  placeholder="Select PM"
                  :disabled="!form.am_id"
                />
              </div>
            </div>

            <!-- Start Date and Due Date -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2"> Start Date </label>
                <div class="relative">
                  <input
                    v-model="form.start_date"
                    type="date"
                    class="input cursor-pointer hover:border-primary-400 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Select start date"
                    @click="$event.target.showPicker?.()"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2"> Due Date </label>
                <div class="relative">
                  <input
                    v-model="form.due_date"
                    type="date"
                    class="input cursor-pointer hover:border-primary-400 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Select due date"
                    @click="$event.target.showPicker?.()"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Project Status and Project Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Status
                </label>
                <BaseSelect
                  v-model="form.project_status_id"
                  :options="projectStatusOptions"
                  placeholder="Select Project Status"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Project Type
                </label>
                <BaseSelect
                  v-model="form.project_type_id"
                  :options="projectTypeOptions"
                  placeholder="Select Project Type"
                />
              </div>
            </div>

            <!-- Internal Team and Client Team -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Internal Team
                </label>
                <BaseMultiSelect
                  v-model="form.internal_team"
                  :options="internalUserOptions"
                  placeholder="Select internal users..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Client Team
                </label>
                <BaseMultiSelect
                  v-model="form.client_team"
                  :options="clientUserOptions"
                  placeholder="Select client users..."
                />
              </div>
            </div>

            <!-- User Groups and Teams -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Add User Groups
                </label>
                <BaseMultiSelect
                  v-model="form.user_groups"
                  :options="userGroupOptions"
                  placeholder="Select user groups..."
                  @change="updateInternalTeamFromGroupsAndTeams"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2"> Add Teams </label>
                <BaseMultiSelect
                  v-model="form.teams"
                  :options="teamOptions"
                  placeholder="Select teams..."
                  @change="updateInternalTeamFromGroupsAndTeams"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="alert-error">
              <div class="flex">
                <svg
                  class="w-5 h-5 text-error-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-error-800">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-border-light">
              <button type="button" @click="$emit('close')" class="btn-outline">Discard</button>
              <button type="submit" :disabled="loading" class="btn-primary">
                <svg
                  v-if="loading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ loading ? 'Saving...' : 'Submit' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Right Side - Project Description -->
        <div class="create-project-dialog-editor-section">
          <div class="h-full flex flex-col">
            <label class="block text-sm font-medium text-text-primary mb-4">
              Project Description
            </label>
            <div class="flex-1 border border-border-light rounded-lg overflow-hidden relative">
              <!-- Loading state -->
              <div v-if="!quill" class="min-h-[400px] flex items-center justify-center bg-gray-50">
                <div class="text-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
                  ></div>
                  <p class="text-gray-600">Loading editor...</p>
                </div>
              </div>

              <!-- Quill Editor Container -->
              <div id="quill-editor" class="min-h-[400px]" v-show="quill"></div>

              <!-- Fallback textarea in case Quill fails -->
              <textarea
                v-if="!quill"
                v-model="form.description"
                class="w-full h-full p-4 border-0 resize-none focus:outline-none absolute inset-0"
                style="
                  min-height: 400px;
                  font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto,
                    Helvetica Neue, sans-serif;
                  font-size: 14px;
                  line-height: 1.5;
                  direction: ltr;
                  text-align: left;
                "
                placeholder="Enter project description..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./CreateProjectModal.css"></style>

<script lang="ts" src="./CreateProjectModal.ts"></script>
