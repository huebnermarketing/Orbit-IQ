import { ref, reactive, computed, watch } from 'vue'
import { getContrastColor, getRandomColor } from '@/composables/useHelpers'

interface Props {
  show: boolean
  projectStatus?: any
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const error = ref('')

const isLocked = computed(() => props.projectStatus?.is_locked || false)

const form = reactive({
  name: '',
  category: '',
  color: '#3B82F6',
  is_active: true,
  sort_order: 0
})

const categoryOptions = {
  todo: 'ToDo',
  in_progress: 'In Progress',
  closed: 'Closed'
}

const getCategoryLabel = (category: string) => {
  return categoryOptions[category as keyof typeof categoryOptions] || category
}

const initializeForm = () => {
  error.value = ''
  
  if (props.isEdit && props.projectStatus) {
    form.name = props.projectStatus.name || ''
    form.category = props.projectStatus.category || ''
    form.color = props.projectStatus.color || '#3B82F6'
    form.is_active = props.projectStatus.is_active ?? true
    form.sort_order = props.projectStatus.sort_order || 0
  } else {
    form.name = ''
    form.category = ''
    form.color = '#3B82F6'
    form.is_active = true
    form.sort_order = 0
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const statusData = {
      name: form.name,
      category: form.category,
      color: form.color,
      is_active: form.is_active,
      sort_order: form.sort_order
    }

    if (props.isEdit && props.projectStatus) {
      await $fetch(`/api/project-statuses/${props.projectStatus.id}`, {
        method: 'PUT',
        body: statusData
      })
    } else {
      await $fetch('/api/project-statuses', {
        method: 'POST',
        body: statusData
      })
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving project status:', err)
    
    if (err.data?.errors) {
      const errors = err.data.errors
      const errorMessages = Object.values(errors).flat()
      error.value = errorMessages.join(', ')
    } else if (err.data?.message) {
      error.value = err.data.message
    } else {
      error.value = 'Failed to save project status. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    initializeForm()
  }
})

watch(() => props.projectStatus, () => {
  if (props.show) {
    initializeForm()
  }
}, { deep: true })

export {props,
  emit,
  form,
  loading,
  error,
  isLocked,
  getContrastColor,
  getRandomColor,handleSubmit,getCategoryLabel
}