// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
      console.log('[Auth Middleware] Redirecting to login...');
      return navigateTo('/auth/login');
    }
  }
});
