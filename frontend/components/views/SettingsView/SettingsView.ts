import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { authApi } from '~/composables/api/authApi';

export default {
  name: 'SettingsView',
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);
    const activeTab = ref('profile');

    // // Load active tab from localStorage
    // const loadActiveTab = () => {
    //   if (process.client) {
    //     const savedTab = localStorage.getItem('settingsActiveTab');
    //     if (savedTab && tabs.value.some((tab) => tab.id === savedTab)) {
    //       activeTab.value = savedTab;
    //     }
    //   }
    // };

    // // Save active tab to localStorage
    // const saveActiveTab = (tabId: string) => {
    //   if (process.client) {
    //     localStorage.setItem('settingsActiveTab', tabId)
    //   }
    // }

    const showMfaSetup = ref(false);
    const profileLoading = ref(false);
    const passwordLoading = ref(false);
    const mfaLoading = ref(false);
    const mfaStatus = ref({ enabled: false, backup_codes_count: 0 });
    const error = ref('');
    const success = ref('');

    const profileForm = reactive({
      name: '',
      email: '',
      timezone: 'UTC',
    });

    const passwordForm = reactive({
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    });

    const tabs = ref([
      {
        id: 'profile',
        name: 'Profile',
        icon: 'svg',
      },
      {
        id: 'security',
        name: 'Security',
        icon: 'svg',
      },
      {
        id: 'notifications',
        name: 'Notifications',
        icon: 'svg',
      },
      {
        id: 'theme',
        name: 'Theme & Colors',
        icon: 'svg',
      },
    ]);

    onMounted(() => {
      // loadActiveTab();
      if (user.value) {
        profileForm.name = user.value.name || '';
        profileForm.email = user.value.email || '';
        profileForm.timezone = (user.value as any).timezone || 'UTC';
      }
      loadMfaStatus();
    });

    const loadMfaStatus = async () => {
      try {
        const response = await authApi.getMfaStatus();
        mfaStatus.value = {
          enabled: response.mfa_enabled,
          backup_codes_count: response.backup_codes_count,
        };
      } catch (error) {
        console.error('Failed to load MFA status:', error);
        mfaStatus.value = { enabled: false, backup_codes_count: 0 };
      }
    };

    const updateProfile = async () => {
      profileLoading.value = true;
      error.value = '';
      success.value = '';

      try {
        const response = await authApi.updateProfile(profileForm);
        authStore.updateUser(response.user);
        success.value = 'Profile updated successfully!';

        // Clear success message after 3 seconds
        setTimeout(() => {
          success.value = '';
        }, 3000);
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to update profile. Please try again.';
      } finally {
        profileLoading.value = false;
      }
    };

    const changePassword = async () => {
      if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
        error.value = 'New passwords do not match.';
        return;
      }

      passwordLoading.value = true;
      error.value = '';
      success.value = '';

      try {
        await authApi.changePassword({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          new_password_confirmation: passwordForm.new_password_confirmation,
        });

        success.value = 'Password changed successfully!';

        // Clear form
        passwordForm.current_password = '';
        passwordForm.new_password = '';
        passwordForm.new_password_confirmation = '';

        // Clear success message after 3 seconds
        setTimeout(() => {
          success.value = '';
        }, 3000);
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to change password. Please try again.';
      } finally {
        passwordLoading.value = false;
      }
    };

    const setupMfa = () => {
      showMfaSetup.value = true;
    };

    const disableMfa = async () => {
      if (
        !confirm(
          'Are you sure you want to disable two-factor authentication? This will make your account less secure.'
        )
      ) {
        return;
      }

      mfaLoading.value = true;
      error.value = '';

      try {
        await authApi.disableMfa({ password: prompt('Please enter your password to confirm:') });
        await loadMfaStatus();
        success.value = 'Two-factor authentication has been disabled.';

        setTimeout(() => {
          success.value = '';
        }, 3000);
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to disable MFA. Please try again.';
      } finally {
        mfaLoading.value = false;
      }
    };

    const regenerateBackupCodes = async () => {
      if (
        !confirm(
          'This will invalidate your existing backup codes. Are you sure you want to continue?'
        )
      ) {
        return;
      }

      mfaLoading.value = true;
      error.value = '';

      try {
        const response = await authApi.regenerateBackupCodes();
        // Show backup codes in a modal or alert
        alert(
          'New backup codes generated:\n\n' +
            response.backup_codes.join('\n') +
            '\n\nPlease save these codes in a safe place.'
        );
        await loadMfaStatus();
        success.value = 'Backup codes regenerated successfully.';

        setTimeout(() => {
          success.value = '';
        }, 3000);
      } catch (err: any) {
        error.value =
          err.response?.data?.message || 'Failed to regenerate backup codes. Please try again.';
      } finally {
        mfaLoading.value = false;
      }
    };

    const handleMfaSetupSuccess = () => {
      showMfaSetup.value = false;
      loadMfaStatus();
      success.value = 'Two-factor authentication has been enabled successfully!';

      setTimeout(() => {
        success.value = '';
      }, 3000);
    };

    const handleAvatarUpload = async (file: File) => {
      try {
        const response = await authApi.uploadAvatar(file);
        authStore.updateUser(response.user);
        success.value = 'Avatar updated successfully!';

        setTimeout(() => {
          success.value = '';
        }, 3000);
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to upload avatar. Please try again.';
      }
    };

    const handleAvatarError = (message: string) => {
      error.value = message;
    };

    const handleThemeChanged = async (themeName: string) => {
      try {
        await authApi.updateThemePreference(themeName);
        success.value = 'Theme updated successfully!';
        setTimeout(() => {
          success.value = '';
        }, 3000);
      } catch (err: any) {
        error.value = 'Failed to save theme preference. Please try again.';
      }
    };

    return {
      user,
      activeTab,
      tabs,
      success,
      error,
      profileForm,
      passwordForm,
      profileLoading,
      passwordLoading,
      mfaLoading,
      mfaStatus,
      showMfaSetup,
      // loadActiveTab,
      // saveActiveTab,
      updateProfile,
      changePassword,
      setupMfa,
      disableMfa,
      regenerateBackupCodes,
      handleMfaSetupSuccess,
      handleAvatarUpload,
      handleAvatarError,
      handleThemeChanged,
      loadMfaStatus,
    };
  },
};
