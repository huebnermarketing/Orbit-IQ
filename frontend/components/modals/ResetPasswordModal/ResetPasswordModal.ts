import { defineComponent, ref, reactive } from 'vue'

interface FormData {
  password: string
  password_confirmation: string
}

export default defineComponent({
  name: 'ResetPasswordModal',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const error = ref('')

    const form = reactive<FormData>({
      password: '',
      password_confirmation: ''
    })

    const handleSubmit = async () => {
      if (form.password !== form.password_confirmation) {
        error.value = 'Passwords do not match'
        return
      }

      loading.value = true
      error.value = ''

      try {
        await $fetch(`/api/users/${props.user.id}/reset-password`, {
          method: 'POST',
          body: {
            password: form.password,
            password_confirmation: form.password_confirmation
          }
        })
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