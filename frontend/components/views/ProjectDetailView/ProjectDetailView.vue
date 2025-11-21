<template>
  <!-- Project Header with Navigation -->
  <div class="bg-white border-b border-gray-200 px-6 py-4 mb-6">
    <!-- Project Title -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
        <!-- Client Company Logo -->
        <img
          v-if="project?.client?.logo_url"
          :src="project.client.logo_url"
          :alt="project.client.company_name"
          class="w-full h-full object-cover"
        />
        <!-- Fallback to company initials if no logo -->
        <span v-else-if="project?.client?.company_name" class="text-white font-medium text-xs">
          {{ getCompanyInitials(project.client.company_name) }}
        </span>
        <!-- Default icon if no client data -->
        <i v-else class="far fa-th text-white text-sm"></i>
      </div>
      <div>
        <h1 class="text-xl font-semibold text-gray-900">{{ project?.name || 'Loading...' }}</h1>
        <div class="flex items-center space-x-3 mt-1">
          <!-- Project Status -->
          <span
            v-if="project?.project_status"
            :style="{ backgroundColor: project.project_status.color, color: 'white' }"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          >
            {{ project.project_status.name }}
          </span>
          <!-- Project Type -->
          <span
            v-if="project?.project_type"
            :style="{ backgroundColor: project.project_type.color, color: 'white' }"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          >
            {{ project.project_type.name }}
          </span>
          <!-- Loading state -->
          <span v-if="!project" class="text-sm text-gray-500">Loading project details...</span>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <nav class="flex space-x-8">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
        ]"
      >
        {{ tab.name }}
      </button>
    </nav>
  </div>

  <!-- Main Content -->
  <div class="px-6">
    <!-- Tab Content -->
    <div v-if="activeTab === 'task_list'">
      <TaskList :project-id="projectId" @task-saved="handleTaskSaved" />
    </div>

    <!-- Overview Tab Content -->
    <div v-else-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column - Project Details Cards -->
      <div class="space-y-6">
        <BasicDetail
          :project="project"
          :project-id="projectId"
          @project-updated="handleProjectUpdated"
        />
        <FinancialInfo :project="project" />
        <ProjectManagement :project="project" />
        <TeamMembers :project="project" />
      </div>

      <!-- Right Column - Project Description Editor -->
      <ProjectDescription
        :project="project"
        :project-id="projectId"
        @description-updated="handleDescriptionUpdated"
      />
    </div>

    <div v-else-if="activeTab === 'activity'" class="text-center py-12">
      <i class="far fa-clock text-gray-400 text-5xl mb-4 block"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Activity</h3>
      <p class="text-gray-500">Activity feed coming soon...</p>
    </div>

    <div v-else-if="activeTab === 'client'" class="text-center py-12">
      <i class="far fa-user text-gray-400 text-5xl mb-4 block"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Client</h3>
      <p class="text-gray-500">Client information coming soon...</p>
    </div>

    <div v-else-if="activeTab === 'hour_report'" class="text-center py-12">
      <i class="far fa-calendar-alt text-gray-400 text-5xl mb-4 block"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Hour Report</h3>
      <p class="text-gray-500">Hour reporting coming soon...</p>
    </div>
  </div>
</template>

<script lang="ts" src="./ProjectDetailView.ts"></script>
<style scoped src="./ProjectDetailView.css"></style>
