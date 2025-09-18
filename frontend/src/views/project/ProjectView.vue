<template>
  <AppLayout>
    <!-- Project Header with Navigation -->
    <div class="bg-white border-b border-gray-200 px-6 py-4 mb-6">
      <!-- Project Title -->
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
          <!-- Client Company Logo -->
          <img v-if="project?.client?.logo_url"
               :src="project.client.logo_url"
               :alt="project.client.company_name"
               class="w-full h-full object-cover" />
          <!-- Fallback to company initials if no logo -->
          <span v-else-if="project?.client?.company_name" class="text-white font-medium text-xs">
            {{ getCompanyInitials(project.client.company_name) }}
          </span>
          <!-- Default icon if no client data -->
          <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-semibold text-gray-900">{{ project?.name || 'Loading...' }}</h1>
          <div class="flex items-center space-x-3 mt-1">
            <!-- Project Status -->
            <span v-if="project?.project_status"
                  :style="{ backgroundColor: project.project_status.color, color: 'white' }"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
              {{ project.project_status.name }}
            </span>
            <!-- Project Type -->
            <span v-if="project?.project_type"
                  :style="{ backgroundColor: project.project_type.color, color: 'white' }"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
              {{ project.project_type.name }}
            </span>
            <!-- Loading state -->
            <span v-if="!project" class="text-sm text-gray-500">Loading project details...</span>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <nav class="flex space-x-8">
        <button v-for="tab in tabs" :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                ]">
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="px-6">
        <!-- Tab Content -->
        <div v-if="activeTab === 'task_list'">
          <!-- Task List Controls -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <button @click="showCreateTaskModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                + Add task
              </button>
              
              <div class="flex items-center space-x-2">
                <button class="text-gray-600 hover:text-gray-900 text-sm">
                  Filter: {{ activeFilters }}
                </button>
                <button class="text-gray-600 hover:text-gray-900 text-sm">
                  Sort
                </button>
                <button class="text-gray-600 hover:text-gray-900 text-sm">
                  Group by
                </button>
                <button class="text-gray-600 hover:text-gray-900 text-sm">
                  Hide
                </button>
              </div>
            </div>
          </div>

          <!-- Task Sections -->
          <div class="space-y-6">
            <!-- User-Created Sections -->
            <div v-for="section in userSections" :key="section.id" class="bg-white rounded-lg border border-gray-200">
              <!-- Section Header -->
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <h3 class="text-lg font-medium text-gray-900">{{ section.name }}</h3>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">{{ section.tasks.length }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </button>
                    <button @click="showCreateSectionModal = true" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Tasks List -->
              <div class="divide-y divide-gray-200">
                <div v-for="task in section.tasks" :key="task.id" class="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div class="flex items-center space-x-3">
                    <input type="checkbox" 
                           :checked="task.status === 'completed'"
                           @change="toggleTaskStatus(task)"
                           class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-medium text-gray-900">{{ task.name }}</h4>
                      <div class="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span v-if="task.assigned_to">{{ task.assigned_to.name }}</span>
                        <span v-if="task.due_date">{{ formatDate(task.due_date) }}</span>
                        <span v-if="task.estimated_hours">{{ task.estimated_hours }}h</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add Task Input -->
                <div class="px-6 py-3">
                  <input 
                    v-model="newTaskName[section.id]"
                    type="text" 
                    placeholder="Add task..."
                    class="w-full border-0 focus:ring-0 text-sm placeholder-gray-400"
                    @keydown.enter="addTaskToSection(section.id)"
                  />
                </div>
              </div>
            </div>

            <!-- Add Section Button -->
            <div class="text-center py-4">
              <button @click="showCreateSectionModal = true" class="text-gray-500 hover:text-gray-700 text-sm font-medium">
                + Add section
              </button>
            </div>
          </div>
        </div>

        <!-- Overview Tab Content -->
        <div v-else-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column - Project Details Cards -->
          <div class="space-y-6">
            <!-- Project Header -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900">Basic Details</h3>
                      <p class="text-sm text-gray-500">Project overview and details</p>
                    </div>
                  </div>
                  <!-- Edit Mode Action Buttons -->
                  <div v-if="isEditingBasicDetails" class="flex items-center space-x-2">
                    <button
                      @click="saveBasicDetails"
                      :disabled="savingBasicDetails"
                      class="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i v-if="savingBasicDetails" class="fas fa-spinner fa-spin mr-1"></i>
                      Save
                    </button>
                    <button
                      @click="discardBasicDetailsChanges"
                      class="px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                  <!-- View Mode Edit Button -->
                  <button
                    v-else
                    @click="enableEditingBasicDetails"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Basic Details"
                  >
                    <i class="fas fa-edit w-5 h-5"></i>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
              
                <!-- Project Details Grid -->
                <div class="grid grid-cols-2 gap-6">
                  <!-- Left Column -->
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Code</label>
                      <input
                        v-if="isEditingBasicDetails"
                        v-model="editingBasicDetails.project_number"
                        type="text"
                        class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter project code"
                      />
                      <p v-else class="text-sm font-medium text-gray-900">{{ project?.project_number || '-' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Client</label>
                      <select
                        v-if="isEditingBasicDetails"
                        v-model="editingBasicDetails.client_id"
                        @change="onBasicDetailsClientChange"
                        class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Client</option>
                        <option v-for="client in clients" :key="client.id" :value="client.id">
                          {{ client.company_name }}
                        </option>
                      </select>
                      <p v-else class="text-sm font-medium text-gray-900">{{ project?.client?.company_name || '-' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Status</label>
                      <select
                        v-if="isEditingBasicDetails"
                        v-model="editingBasicDetails.project_status_id"
                        class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Status</option>
                        <option v-for="status in projectStatuses" :key="status.id" :value="status.id">
                          {{ status.name }}
                        </option>
                      </select>
                      <div v-else>
                        <span v-if="project?.project_status"
                              :style="{ backgroundColor: project.project_status.color, color: 'white' }"
                              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                          {{ project.project_status.name }}
                        </span>
                        <span v-else class="text-xs text-gray-500">-</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Right Column -->
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Job Code</label>
                      <input
                        v-if="isEditingBasicDetails"
                        v-model="editingBasicDetails.job_code"
                        type="text"
                        class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter job code"
                      />
                      <p v-else class="text-sm font-medium text-gray-900">{{ project?.job_code || '-' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Sub-Client</label>
                      <select
                        v-if="isEditingBasicDetails"
                        v-model="editingBasicDetails.sub_client_id"
                        class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :disabled="!editingBasicDetails.client_id"
                      >
                        <option value="">Select Sub Client</option>
                        <option v-for="subClient in subClients" :key="subClient.id" :value="subClient.id">
                          {{ subClient.name }}
                        </option>
                      </select>
                      <p v-else class="text-sm font-medium text-gray-900">{{ project?.sub_client?.name || 'Select Sub Client' }}</p>
                    </div>
                    
                  </div>
                </div>
            </div>

            <!-- Financial Info Card -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Financial Info</h3>
                      <p class="text-sm text-gray-500">Budget and funding details</p>
                    </div>
                  </div>
                  <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
              
                <div class="grid grid-cols-2 gap-6">
                  <!-- Left Column -->
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Hour Type</label>
                      <p class="text-sm font-medium text-gray-900">{{ project?.hour_type || 'Billable' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Funding Source</label>
                      <p class="text-sm font-medium text-gray-900">{{ project?.funding_source || '-' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Type</label>
                      <span v-if="project?.project_type" 
                            :style="{ backgroundColor: project.project_type.color, color: 'white' }"
                            class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                        {{ project.project_type.name }}
                      </span>
                      <span v-else class="text-xs text-gray-500">-</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Micro Budget</label>
                      <div class="flex items-center">
                        <div class="w-10 h-5 bg-gray-300 rounded-full relative">
                          <div class="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Estimate</label>
                      <p class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">-</p>
                    </div>
                  </div>
                  
                  <!-- Right Column -->
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Bucket Code</label>
                      <p class="text-sm font-medium text-gray-900">{{ project?.client?.company_name || 'Client' }} {{ project?.project_type?.name || 'Project' }} Agreement</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Invoice Number</label>
                      <p class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">Invoice Number</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Project Management Card -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Project Management</h3>
                      <p class="text-sm text-gray-500">Team and timeline details</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <div class="grid grid-cols-2 gap-6">
                  <!-- Left Column -->
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Owner</label>
                      <div v-if="project?.account_manager" class="flex items-center space-x-2">
                        <div class="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                          <img v-if="project.account_manager.avatar" 
                               :src="`/storage/${project.account_manager.avatar}`" 
                               :alt="project.account_manager.name"
                               class="w-full h-full object-cover" />
                          <span v-else class="text-white font-medium text-xs">
                            {{ getInitials(project.account_manager.name) }}
                          </span>
                        </div>
                        <p class="text-sm font-medium text-gray-900">{{ project.account_manager.name }}</p>
                      </div>
                      <span v-else class="text-sm text-gray-500">-</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Start Date</label>
                      <p class="text-sm font-medium text-gray-900">{{ project?.start_date ? formatDate(project.start_date) : 'No start date' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Quoted Hours</label>
                      <p class="text-sm font-medium text-gray-900">0</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Created</label>
                      <p class="text-sm font-medium text-gray-900">{{ project?.created_at ? formatDate(project.created_at) : '-' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Reminder</label>
                      <div class="flex items-center space-x-1">
                        <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-sm text-gray-500">No Reminder</p>
                      </div>
                    </div>
                  </div>
                
                  <!-- Right Column -->
            <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Project Manager</label>
                      <div v-if="project?.project_manager" class="flex items-center space-x-2">
                        <div class="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center overflow-hidden">
                          <img v-if="project.project_manager.avatar" 
                               :src="`/storage/${project.project_manager.avatar}`" 
                               :alt="project.project_manager.name"
                               class="w-full h-full object-cover" />
                          <span v-else class="text-white font-medium text-xs">
                            {{ getInitials(project.project_manager.name) }}
                          </span>
                        </div>
                        <p class="text-sm font-medium text-gray-900">{{ project.project_manager.name }}</p>
                      </div>
                      <span v-else class="text-sm text-gray-500">-</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Due Date</label>
                      <p class="text-sm font-medium text-red-600">{{ project?.due_date ? formatDate(project.due_date) : 'No Due date' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Utilized Hours</label>
                      <div class="flex items-center space-x-2">
                        <p class="text-sm font-medium text-gray-900">0:00 Hours</p>
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                          <div class="bg-green-500 h-2 rounded-full" style="width: 0%"></div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Delivery Date</label>
                      <p class="text-sm font-medium text-gray-900">No Delivery date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Members Card -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Team Members</h3>
                      <p class="text-sm text-gray-500">Groups and individual team members</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <div class="space-y-6">
                  <!-- Group Teams Section -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      Group Teams
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <span class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                        T Task - WLIQ/India
                        <button class="ml-2 text-blue-600 hover:text-blue-800 transition-colors">×</button>
                      </span>
                      <span class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
                        W Warranty Period Team
                        <button class="ml-2 text-purple-600 hover:text-purple-800 transition-colors">×</button>
                      </span>
                    </div>
                  </div>
                
                  <!-- Individual Team Members Section -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                      </svg>
                      Individual Members
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <div class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                        <div class="w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span class="text-white text-xs font-medium">A</span>
                        </div>
                        <span class="text-sm font-medium text-gray-900">Aagna Paneri</span>
                        <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                      </div>
                      <div class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                        <div class="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <span class="text-white text-xs font-medium">A</span>
                        </div>
                        <span class="text-sm font-medium text-gray-900">Aditi Singh</span>
                        <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                      </div>
                      <div class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                        <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <span class="text-white text-xs font-medium">A</span>
                        </div>
                        <span class="text-sm font-medium text-gray-900">Akash Patel</span>
                        <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Project Description Editor -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Project Description</h3>
                    <p class="text-sm text-gray-500">Rich text editor with formatting options</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    Auto-save
                  </span>
                </div>
              </div>
            </div>

            <!-- Editor Container -->
            <div class="p-6">
              <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <!-- Rich Text Editor -->
                <div id="project-description-editor" class="min-h-96">
                  <!-- Fallback textarea if Quill fails to load -->
                  <textarea 
                    v-if="!quill"
                    :value="project?.description || ''"
                    @input="updateDescription"
                    @blur="saveProjectDescription"
                    placeholder="Enter project description..."
                    class="w-full h-96 p-4 border-0 resize-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
                  ></textarea>
                </div>
              </div>
              
              <!-- Editor Footer -->
              <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Supports bold, italic, lists, and images
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Changes saved automatically
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'activity'" class="text-center py-12">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Activity</h3>
          <p class="text-gray-500">Activity feed coming soon...</p>
        </div>

        <div v-else-if="activeTab === 'client'" class="text-center py-12">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Client</h3>
          <p class="text-gray-500">Client information coming soon...</p>
        </div>

        <div v-else-if="activeTab === 'hour_report'" class="text-center py-12">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Hour Report</h3>
          <p class="text-gray-500">Hour reporting coming soon...</p>
        </div>
      </div>

    <!-- Create Task Modal -->
    <TaskModal 
      v-if="showCreateTaskModal"
      :project-id="projectId"
      @close="showCreateTaskModal = false"
      @saved="handleTaskSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import TaskModal from '@/components/modals/TaskModal.vue'
import { projectApi, taskApi, clientApi, authApi } from '@/utils/api'
import { getInitials, getCompanyInitials } from '@/utils/helpers'

const route = useRoute()
const projectId = route.params.id as string

// Reactive data
const project = ref<any>(null)
const tasks = ref<any[]>([])
const loading = ref(false)
const activeTab = ref('overview')
const showCreateTaskModal = ref(false)
const showCreateSectionModal = ref(false)
const activeFilters = ref(0)
const newTaskName = ref<Record<string, string>>({})

// Basic Details editing state
const isEditingBasicDetails = ref(false)
const savingBasicDetails = ref(false)
const originalBasicDetails = ref<any>(null)
const editingBasicDetails = ref<any>(null)

// Dropdown data for Basic Details editing
const clients = ref<any[]>([])
const subClients = ref<any[]>([])
const projectStatuses = ref<any[]>([])
const projectTypes = ref<any[]>([])

// Tabs configuration
const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'task_list', name: 'Task list' },
  { id: 'activity', name: 'Activity' },
  { id: 'client', name: 'Client' },
  { id: 'hour_report', name: 'Hour report' }
]

// User-created sections (this would come from API in real implementation)
const userSections = ref([
  {
    id: '1',
    name: 'Planning',
    tasks: []
  },
  {
    id: '2', 
    name: 'Development',
    tasks: []
  },
  {
    id: '3',
    name: 'Testing',
    tasks: []
  }
])

// Methods
const loadProject = async () => {
  try {
    loading.value = true
    const response = await projectApi.getProject(projectId)
    project.value = response
    console.log('Project loaded:', response) // Debug log
  } catch (error) {
    console.error('Failed to load project:', error)
  } finally {
    loading.value = false
  }
}

const loadTasks = async () => {
  try {
    const response = await taskApi.getTasks({
      project_id: projectId,
      include_subtasks: true
    })
    tasks.value = response.data || []
    
    // Distribute tasks to sections (in real implementation, tasks would have section_id)
    distributeTasksToSections()
  } catch (error) {
    console.error('Failed to load tasks:', error)
  }
}

const distributeTasksToSections = () => {
  // Reset all sections
  userSections.value.forEach(section => {
    section.tasks = []
  })
  
  // Distribute tasks evenly across sections for demo purposes
  // In real implementation, tasks would have a section_id field
  tasks.value.forEach((task, index) => {
    const sectionIndex = index % userSections.value.length
    userSections.value[sectionIndex].tasks.push(task)
  })
}


const toggleTaskStatus = async (task: any) => {
  try {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    await taskApi.updateTask(task.id, { status: newStatus })
    task.status = newStatus
    if (newStatus === 'completed') {
      task.completed_at = new Date().toISOString()
    } else {
      task.completed_at = null
    }
  } catch (error) {
    console.error('Failed to update task status:', error)
  }
}

const handleTaskSaved = () => {
  loadTasks()
}

// Data loading functions for Basic Details editing
const loadClientsData = async () => {
  try {
    const response = await clientApi.getClients()
    clients.value = response.data || []
  } catch (error) {
    console.error('Failed to load clients:', error)
    clients.value = []
  }
}

const loadSubClientsData = async (clientId: string) => {
  try {
    if (!clientId) {
      subClients.value = []
      return
    }
    const response = await clientApi.getSubClients(clientId)
    subClients.value = response || []
  } catch (error) {
    console.error('Failed to load sub-clients:', error)
    subClients.value = []
  }
}

const loadProjectStatusesData = async () => {
  try {
    const response = await authApi.getProjectStatuses()
    projectStatuses.value = response.data || []
  } catch (error) {
    console.error('Failed to load project statuses:', error)
    projectStatuses.value = []
  }
}

const loadProjectTypesData = async () => {
  try {
    const response = await authApi.getProjectTypes()
    projectTypes.value = response.data || []
  } catch (error) {
    console.error('Failed to load project types:', error)
    projectTypes.value = []
  }
}

// Client change handler for Basic Details editing
const onBasicDetailsClientChange = async () => {
  if (!editingBasicDetails.value) return
  
  // Reset sub-client when client changes
  editingBasicDetails.value.sub_client_id = ''
  
  // Load sub-clients for new client
  if (editingBasicDetails.value.client_id) {
    await loadSubClientsData(editingBasicDetails.value.client_id)
  } else {
    subClients.value = []
  }
}

// Basic Details editing functions
const enableEditingBasicDetails = async () => {
  if (!project.value) return
  
  // Load dropdown data first
  await Promise.all([
    loadClientsData(),
    loadProjectStatusesData(),
    loadProjectTypesData()
  ])
  
  // Store original data for potential rollback
  originalBasicDetails.value = { ...project.value }
  editingBasicDetails.value = { ...project.value }
  
  // Load sub-clients if client is selected
  if (project.value.client_id) {
    await loadSubClientsData(project.value.client_id)
  }
  
  isEditingBasicDetails.value = true
}

const saveBasicDetails = async () => {
  if (!editingBasicDetails.value || !project.value) return
  
  try {
    savingBasicDetails.value = true
    
    // Prepare update data maintaining relationships
    const updateData = {
      name: editingBasicDetails.value.name,
      project_number: editingBasicDetails.value.project_number,
      job_code: editingBasicDetails.value.job_code,
      client_id: editingBasicDetails.value.client_id,
      sub_client_id: editingBasicDetails.value.sub_client_id,
      project_status_id: editingBasicDetails.value.project_status_id,
      project_type_id: editingBasicDetails.value.project_type_id,
      project_manager_id: editingBasicDetails.value.project_manager_id,
      account_manager_id: editingBasicDetails.value.account_manager_id,
      start_date: editingBasicDetails.value.start_date,
      due_date: editingBasicDetails.value.due_date,
      hour_type: editingBasicDetails.value.hour_type,
      funding_source: editingBasicDetails.value.funding_source
    }
    
    // Update project via API
    const response = await projectApi.updateProject(projectId, updateData)
    
    // Reconstruct the project object with proper relationships
    const updatedProject = {
      ...project.value,
      ...editingBasicDetails.value,
      // If API response contains updated relationships, merge them too
      ...response
    }
    
    // Update relationship objects from loaded dropdown data
    if (editingBasicDetails.value.client_id) {
      const selectedClient = clients.value.find(c => c.id == editingBasicDetails.value.client_id)
      if (selectedClient) {
        updatedProject.client = selectedClient
      }
    }
    
    if (editingBasicDetails.value.sub_client_id) {
      const selectedSubClient = subClients.value.find(sc => sc.id == editingBasicDetails.value.sub_client_id)
      if (selectedSubClient) {
        updatedProject.sub_client = selectedSubClient
      }
    }
    
    if (editingBasicDetails.value.project_status_id) {
      const selectedStatus = projectStatuses.value.find(s => s.id == editingBasicDetails.value.project_status_id)
      if (selectedStatus) {
        updatedProject.project_status = selectedStatus
      }
    }
    
    if (editingBasicDetails.value.project_type_id) {
      const selectedType = projectTypes.value.find(t => t.id == editingBasicDetails.value.project_type_id)
      if (selectedType) {
        updatedProject.project_type = selectedType
      }
    }
    
    // Update local project data
    project.value = updatedProject
    
    // Exit editing mode
    isEditingBasicDetails.value = false
    originalBasicDetails.value = null
    editingBasicDetails.value = null
    
  } catch (error) {
    console.error('Failed to save basic details:', error)
    // TODO: Show error message to user
  } finally {
    savingBasicDetails.value = false
  }
}

const discardBasicDetailsChanges = () => {
  // Restore original data
  if (originalBasicDetails.value) {
    project.value = { ...originalBasicDetails.value }
  }
  
  // Exit editing mode
  isEditingBasicDetails.value = false
  originalBasicDetails.value = null
  editingBasicDetails.value = null
}

const addTaskToSection = async (sectionId: string) => {
  const taskName = newTaskName.value[sectionId]
  if (!taskName?.trim()) return

  try {
    const taskData = {
      name: taskName.trim(),
      project_id: projectId,
      status: 'todo',
      priority: 'medium'
    }

    await taskApi.createTask(taskData)
    newTaskName.value[sectionId] = ''
    loadTasks()
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getStatusLabel = (status: string) => {
  const labels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return labels[status] || status
}

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day'
  if (diffDays < 30) return `${diffDays} days`
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    const remainingDays = diffDays % 30
    if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`
    return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
  }
  
  const years = Math.floor(diffDays / 365)
  const remainingDays = diffDays % 365
  if (remainingDays === 0) return `${years} year${years > 1 ? 's' : ''}`
  const months = Math.floor(remainingDays / 30)
  if (months === 0) return `${years} year${years > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
  return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`
}


// Quill editor for description
let quill: any = null

const updateDescription = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  if (project.value) {
    project.value.description = target.value
  }
}

const saveProjectDescription = async () => {
  if (!project.value) return

  try {
    let content = ''
    
    if (quill) {
      // Quill editor
      content = quill.root.innerHTML
    } else {
      // Fallback textarea - get content from project data
      content = project.value.description || ''
    }
    
    // Only save if content has changed
    if (content !== project.value.description) {
      await projectApi.updateProject(projectId, {
        description: content
      })
      
      // Update local project data
      project.value.description = content
      console.log('Project description auto-saved successfully')
    }
  } catch (error) {
    console.error('Failed to auto-save project description:', error)
  }
}

const initializeDescriptionEditor = async () => {
  console.log('Starting description editor initialization...')
  
  // Check if the element exists
  const editorElement = document.getElementById('project-description-editor')
  if (!editorElement) {
    console.error('❌ Description editor element not found')
    return
  }
  
  console.log('✅ Editor element found:', editorElement)
  
  // Clear any existing content
  editorElement.innerHTML = ''
  
  try {
    console.log('📦 Loading Quill module...')
    const QuillModule = await import('quill')
    const QuillClass = QuillModule.default || QuillModule
    
    console.log('✅ Quill module loaded:', QuillClass)
    
    // Configure Quill with minimal options
    quill = new QuillClass('#project-description-editor', {
      theme: 'snow',
      placeholder: 'Enter project description...',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline'],
            [{ 'header': [1, 2, 3, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['image'],
            ['clean']
          ]
        }
      }
    })
    
    // Custom image handler with drag and drop support
    const toolbar = quill.getModule('toolbar')
    toolbar.addHandler('image', () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      
      input.onchange = () => {
        const file = input.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            const range = quill.getSelection()
            quill.insertEmbed(range.index, 'image', reader.result)
          }
          reader.readAsDataURL(file)
        }
      }
    })
    
    // Add drag and drop support
    const editorElementForDrop = quill.container.querySelector('.ql-editor')
    if (editorElementForDrop) {
      editorElementForDrop.addEventListener('dragover', (e) => {
        e.preventDefault()
        editorElementForDrop.classList.add('drag-over')
      })
      
      editorElementForDrop.addEventListener('dragleave', (e) => {
        e.preventDefault()
        editorElementForDrop.classList.remove('drag-over')
      })
      
      editorElementForDrop.addEventListener('drop', (e) => {
        e.preventDefault()
        editorElementForDrop.classList.remove('drag-over')
        
        const files = e.dataTransfer.files
        if (files.length > 0) {
          const file = files[0]
          if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => {
              const range = quill.getSelection() || { index: quill.getLength() }
              quill.insertEmbed(range.index, 'image', reader.result)
              console.log('✅ Image inserted via drag and drop')
            }
            reader.readAsDataURL(file)
          } else {
            console.log('❌ Only image files are supported for drag and drop')
          }
        }
      })
    }
    
    // Force toolbar to be visible immediately
    const toolbarElement = quill.getModule('toolbar').container
    if (toolbarElement) {
      toolbarElement.style.display = 'flex'
      toolbarElement.style.visibility = 'visible'
      toolbarElement.style.opacity = '1'
      toolbarElement.style.height = 'auto'
    }
    
    // Ensure toolbar is always visible by adding focus/blur handlers
    const editorElementForFocus = quill.container.querySelector('.ql-editor')
    if (editorElementForFocus) {
      editorElementForFocus.addEventListener('focus', () => {
        if (toolbarElement) {
          toolbarElement.style.display = 'flex'
          toolbarElement.style.visibility = 'visible'
          toolbarElement.style.opacity = '1'
        }
      })
      
      editorElementForFocus.addEventListener('blur', () => {
        if (toolbarElement) {
          toolbarElement.style.display = 'flex'
          toolbarElement.style.visibility = 'visible'
          toolbarElement.style.opacity = '1'
        }
        // Auto-save on blur
        saveProjectDescription()
      })
    }
    
    console.log('✅ Quill instance created:', quill)
    
    // Debug toolbar
    const toolbarModule = quill.getModule('toolbar')
    console.log('🔧 Toolbar module:', toolbarModule)
    
    // Check if toolbar element exists
    setTimeout(() => {
      const toolbarElement = document.querySelector('#project-description-editor .ql-toolbar')
      console.log('🔧 Toolbar element:', toolbarElement)
      
      if (toolbarElement) {
        console.log('✅ Toolbar found and visible')
        toolbarElement.style.display = 'flex'
        toolbarElement.style.visibility = 'visible'
        toolbarElement.style.opacity = '1'
      } else {
        console.log('❌ Toolbar not found')
      }
    }, 100)
    
    // Listen for text changes
    quill.on('text-change', () => {
      if (project.value) {
        project.value.description = quill.root.innerHTML
      }
    })
    
    // Set initial content if editing
    if (project.value?.description) {
      quill.clipboard.dangerouslyPasteHTML(project.value.description)
    }
    
    // Remove focus from editor to prevent auto-focus on page load
    quill.blur()
    
    console.log('🎉 Description editor initialized successfully!')
    
  } catch (error: any) {
    console.error('❌ Error initializing description editor:', error)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }
}


// Lifecycle
onMounted(() => {
  loadProject()
  loadTasks()
  
  // Initialize editor if we're already on overview tab
  if (activeTab.value === 'overview') {
    nextTick(() => {
      setTimeout(() => {
        initializeDescriptionEditor()
      }, 100)
    })
  }
})

// Watch for tab changes to initialize editor
watch(activeTab, (newTab) => {
  if (newTab === 'overview') {
    nextTick(() => {
      initializeDescriptionEditor()
    })
  }
})

// Watch for project data to initialize editor with content (only when project first loads)
watch(project, (newProject) => {
  if (newProject && activeTab.value === 'overview' && quill && !quill.getText().trim()) {
    // Only set content if editor is empty (initial load)
    quill.root.innerHTML = newProject.description || ''
  }
}, { deep: true })

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadProject()
    loadTasks()
  }
})
</script>

<style scoped>
/* Custom styles for Quill editor */
:deep(.ql-editor) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: normal !important;
  transition: all 0.2s ease;
  color: #374151;
  padding: 16px !important;
  min-height: 350px !important;
}

/* Additional RTL prevention */
:deep(.ql-editor *) {
  direction: ltr !important;
  text-align: inherit !important;
}

/* Beautiful Quill container */
:deep(.ql-container) {
  direction: ltr !important;
  border: none !important;
  font-family: inherit;
}

/* Ensure Quill editor container has proper height */
#project-description-editor {
  min-height: 400px;
}

/* Beautiful toolbar styling */
:deep(.ql-toolbar) {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  height: 48px !important;
  min-height: 48px !important;
  padding: 8px 16px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.ql-toolbar .ql-formats) {
  display: flex !important;
  align-items: center !important;
  margin-right: 16px !important;
}

:deep(.ql-toolbar .ql-formats:not(:last-child)::after) {
  content: '';
  width: 1px;
  height: 20px;
  background: #d1d5db;
  margin-left: 8px;
}

:deep(.ql-toolbar button) {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  width: 28px !important;
  height: 28px !important;
  border-radius: 4px !important;
  margin: 0 1px !important;
  transition: all 0.15s ease !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.ql-toolbar button:hover) {
  background: #e5e7eb !important;
  color: #374151 !important;
}

:deep(.ql-toolbar button.ql-active) {
  background: #3b82f6 !important;
  color: white !important;
}

:deep(.ql-toolbar .ql-picker) {
  border-radius: 4px !important;
  transition: all 0.15s ease !important;
}

:deep(.ql-toolbar .ql-picker:hover) {
  background: #e5e7eb !important;
}

/* Editor content area */
:deep(.ql-container .ql-editor) {
  border-radius: 0 0 8px 8px;
  border: 1px solid #e2e8f0;
  border-top: none;
  background: white;
}

/* Focus states */
:deep(.ql-container.ql-snow:focus-within) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.ql-container.ql-snow:focus-within .ql-toolbar) {
  border-color: #3b82f6;
}

:deep(.ql-container.ql-snow:focus-within .ql-editor) {
  border-color: #3b82f6;
}

/* Drag and drop visual feedback */
:deep(.ql-editor.drag-over) {
  border: 2px dashed #3b82f6 !important;
  background-color: #eff6ff !important;
}

/* Placeholder styling */
:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af !important;
  font-style: italic !important;
  left: 16px !important;
}

/* Custom scrollbar for editor */
:deep(.ql-editor) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

:deep(.ql-editor::-webkit-scrollbar) {
  width: 6px;
}

:deep(.ql-editor::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.ql-editor::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 3px;
}

:deep(.ql-editor::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}
</style>
