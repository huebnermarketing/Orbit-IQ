import { defineComponent, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const authStore = useAuthStore()
    const user = authStore.user

    const activeSection = ref('profile')

    const settingsSections = [
      { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
      { id: 'security', label: 'Security', icon: 'fas fa-lock' },
      { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
      { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' },
      { id: 'theme', label: 'Theme & Colors', icon: 'fas fa-palette' },
    ]

    const handleThemeChanged = (themeName: string) => {
      console.log('Theme changed to:', themeName)
    }

    return {
      user,
      activeSection,
      settingsSections,
      handleThemeChanged,
    }
  },
})