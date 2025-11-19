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
                  :class="['input', getFieldError('name') ? 'input-error' : '']"
                  placeholder="Enter project name"
                />
                <FieldError :error="getFieldError('name')" />
              </div>
              <div>
                <label class="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-2">
                  <span>Project Number <span class="text-error-500">*</span></span>
                  <i
                    v-tooltip="tooltipConfig"
                    class="fas fa-info-circle w-4 text-text-muted hover:text-primary-500 cursor-help transition-colors focus:outline-none"
                    tabindex="0"
                  ></i>
                </label>
                <input
                  v-model="form.project_number"
                  type="text"
                  required
                  maxlength="6"
                  inputmode="numeric"
                  :class="['input', getFieldError('project_number') ? 'input-error' : '']"
                  placeholder="Auto-generated"
                  @input="handleProjectNumberInput"
                />
                <FieldError :error="getFieldError('project_number')" />
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
                  :error-message="getFieldError('client_id')"
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
                  :error-message="getFieldError('funding_source')"
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
                  :error-message="getFieldError('hour_type')"
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
                  :error-message="getFieldError('am_id')"
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
                <DatePicker
                  v-model="form.start_date"
                  mode="single"
                  granularity="date"
                  placeholder="dd-mm-yyyy"
                  :max="maxStartDate"
                  :error="getFieldError('start_date')"
                  @change="onStartDateChange"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2"> Due Date </label>
                <DatePicker
                  v-model="form.due_date"
                  mode="single"
                  granularity="date"
                  placeholder="dd-mm-yyyy"
                  :min="minDueDate"
                  :error="getFieldError('due_date')"
                  @change="onDueDateChange"
                />
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
          </form>
        </div>

        <!-- Right Side - Project Description -->
        <div class="create-project-dialog-editor-section">
          <label class="block text-sm font-medium text-text-primary mb-4">
            Project Description
          </label>
          <div class="flex-1 min-h-0">
            <RichTextEditor
              v-model="form.description"
              placeholder="Enter project description..."
              editor-id="create-project-description-editor"
              min-height="100%"
            />
          </div>
        </div>
      </div>

      <!-- Form Actions - Centered between left and right sections -->
      <div
        class="flex items-center justify-center space-x-3 pt-6 pb-6 border-t border-border-light px-6"
      >
        <button type="button" @click="$emit('close')" class="btn-outline">Discard</button>
        <button type="button" @click="handleSubmit" :disabled="loading" class="btn-primary">
          <div
            v-if="loading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white -ml-1 mr-2 inline-block"
          ></div>
          {{ loading ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./CreateProjectModal.css"></style>

<script lang="ts" src="./CreateProjectModal.ts"></script>
