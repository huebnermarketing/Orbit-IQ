<template>
  <!-- Project Header with Navigation -->
    <div class="bg-white border-b border-gray-200 px-6 py-4 mb-6">
      <!-- Project Title -->
      <div class="flex items-center space-x-3 mb-4">
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden"
        >
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
          <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            ></path>
          </svg>
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
        <!-- Task List Controls -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <button
              @click="showCreateTaskModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Add task
            </button>

            <div class="flex items-center space-x-2">
              <button class="text-gray-600 hover:text-gray-900 text-sm">
                Filter: {{ activeFilters }}
              </button>
              <button class="text-gray-600 hover:text-gray-900 text-sm">Sort</button>
              <button class="text-gray-600 hover:text-gray-900 text-sm">Group by</button>
              <button class="text-gray-600 hover:text-gray-900 text-sm">Hide</button>
            </div>
          </div>
        </div>

        <!-- Task Sections -->
        <div class="space-y-6">
          <!-- User-Created Sections -->
          <div
            v-for="section in userSections"
            :key="section.id"
            class="bg-white rounded-lg border border-gray-200"
          >
            <!-- Section Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <button class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <h3 class="text-lg font-medium text-gray-900">{{ section.name }}</h3>
                  <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">{{
                    section.tasks.length
                  }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="showCreateSectionModal = true"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tasks List -->
            <div class="divide-y divide-gray-200">
              <div
                v-for="task in section.tasks"
                :key="task.id"
                class="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    :checked="task.status === 'completed'"
                    @change="toggleTaskStatus(task)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />

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
            <button
              @click="showCreateSectionModal = true"
              class="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
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
            <div
              class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg
                      class="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
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
                    <div v-if="savingBasicDetails" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 inline-block"></div>
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
                    <label
                      class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
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
                  <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <label
                      class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                      >Client</label
                    >
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
                    <p v-else class="text-sm font-medium text-gray-900">
                      {{ project?.client?.company_name || '-' }}
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <label
                      class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                      >Status</label
                    >
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
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <label
                      class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                      >Job Code</label
                    >
                    <input
                      v-if="isEditingBasicDetails"
                      v-model="editingBasicDetails.job_code"
                      type="text"
                      class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter job code"
                    />
                    <p v-else class="text-sm font-medium text-gray-900">
                      {{ project?.job_code || '-' }}
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <label
                      class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                      >Sub-Client</label
                    >
                    <select
                      v-if="isEditingBasicDetails"
                      v-model="editingBasicDetails.sub_client_id"
                      class="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :disabled="!editingBasicDetails.client_id"
                    >
                      <option value="">Select Sub Client</option>
                      <option
                        v-for="subClient in subClients"
                        :key="subClient.id"
                        :value="subClient.id"
                      >
                        {{ subClient.name }}
                      </option>
                    </select>
                    <p v-else class="text-sm font-medium text-gray-900">
                      {{ project?.sub_client?.name || 'Select Sub Client' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Info Card -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <!-- Header -->
              <div
                class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg
                        class="w-4 h-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Financial Info</h3>
                      <p class="text-sm text-gray-500">Budget and funding details</p>
                    </div>
                  </div>
                  <button
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
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
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Project Hour Type</label
                      >
                      <p class="text-sm font-medium text-gray-900">
                        {{ project?.hour_type || 'Billable' }}
                      </p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Funding Source</label
                      >
                      <p class="text-sm font-medium text-gray-900">
                        {{ project?.funding_source || '-' }}
                      </p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Project Type</label
                      >
                      <span
                        v-if="project?.project_type"
                        :style="{ backgroundColor: project.project_type.color, color: 'white' }"
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                      >
                        {{ project.project_type.name }}
                      </span>
                      <span v-else class="text-xs text-gray-500">-</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Micro Budget</label
                      >
                      <div class="flex items-center">
                        <div class="w-10 h-5 bg-gray-300 rounded-full relative">
                          <div
                            class="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Estimate</label
                      >
                      <p class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">
                        -
                      </p>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Bucket Code</label
                      >
                      <p class="text-sm font-medium text-gray-900">
                        {{ project?.client?.company_name || 'Client' }}
                        {{ project?.project_type?.name || 'Project' }} Agreement
                      </p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Invoice Number</label
                      >
                      <p class="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700">
                        Invoice Number
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Project Management Card -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <!-- Header -->
              <div
                class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg
                        class="w-4 h-4 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        ></path>
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
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
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
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Start Date</label
                      >
                      <p class="text-sm font-medium text-gray-900">
                        {{ project?.start_date ? formatDate(project.start_date) : 'No start date' }}
                      </p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Quoted Hours</label
                      >
                      <p class="text-sm font-medium text-gray-900">0</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Created</label
                      >
                      <p class="text-sm font-medium text-gray-900">
                        {{ project?.created_at ? formatDate(project.created_at) : '-' }}
                      </p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Reminder</label
                      >
                      <div class="flex items-center space-x-1">
                        <svg
                          class="w-3 h-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <p class="text-sm text-gray-500">No Reminder</p>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
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
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Due Date</label
                      >
                      <p class="text-sm font-medium text-red-600">
                        {{ project?.due_date ? formatDate(project.due_date) : 'No Due date' }}
                      </p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Utilized Hours</label
                      >
                      <div class="flex items-center space-x-2">
                        <p class="text-sm font-medium text-gray-900">0:00 Hours</p>
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                          <div class="bg-green-500 h-2 rounded-full" style="width: 0%"></div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label
                        class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
                        >Delivery Date</label
                      >
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
            <div
              class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-violet-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
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
                    <svg
                      class="w-4 h-4 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                    Group Teams
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
                    >
                      T Task - WLIQ/India
                      <button class="ml-2 text-blue-600 hover:text-blue-800 transition-colors">
                        ×
                      </button>
                    </span>
                    <span
                      class="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm"
                    >
                      W Warranty Period Team
                      <button class="ml-2 text-purple-600 hover:text-purple-800 transition-colors">
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Individual Team Members Section -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg
                      class="w-4 h-4 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      ></path>
                    </svg>
                    Individual Members
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <div
                      class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm"
                    >
                      <div
                        class="w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center"
                      >
                        <span class="text-white text-xs font-medium">A</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900">Aagna Paneri</span>
                      <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                    </div>
                    <div
                      class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm"
                    >
                      <div
                        class="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
                      >
                        <span class="text-white text-xs font-medium">A</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900">Aditi Singh</span>
                      <button class="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                    </div>
                    <div
                      class="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 shadow-sm"
                    >
                      <div
                        class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center"
                      >
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
          <div
            class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Project Description</h3>
                  <p class="text-sm text-gray-500">Rich text editor with formatting options</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
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
        <svg
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Activity</h3>
        <p class="text-gray-500">Activity feed coming soon...</p>
      </div>

      <div v-else-if="activeTab === 'client'" class="text-center py-12">
        <svg
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Client</h3>
        <p class="text-gray-500">Client information coming soon...</p>
      </div>

      <div v-else-if="activeTab === 'hour_report'" class="text-center py-12">
        <svg
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          ></path>
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
</template>

<script lang="ts" src="./ProjectDetail.ts"></script>
<style scoped src="./ProjectDetail.css"></style>
