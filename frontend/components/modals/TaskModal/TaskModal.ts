import { ref, reactive, computed, onMounted } from 'vue'

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
  estimated_hours: null as number | null,
  actual_hours: null as number | null,
  tags: [] as string[]
})

const loadUsers = async () => {
  try {
    const response = await $fetch('/api/users') as any
    users.value = response.data || []
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

const loadParentTasks = async () => {
  try {
    const response = await $fetch(`/api/tasks?project_id=${props.projectId}&include_subtasks=false`) as any
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
      await $fetch(`/api/tasks/${props.task.id}`, {
        method: 'PUT',
        body: taskData
      })
    } else {
      await $fetch('/api/tasks', {
        method: 'POST',
        body: taskData
      })
    }
    
    emit('saved')
    emit('close')
  } catch (err: any) {
    error.value = err.data?.message || 'An error occurred. Please try again.'
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

export {props,
  emit,
  form,
  loading,
  error,
  handleSubmit,addTag,
  removeTag,
  users,
}