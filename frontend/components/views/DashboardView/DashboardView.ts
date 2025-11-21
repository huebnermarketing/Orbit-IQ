import { defineComponent, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    return {
      user
    }
  }
})
