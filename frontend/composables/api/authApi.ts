import type { AuthResponse, RegisterData } from '@/types/user'

export const authApi = {
  login: (email: string, password: string, mfaCode?: string, remember?: boolean) => {
    const body = { email, password, ...(mfaCode && { mfa_code: mfaCode }), ...(remember !== undefined && { remember }) }
    return useApiFetch<AuthResponse>('/auth/login', { method: 'POST', body })
  },

  register: (userData: RegisterData) =>
    useApiFetch<AuthResponse>('/auth/register', { method: 'POST', body: userData }),

  logout: () => useApiFetch<void>('/auth/logout', { method: 'POST' }),

  forgotPassword: (email: string) =>
    useApiFetch<void>('/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    useApiFetch('/auth/reset-password', { method: 'POST', body: data }),

  getProfile: () => useApiFetch('/profile'),

  updateProfile: (data: any) =>
    useApiFetch('/profile', { method: 'PUT', body: data }),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return useApiFetch('/profile/avatar', { method: 'POST', body: form })
  },

  changePassword: (data: any) =>
    useApiFetch('/profile/change-password', { method: 'POST', body: data }),

  deleteAvatar: () =>
    useApiFetch('/profile/avatar', { method: 'DELETE' }),

  updateThemePreference: (theme: string) =>
    useApiFetch('/profile/theme', { method: 'PUT', body: { theme_preference: theme } }),

  getMfaStatus: () => useApiFetch('/mfa/status'),
  setupMfa: () => useApiFetch('/mfa/setup', { method: 'POST' }),
  enableMfa: (data: any) => useApiFetch('/mfa/enable', { method: 'POST', body: data }),
  disableMfa: (data: any) => useApiFetch('/mfa/disable', { method: 'POST', body: data }),
  regenerateBackupCodes: () => useApiFetch('/mfa/regenerate-backup-codes', { method: 'POST' }),
  
  // Project-related methods
  getProjectStatuses: () => useApiFetch('/project-statuses'),
  getProjectTypes: () => useApiFetch('/project-types'),
}
