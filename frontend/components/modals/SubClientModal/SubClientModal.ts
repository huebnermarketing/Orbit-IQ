import { defineComponent, ref, reactive, onMounted } from 'vue'

export default defineComponent({
  name: 'SubClientModal',
  props: {
    clientId: {
      type: String,
      required: true
    },
    subClient: {
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
    const loading = ref(false)
    const error = ref('')

    const form = reactive({
      name: '',
      email: '',
      phone: '',
      website: ''
    })

    onMounted(() => {
      if (props.isEdit && props.subClient) {
        form.name = props.subClient.name || ''
        form.email = props.subClient.email || ''
        form.phone = props.subClient.phone || ''
        form.website = props.subClient.website || ''
      }
    })

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''

      try {
        if (props.isEdit) {
          await $fetch(`/api/clients/${props.clientId}/sub-clients/${props.subClient.id}`, {
            method: 'PUT',
            body: form
          })
        } else {
          await $fetch(`/api/clients/${props.clientId}/sub-clients`, {
            method: 'POST',
            body: form
          })
        }
        
        emit('saved')
      } catch (err: any) {
        error.value = err.data?.message || 'An error occurred. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleSubmit
    }
  }
})