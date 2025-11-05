export default defineNuxtPlugin({
  name: 'auth-init',
  // enforce: 'pre', // Run before other plugins
  async setup() {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const authStore = useAuthStore();
    // Initialize auth store and check for existing session
    await authStore.initialize();
  },
});
