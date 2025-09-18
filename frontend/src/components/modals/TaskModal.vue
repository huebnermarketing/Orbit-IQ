<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-surface px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-text-primary">
              {{ isEdit ? 'Edit Task' : 'Create New Task' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Task Name -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Task Name <span class="text-error-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="input"
                placeholder="Enter task name"
                required
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Description</label>
              <textarea
                v-model="form.description"
                class="input"
                rows="4"
                placeholder="Enter task description"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Status</label>
                <select v-model="form.status" class="input">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Priority -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Priority</label>
                <select v-model="form.priority" class="input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Assigned To -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Assigned To</label>
                <select v-model="form.assigned_to" class="input">
                  <option value="">Unassigned</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.email }})
                  </option>
                </select>
              </div>

              <!-- Parent Task -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Parent Task</label>
                <select v-model="form.parent_task_id" class="input">
                  <option value="">No Parent Task</option>
                  <option v-for="task in parentTasks" :key="task.id" :value="task.id">
                    {{ task.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Start Date -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Start Date</label>
                <input
                  v-model="form.start_date"
                  type="date"
                  class="input"
                />
              </div>

              <!-- Due Date -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Due Date</label>
                <input
                  v-model="form.due_date"
                  type="date"
                  class="input"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Estimated Hours -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Estimated Hours</label>
                <input
                  v-model.number="form.estimated_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  class="input"
                  placeholder="0"
                />
              </div>

              <!-- Actual Hours -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Actual Hours</label>
                <input
                  v-model.number="form.actual_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  class="input"
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">Tags</label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <span v-for="(tag, index) in form.tags" :key="index" 
                        class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {{ tag }}
                    <button type="button" @click="removeTag(index)" class="ml-1 text-primary-600 hover:text-primary-800">×</button>
                  </span>
                </div>
                <div class="flex">
                  <input
                    v-model="newTag"
                    type="text"
                    class="input flex-1"
                    placeholder="Add a tag"
                    @keydown.enter.prevent="addTag"
                  />
                  <button type="button" @click="addTag" class="btn-outline ml-2">Add</button>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="$emit('close')"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                {{ loading ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { taskApi, authApi } from '@/utils/api'

interface Props {
  task?: any
  projectId: string
}

const props = withDefaults(defineProps<Props>(), {
  projectId: ''
})

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const error = ref('')
const users = ref<any[]>([])
const parentTasks = ref<any[]>([])
const newTag = ref('')

const isEdit = computed(() => !!props.task)

const form = reactive({
  name: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigned_to: '',
  parent_task_id: '',
  start_date: '',
  due_date: '',
  estimated_hours: null,
  actual_hours: null,
  tags: [] as string[]
})

// Methods
const loadUsers = async () => {
  try {
    const response = await authApi.getUsers()
    users.value = response.data || []
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

const loadParentTasks = async () => {
  try {
    const response = await taskApi.getTasks({
      project_id: props.projectId,
      include_subtasks: false // Only get parent tasks
    })
    parentTasks.value = response.data || []
  } catch (error) {
    console.error('Failed to load parent tasks:', error)
  }
}

const addTag = () => {
  if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
    form.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  form.tags.splice(index, 1)
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const taskData = {
      ...form,
      project_id: props.projectId,
      assigned_to: form.assigned_to || null,
      parent_task_id: form.parent_task_id || null,
      start_date: form.start_date || null,
      due_date: form.due_date || null,
      estimated_hours: form.estimated_hours || null,
      actual_hours: form.actual_hours || null
    }

    if (isEdit.value) {
      await taskApi.updateTask(props.task.id, taskData)
    } else {
      await taskApi.createTask(taskData)
    }
    
    emit('saved')
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadUsers(),
    loadParentTasks()
  ])
  
  if (props.task) {
    form.name = props.task.name || ''
    form.description = props.task.description || ''
    form.status = props.task.status || 'todo'
    form.priority = props.task.priority || 'medium'
    form.assigned_to = props.task.assigned_to || ''
    form.parent_task_id = props.task.parent_task_id || ''
    form.start_date = props.task.start_date ? props.task.start_date.split('T')[0] : ''
    form.due_date = props.task.due_date ? props.task.due_date.split('T')[0] : ''
    form.estimated_hours = props.task.estimated_hours || null
    form.actual_hours = props.task.actual_hours || null
    form.tags = props.task.tags || []
  }
})
</script>


