export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Initialize auth store and check for existing session
  await authStore.initialize()
})