import { defineComponent, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const { $userApi } = useNuxtApp();
    const authStore = useAuthStore();
    const user = authStore.user;

    const activeSection = ref('profile');

    const settingsSections = [
      { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
      { id: 'security', label: 'Security', icon: 'fas fa-lock' },
      { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
      { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' },
      { id: 'theme', label: 'Theme & Colors', icon: 'fas fa-palette' },
    ];

    const handleThemeChanged = (themeName: string) => {
      console.log('Theme changed to:', themeName);
    };
    const handleAvatarUpload = async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await $userApi.uploadAvatar(formData);
        authStore.updateUser(response.user);
        // success.value = 'Avatar updated successfully!';

        setTimeout(() => {
          // success.value = '';
        }, 3000);
      } catch (err: any) {
        // error.value = err.response?.data?.message || 'Failed to upload avatar. Please try again.';
      }
    };

    const handleAvatarError = () => {
      // error.value = message;
    };

    return {
      user,
      activeSection,
      settingsSections,
      handleThemeChanged,
      handleAvatarUpload,
      handleAvatarError,
    };
  },
});
