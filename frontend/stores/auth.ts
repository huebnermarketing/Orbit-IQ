import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '~/types/user';
// import { useTheme } from '~/composables/useTheme';

export const useAuthStore = defineStore('auth', () => {
  // ✅ Reactive state
  const user = ref<User | null>(null);
  const token = ref<string | null>(import.meta.client ? localStorage.getItem('token') : null);
  const loading = ref(false);
  const initialized = ref(false);

  // ✅ Derived state
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // ✅ Initialize session (called on app mount or layout)
  const initialize = async () => {
    if (initialized.value) return;

    // if (!import.meta.client) {
    //   initialized.value = true;
    //   return;
    // }

    const savedToken = localStorage.getItem('token');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');

    console.log('🔹 Initializing auth store. Token:', savedToken ? 'exists' : 'none');

    if (savedToken && tokenExpiresAt) {
      const expirationDate = new Date(tokenExpiresAt);
      if (expirationDate <= new Date()) {
        console.log('⏰ Token expired, clearing data');
        clearAuth();
        initialized.value = true;
        return;
      }
    }

    if (savedToken) {
      token.value = savedToken;
      // Get API and theme composables inside the method to avoid serialization issues
      const { $authApi } = useNuxtApp();
      const { setTheme } = useTheme();
      // $authApi.setAuthToken(savedToken)
      try {
        const response = await $authApi.getProfile();
        user.value = response.user ?? response;
        // Apply theme from user preference
        if (user.value?.theme_preference) {
          setTheme(user.value.theme_preference);
        }
        console.log('✅ Auth initialized successfully:', user.value);
      } catch (error) {
        console.error('❌ Token validation failed:', error);
        clearAuth();
      }
    }

    initialized.value = true;
  };

  // ✅ Login
  const login = async (email: string, password: string, mfaCode?: string, remember?: boolean) => {
    loading.value = true;
    try {
      // Get API and theme composables inside the method to avoid serialization issues
      const { $authApi } = useNuxtApp();
      const { setTheme } = useTheme();
      const response = await $authApi.login(email, password, mfaCode, remember);
      console.log('🔹 Login response:', response);

      // if (response.mfa_required) return response

      token.value = response.token;
      user.value = response.user ?? null;
      // Apply theme from user preference
      if (user.value?.theme_preference) {
        setTheme(user.value.theme_preference);
      }

      if (import.meta.client && response.token) {
        localStorage.setItem('token', response.token);
        if (response.expires_at) localStorage.setItem('token_expires_at', response.expires_at);
        if (response.remember !== undefined)
          localStorage.setItem('remember_me', String(response.remember));
      }

      // $authApi.setAuthToken(response.token)
      console.log('✅ Login successful. User:', user.value);
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Register
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    loading.value = true;
    try {
      // Get API composable inside the method to avoid serialization issues
      const { $authApi } = useNuxtApp();
      const response = await $authApi.register(userData);
      token.value = response.token;
      user.value = response.user ?? null;

      if (import.meta.client) {
        localStorage.setItem('token', response.token);
      }

      // $authApi.setAuthToken(response.token)
      return response;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      // Get API composable inside the method to avoid serialization issues
      const { $authApi } = useNuxtApp();
      if (token.value) await $authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  // ✅ Clear local auth data
  const clearAuth = () => {
    if (import.meta.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('remember_me');
    }
    token.value = null;
    user.value = null;
    // $authApi.clearAuthToken()
  };

  // ✅ Update user object
  const updateUser = (userData: User) => {
    user.value = userData;
  };

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    updateUser,
  };
});
