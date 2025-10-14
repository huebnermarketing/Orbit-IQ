import { defineComponent, ref, computed, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

export default defineComponent({
  name: 'ClientPersonModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    clientId: {
      type: String,
      required: true
    },
    clientPerson: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const loading = ref(false)
    const form = ref({
      name: '',
      email: '',
      phone: '',
      status: 'pending'
    })

    const availableStatusOptions = computed(() => {
      if (!props.isEdit) {
        return [{ value: 'pending', label: 'Pending' }]
      }
      
      const currentStatus = props.clientPerson?.status
      
      if (currentStatus === 'pending') {
        return [{ value: 'pending', label: 'Pending' }]
      } else {
        return [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]
      }
    })

    const isUserActivated = computed(() => {
      return props.clientPerson?.status === 'active' || props.clientPerson?.status === 'inactive'
    })

    const isSuperAdmin = computed(() => {
      return authStore.user?.role === 'super_admin'
    })

    const canEditEmail = computed(() => {
      return !isUserActivated.value || isSuperAdmin.value
    })

    const initializeForm = () => {
      if (props.clientPerson && props.isEdit) {
        form.value = {
          name: props.clientPerson.name || '',
          email: props.clientPerson.email || '',
          phone: props.clientPerson.phone || '',
          status: props.clientPerson.status || 'pending'
        }
      } else {
        form.value = {
          name: '',
          email: '',
          phone: '',
          status: 'pending'
        }
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      
      try {
        if (props.isEdit && props.clientPerson) {
          await $fetch(`/api/clients/${props.clientId}/persons/${props.clientPerson.id}`, {
            method: 'PUT',
            body: form.value
          })
        } else {
          await $fetch(`/api/clients/${props.clientId}/persons`, {
            method: 'POST',
            body: form.value
          })
        }
        
        emit('saved')
      } catch (error) {
        console.error('Failed to save client person:', error)
      } finally {
        loading.value = false
      }
    }

    watch(() => props.show, (newValue) => {
      if (newValue) {
        initializeForm()
      }
    })

    watch(() => props.clientPerson, () => {
      initializeForm()
    }, { deep: true })

    return {
      form,
      loading,
      availableStatusOptions,
      canEditEmail,
      handleSubmit
    }
  }
})