<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-text-primary mb-2">Projects</h1>
          <p class="text-text-secondary">Manage and track your projects</p>
        </div>
        <button class="btn btn-primary" @click="handleCreateProject">
          <i class="fas fa-plus mr-2"></i>
          Create Project
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card p-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-text-muted"></i>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search projects..."
              class="input pl-10"
            />
          </div>
        </div>
        <div class="w-48">
          <select v-model="statusFilter" class="input">
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="w-48">
          <select v-model="priorityFilter" class="input">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Projects Table -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-2 text-text-muted">Loading projects...</span>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
      <div
        class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="fas fa-folder-open text-primary-600 text-2xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-text-primary mb-2">No projects found</h3>
      <p class="text-text-secondary mb-6">
        {{
          searchQuery
            ? 'Try adjusting your search or filters'
            : 'Get started by creating your first project'
        }}
      </p>
      <button @click="handleCreateProject" class="btn btn-primary">Create Project</button>
    </div>

    <div v-else class="card overflow-hidden">
      <!-- Table Header with Column Visibility -->
      <div class="px-6 py-4 border-b border-border-light bg-surface-alt">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-primary">Projects</h3>
          <div class="relative">
            <button
              @click="showColumnMenu = !showColumnMenu"
              class="p-2 text-text-muted hover:text-text-primary transition-colors"
              title="Show/Hide Columns"
            >
              <i class="fas fa-ellipsis-v"></i>
            </button>

            <!-- Column Visibility Menu -->
            <div
              v-if="showColumnMenu"
              class="absolute right-0 mt-2 w-48 bg-surface border border-border-light rounded-lg shadow-lg z-10"
            >
              <div class="p-2">
                <div class="text-xs font-medium text-text-secondary mb-2 px-2">
                  Show/Hide Columns
                </div>
                <div class="space-y-1">
                  <label
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="flex items-center px-2 py-1 hover:bg-surface-alt rounded cursor-pointer"
                  >
                    <input
                      v-model="column.visible"
                      type="checkbox"
                      class="mr-2 rounded border-border-light text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-sm text-text-primary">{{ column.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-alt border-b border-border-light">
            <tr>
              <th
                v-for="column in visibleColumns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr
              v-for="project in filteredProjects"
              :key="project.id"
              @click="viewProject(project.id)"
              class="hover:bg-surface-alt cursor-pointer transition-colors"
            >
              <!-- Project Name -->
              <td v-if="isColumnVisible('name')" class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-primary-600 hover:text-primary-800">
                    {{ project.name }}
                  </div>
                  <div class="text-xs text-text-muted">{{ project.project_number }}</div>
                </div>
              </td>

              <!-- Client/Subclient -->
              <td v-if="isColumnVisible('client')" class="px-6 py-4 whitespace-nowrap">
                <div v-if="project.client">
                  <div class="text-sm font-medium text-text-primary">
                    {{ project.client.company_name }}
                  </div>
                  <div v-if="project.subclient" class="text-xs text-text-muted">
                    {{ project.subclient.name }}
                  </div>
                </div>
                <span v-else class="text-sm text-text-muted">-</span>
              </td>

              <!-- Funding Source -->
              <td v-if="isColumnVisible('funding')" class="px-6 py-4 whitespace-nowrap">
                <div v-if="project.funding_source">
                  <div class="text-sm font-medium text-text-primary capitalize">
                    {{ project.funding_source }}
                  </div>
                  <div class="text-xs text-text-muted capitalize">
                    {{ project.hour_type || 'Billable' }}
                  </div>
                </div>
                <span v-else class="text-sm text-text-muted">-</span>
              </td>

              <!-- Status -->
              <td v-if="isColumnVisible('status')" class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="project.project_status"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(project.project_status.name)"
                >
                  {{ project.project_status.name }}
                </span>
                <span v-else class="text-sm text-text-muted">-</span>
              </td>

              <!-- Project Type -->
              <td v-if="isColumnVisible('type')" class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="project.project_type"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {{ project.project_type.name }}
                </span>
                <span v-else class="text-sm text-text-muted">-</span>
              </td>

              <!-- Created Date -->
              <td
                v-if="isColumnVisible('created_date')"
                class="px-6 py-4 whitespace-nowrap text-sm text-text-muted"
              >
                {{ formatDate(project.created_at) }}
              </td>

              <!-- Due Date -->
              <td
                v-if="isColumnVisible('due_date')"
                class="px-6 py-4 whitespace-nowrap text-sm text-text-muted"
              >
                {{ project.due_date ? formatDate(project.due_date) : '-' }}
              </td>

              <!-- Account Manager -->
              <td v-if="isColumnVisible('am')" class="px-6 py-4 whitespace-nowrap">
                <div v-if="project.account_manager" class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
                    >
                      <span class="text-xs font-medium text-white">{{
                        getInitials(project.account_manager.name)
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-text-primary">
                      {{ project.account_manager.name }}
                    </div>
                    <div class="text-xs text-text-muted">{{ project.account_manager.email }}</div>
                  </div>
                </div>
                <span v-else class="text-sm text-text-muted">Not assigned</span>
              </td>

              <!-- Project Manager -->
              <td v-if="isColumnVisible('pm')" class="px-6 py-4 whitespace-nowrap">
                <div v-if="project.project_manager" class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
                    >
                      <span class="text-xs font-medium text-white">{{
                        getInitials(project.project_manager.name)
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-text-primary">
                      {{ project.project_manager.name }}
                    </div>
                    <div class="text-xs text-text-muted">{{ project.project_manager.email }}</div>
                  </div>
                </div>
                <span v-else class="text-sm text-text-muted">Not assigned</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ProjectsView.ts"></script>
<style scoped src="./ProjectsView.css"></style>
