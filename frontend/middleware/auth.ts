// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    const expiresAt = localStorage.getItem('token_expires_at')

    const isAuthenticated =
      token &&
      expiresAt &&
      new Date(expiresAt) > new Date()

    if (!isAuthenticated) {
      console.log('[Auth Middleware] Redirecting to login...')
      return navigateTo('/auth/login')
    }
  }
})
