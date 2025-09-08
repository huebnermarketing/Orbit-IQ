import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/clients/:id',
      name: 'ClientDetail',
      component: () => import('@/views/clients/ClientDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('@/views/projects/ProjectsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/project/:id',
      name: 'Project',
      component: () => import('@/views/project/ProjectView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/task/:id',
      name: 'Task',
      component: () => import('@/views/task/TaskView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/settings/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/org-settings',
      name: 'OrgSettings',
      component: () => import('@/views/org-settings/OrgSettingsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/client/setup-password',
      name: 'ClientPasswordSetup',
      component: () => import('@/views/auth/ClientPasswordSetupView.vue'),
      meta: { requiresGuest: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth store to initialize
  await authStore.initialize()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && authStore.isAuthenticated) {
    // Check if user is admin or super admin
    const user = authStore.user
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      next('/dashboard') // Redirect to dashboard if not admin
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
