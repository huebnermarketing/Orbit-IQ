export const userApi = {
  getUsers: (params?: any) => useApiFetch('/admin/users', { query: params }),
  createUser: (data: any) => useApiFetch('/admin/users', { method: 'POST', body: data }),
  updateUser: (id: number, data: any) =>
    useApiFetch(`/admin/users/${id}`, { method: 'PUT', body: data }),
  deleteUser: (id: number) => useApiFetch(`/admin/users/${id}`, { method: 'DELETE' }),
  resetUserPassword: (id: number, data: any) =>
    useApiFetch(`/admin/users/${id}/reset-password`, { method: 'POST', body: data }),

  uploadAvatar: (formData: FormData) =>
    useApiFetch('/admin/users/upload-avatar', { method: 'POST', body: formData }),
  getActiveUsers: () => useApiFetch('/users/active'),
  updateUserGroup: (id: number, data: any) =>
    useApiFetch(`/admin/user-groups/${id}`, { method: 'PUT', body: data }),
  createUserGroup: (data: any) => useApiFetch(`/admin/user-groups`, { method: 'POST', body: data }),
  getAMUsers: () => useApiFetch('/admin/users/am-users'),
  getPMUsers: () => useApiFetch('/admin/users/pm-users'),
};
