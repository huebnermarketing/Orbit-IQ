import axios from 'axios'
import type { AuthResponse, RegisterData } from '@/types/user'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect on login attempts - let the login component handle the error
      if (!error.config?.url?.includes('/auth/login')) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (email: string, password: string, mfaCode?: string, remember?: boolean): Promise<AuthResponse> => {
    const credentials = { 
      email, 
      password, 
      ...(mfaCode && { mfa_code: mfaCode }),
      ...(remember !== undefined && { remember: remember })
    }
    return api.post('/auth/login', credentials).then(res => res.data)
  },
  
  register: (userData: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register', userData).then(res => res.data),
  
  logout: (): Promise<void> =>
    api.post('/auth/logout').then(res => res.data),
  
  forgotPassword: (email: string): Promise<void> =>
    api.post('/auth/forgot-password', { email }).then(res => res.data),
  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }): Promise<any> => 
    api.post('/auth/reset-password', data).then(res => res.data),
  
  getProfile: (): Promise<any> =>
    api.get('/profile').then(res => res.data),
  
  updateProfile: (data: any): Promise<any> =>
    api.put('/profile', data).then(res => res.data),
  
  uploadAvatar: (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => res.data)
  },
  
  changePassword: (data: any): Promise<void> =>
    api.post('/profile/change-password', data).then(res => res.data),
  
  deleteAvatar: (): Promise<void> =>
    api.delete('/profile/avatar').then(res => res.data),
  
  updateThemePreference: (themePreference: string): Promise<any> =>
    api.put('/profile/theme', { theme_preference: themePreference }).then(res => res.data),
  
  // MFA API methods
  getMfaStatus: (): Promise<any> =>
    api.get('/mfa/status').then(res => res.data),
  
  setupMfa: (): Promise<any> =>
    api.post('/mfa/setup').then(res => res.data),
  
  enableMfa: (data: any): Promise<any> =>
    api.post('/mfa/enable', data).then(res => res.data),
  
  disableMfa: (data: any): Promise<any> =>
    api.post('/mfa/disable', data).then(res => res.data),
  
  regenerateBackupCodes: (): Promise<any> =>
    api.post('/mfa/regenerate-backup-codes').then(res => res.data),
  
  // Token management
  setAuthToken: (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  
  clearAuthToken: () => {
    delete api.defaults.headers.common['Authorization']
  },

  // Generic API methods
  get: (url: string): Promise<any> =>
    api.get(url).then(res => res.data),
  
  post: (url: string, data?: any): Promise<any> =>
    api.post(url, data).then(res => res.data),
  
  put: (url: string, data?: any): Promise<any> =>
    api.put(url, data).then(res => res.data),
  
  delete: (url: string): Promise<any> =>
    api.delete(url).then(res => res.data),

  // User Management API methods
  getUsers: (params?: any): Promise<any> => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/admin/users${queryString}`).then(res => res.data)
  },
  
  createUser: (userData: any): Promise<any> =>
    api.post('/admin/users', userData).then(res => res.data),
  
  updateUser: (id: string, userData: any): Promise<any> =>
    api.put(`/admin/users/${id}`, userData).then(res => res.data),
  
  deleteUser: (id: string): Promise<any> =>
    api.delete(`/admin/users/${id}`).then(res => res.data),
  
  resetUserPassword: (id: string, passwordData: any): Promise<any> =>
    api.post(`/admin/users/${id}/reset-password`, passwordData).then(res => res.data),

  // Organization API methods
  getOrganizationProfile: (): Promise<any> =>
    api.get('/admin/organization/profile').then(res => res.data),
  
  updateOrganizationProfile: (data: any): Promise<any> =>
    api.put('/admin/organization/profile', data).then(res => res.data),
  
  uploadOrganizationLogo: (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('logo', file)
    return api.post('/admin/organization/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => res.data)
  },

  // Organization Roles API methods
  getOrganizationRoles: (): Promise<any> => api.get('/admin/organization-roles').then(res => res.data),
  createOrganizationRole: (roleData: any): Promise<any> => api.post('/admin/organization-roles', roleData).then(res => res.data),
  updateOrganizationRole: (id: string, roleData: any): Promise<any> => api.put(`/admin/organization-roles/${id}`, roleData).then(res => res.data),
  deleteOrganizationRole: (id: string): Promise<any> => api.delete(`/admin/organization-roles/${id}`).then(res => res.data),
  getOrganizationRoleUsers: (id: string): Promise<any> => api.get(`/admin/organization-roles/${id}/users`).then(res => res.data),

  // PM Users API method
  getPMUsers: (): Promise<any> => api.get('/admin/users/pm-users').then(res => res.data),
  
  // AM Users API method
  getAMUsers: (): Promise<any> => api.get('/admin/users/am-users').then(res => res.data),

  // Teams API methods
  getTeams: (): Promise<any> => api.get('/admin/teams').then(res => res.data),
  createTeam: (teamData: any): Promise<any> => api.post('/admin/teams', teamData).then(res => res.data),
  updateTeam: (id: string, teamData: any): Promise<any> => api.put(`/admin/teams/${id}`, teamData).then(res => res.data),
  deleteTeam: (id: string): Promise<any> => api.delete(`/admin/teams/${id}`).then(res => res.data),
  getTeam: (id: string): Promise<any> => api.get(`/admin/teams/${id}`).then(res => res.data),
  addTeamMembers: (teamId: string, memberData: any): Promise<any> => api.post(`/admin/teams/${teamId}/members`, memberData).then(res => res.data),
  removeTeamMembers: (teamId: string, memberData: any): Promise<any> => api.delete(`/admin/teams/${teamId}/members`, { data: memberData }).then(res => res.data),
  updateTeamMemberRole: (teamId: string, userId: string, roleData: any): Promise<any> => api.put(`/admin/teams/${teamId}/members/${userId}`, roleData).then(res => res.data),
  getAvailableUsers: (): Promise<any> => api.get('/admin/teams/users/available').then(res => res.data),

  // User Groups API methods
  getUserGroups: (params?: any): Promise<any> => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/admin/user-groups${queryString}`).then(res => res.data)
  },
  createUserGroup: (userGroupData: any): Promise<any> => api.post('/admin/user-groups', userGroupData).then(res => res.data),
  updateUserGroup: (id: string, userGroupData: any): Promise<any> => api.put(`/admin/user-groups/${id}`, userGroupData).then(res => res.data),
  deleteUserGroup: (id: string): Promise<any> => api.delete(`/admin/user-groups/${id}`).then(res => res.data),
  getUserGroup: (id: string): Promise<any> => api.get(`/admin/user-groups/${id}`).then(res => res.data),
  getActiveUsers: (): Promise<any> => api.get('/admin/user-groups/users/active').then(res => res.data),

  // Clients API
  getClients: (params?: any): Promise<any> => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/admin/clients${queryString}`).then(res => res.data)
  },
  createClient: (clientData: any): Promise<any> => api.post('/admin/clients', clientData).then(res => res.data),
  updateClient: (id: string, clientData: any): Promise<any> => api.put(`/admin/clients/${id}`, clientData).then(res => res.data),
  deleteClient: (id: string): Promise<any> => api.delete(`/admin/clients/${id}`).then(res => res.data),
  getClient: (id: string): Promise<any> => api.get(`/admin/clients/${id}`).then(res => res.data),
  getAccountManagers: (): Promise<any> => api.get('/admin/clients/account-managers').then(res => res.data)
}

export const clientApi = {
  getClients: (params?: any): Promise<any> => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/admin/clients${queryString}`).then(res => res.data)
  },
  createClient: (clientData: any): Promise<any> => api.post('/admin/clients', clientData).then(res => res.data),
  updateClient: (id: string, clientData: any): Promise<any> => api.put(`/admin/clients/${id}`, clientData).then(res => res.data),
  deleteClient: (id: string): Promise<any> => api.delete(`/admin/clients/${id}`).then(res => res.data),
  getClient: (id: string): Promise<any> => api.get(`/admin/clients/${id}`).then(res => res.data),
  getAccountManagers: (): Promise<any> => api.get('/admin/clients/account-managers').then(res => res.data),
  
  // Client Persons API
  getClientPersons: (clientId: string): Promise<any> => api.get(`/admin/clients/${clientId}/persons`).then(res => res.data),
  createClientPerson: (clientId: string, personData: any): Promise<any> => api.post(`/admin/clients/${clientId}/persons`, personData).then(res => res.data),
  updateClientPerson: (clientId: string, personId: string, personData: any): Promise<any> => api.put(`/admin/clients/${clientId}/persons/${personId}`, personData).then(res => res.data),
  deleteClientPerson: (clientId: string, personId: string): Promise<any> => api.delete(`/admin/clients/${clientId}/persons/${personId}`).then(res => res.data),
  resendInvitation: (clientId: string, personId: string): Promise<any> => api.post(`/admin/clients/${clientId}/persons/${personId}/resend-invitation`).then(res => res.data),
  
  // Sub-Clients API
  getSubClients: (clientId: string): Promise<any> => api.get(`/admin/clients/${clientId}/sub-clients`).then(res => res.data),
  createSubClient: (clientId: string, subClientData: any): Promise<any> => api.post(`/admin/clients/${clientId}/sub-clients`, subClientData).then(res => res.data),
  updateSubClient: (clientId: string, subClientId: string, subClientData: any): Promise<any> => api.put(`/admin/clients/${clientId}/sub-clients/${subClientId}`, subClientData).then(res => res.data),
  deleteSubClient: (clientId: string, subClientId: string): Promise<any> => api.delete(`/admin/clients/${clientId}/sub-clients/${subClientId}`).then(res => res.data)
}

