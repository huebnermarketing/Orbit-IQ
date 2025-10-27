import { defineComponent, ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
const router = useRouter()
    const form = reactive({
      email: '',
      password: '',
      mfa_code: '',
      remember: false
    })

    const loading = ref(false)
    const error = ref('')
    const mfaRequired = ref(false)
    const showForgotPassword = ref(false)

    const currentYear = computed(() => new Date().getFullYear())

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      try {
        await authStore.login(
          form.email,
          form.password,
          form.mfa_code,
          form.remember
        )
        // if (response.mfa_required) {
        //   mfaRequired.value = true
        //   form.mfa_code = ''
        //   return
        // }
        
       router.push('/dashboard') 
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const handleForgotPasswordSuccess = () => {
      showForgotPassword.value = false
      error.value = ''
    }

    return {
      user,
      form,
      loading,
      error,
      mfaRequired,
      showForgotPassword,
      currentYear,
      handleLogin,
      handleForgotPasswordSuccess
    }
  }
})
