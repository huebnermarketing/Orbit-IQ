/**
 * Root Middleware
 * Redirects authenticated users to /dashboard, unauthenticated users to /auth/login
 */
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return navigateTo('/dashboard');
  } else {
    return navigateTo('/auth/login');
  }
});
