/**
 * Guest Middleware for Nuxt 4
 * Redirects authenticated users away from auth pages (login, register, etc.)
 */

export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuthStore();
  // const token = useCookie('token')
  // const expiresAt = useCookie('token_expires_at')

  // // Check if token exists and is not expired
  // const isAuthenticated = token.value && expiresAt.value && new Date(expiresAt.value) > new Date()

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return navigateTo('/dashboard');
  }
});