export const projectTypeApi = {
  // Project Types API
  getProjectTypes: (): Promise<any> => api.get('/admin/project-types').then(res => res.data),
  createProjectType: (projectTypeData: any): Promise<any> => api.post('/admin/project-types', projectTypeData).then(res => res.data),
  updateProjectType: (projectTypeId: string, projectTypeData: any): Promise<any> => api.put(`/admin/project-types/${projectTypeId}`, projectTypeData).then(res => res.data),
  deleteProjectType: (projectTypeId: string): Promise<any> => api.delete(`/admin/project-types/${projectTypeId}`).then(res => res.data)
}

// Project Status API
export const projectStatusApi = {
  getProjectStatuses: (params?: any): Promise<any> => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/admin/project-statuses${queryString}`).then(res => res.data)
  },
  createProjectStatus: (statusData: any): Promise<any> => api.post('/admin/project-statuses', statusData).then(res => res.data),
  updateProjectStatus: (id: string, statusData: any): Promise<any> => api.put(`/admin/project-statuses/${id}`, statusData).then(res => res.data),
  deleteProjectStatus: (id: string): Promise<any> => api.delete(`/admin/project-statuses/${id}`).then(res => res.data),
  getProjectStatus: (id: string): Promise<any> => api.get(`/admin/project-statuses/${id}`).then(res => res.data),
  getGroupedByCategory: (): Promise<any> => api.get('/admin/project-statuses/grouped-by-category').then(res => res.data),
  getCategoryOptions: (): Promise<any> => api.get('/admin/project-statuses/category-options').then(res => res.data)
}

// Task Status API
export const taskStatusApi = {
  getTaskStatuses: (params?: any): Promise<any> => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/admin/task-statuses${queryString}`).then(res => res.data)
  },
  createTaskStatus: (statusData: any): Promise<any> => api.post('/admin/task-statuses', statusData).then(res => res.data),
  updateTaskStatus: (id: string, statusData: any): Promise<any> => api.put(`/admin/task-statuses/${id}`, statusData).then(res => res.data),
  deleteTaskStatus: (id: string): Promise<any> => api.delete(`/admin/task-statuses/${id}`).then(res => res.data),
  getTaskStatus: (id: string): Promise<any> => api.get(`/admin/task-statuses/${id}`).then(res => res.data),
  getGroupedByCategory: (): Promise<any> => api.get('/admin/task-statuses/grouped-by-category').then(res => res.data),
  getCategoryOptions: (): Promise<any> => api.get('/admin/task-statuses/category-options').then(res => res.data)
}

// Client password setup API (public endpoint)
export const clientSetupApi = {
  setupPassword: (data: { token: string; password: string; password_confirmation: string }): Promise<any> => 
    api.post('/client/setup-password', data).then(res => res.data)
}

export default api
