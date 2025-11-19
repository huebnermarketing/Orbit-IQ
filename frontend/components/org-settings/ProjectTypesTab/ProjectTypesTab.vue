<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-text-primary">Project Types</h3>
        <p class="text-text-secondary mt-1">Manage project types for your organization</p>
      </div>
      <button @click="showCreateProjectTypeModal = true" class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Project Type
      </button>
    </div>

    <!-- Project Types Table -->
    <div class="card overflow-hidden">
      <div v-if="projectTypesLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-text-muted">Loading project types...</span>
      </div>
      <div v-else-if="projectTypes.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2">No project types found</h3>
        <p class="text-text-muted mb-4">Get started by creating your first project type.</p>
        <button @click="showCreateProjectTypeModal = true" class="btn-primary">Add Project Type</button>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full divide-y divide-border-light">
          <thead class="bg-surface-alt">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Project Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Sort Order</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Property</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-border-light">
            <tr v-for="projectType in projectTypes" :key="projectType.id" class="hover:bg-surface-alt">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: projectType.color }"></div>
                  <div class="text-sm font-medium text-text-primary">{{ projectType.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-text-primary max-w-xs truncate">{{ projectType.description || 'No description' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{{ projectType.sort_order }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="projectType.is_active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ projectType.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="projectType.is_system_defined ? 'bg-info-100 text-info-800' : 'bg-success-100 text-success-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ projectType.is_system_defined ? 'System-Defined' : 'User-Defined' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button @click="editProjectType(projectType)" class="text-primary-600 hover:text-primary-900 p-1" :class="{ 'opacity-50 cursor-not-allowed': projectType.is_system_defined }" :disabled="projectType.is_system_defined" :title="projectType.is_system_defined ? 'System project type cannot be edited' : 'Edit project type'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button v-if="!projectType.is_system_defined" @click="deleteProjectType(projectType)" class="text-red-600 hover:text-red-900 p-1" title="Delete project type">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Project Type Modal -->
  <ProjectTypeModal
    v-if="showCreateProjectTypeModal || showEditProjectTypeModal"
    :show="showCreateProjectTypeModal || showEditProjectTypeModal"
    :project-type="selectedProjectType"
    :is-edit="showEditProjectTypeModal"
    @close="closeProjectTypeModal"
    @saved="handleProjectTypeSaved"
  />
</template>

<script lang="ts" src="./ProjectTypesTab.ts"></script>

<style scoped src="./ProjectTypesTab.css"></style>

