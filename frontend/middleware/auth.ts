/**
 * Authentication Middleware for Nuxt 4
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware((_to, _from) => {
  const token = useCookie('token')
  const expiresAt = useCookie('token_expires_at')

  // Check if token exists and is not expired
  const isAuthenticated = token.value && expiresAt.value && new Date(expiresAt.value) > new Date()

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login...');
    
    // Redirect to login page if not authenticated
    return navigateTo('/auth/login')
  }
})