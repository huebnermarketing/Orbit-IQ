<template>
  <div>
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

    <!-- Create Task Modal -->
    <TaskModal 
      v-if="showCreateTaskModal"
      :project-id="projectId"
      @close="showCreateTaskModal = false"
      @saved="handleTaskSaved"
    />
  </div>
</template>

<script lang="ts" src="./TaskList.ts"></script>
<style scoped src="./TaskList.css"></style>
