export const organizationApi = {
  getOrganizationRoles: (params?: any) =>
    useApiFetch('/admin/organization-roles', { query: params }),
  createOrganizationRole: (data: any) =>
    useApiFetch('/admin/organization-roles', { method: 'POST', body: data }),
  updateOrganizationRole: (id: string, data: any) =>
    useApiFetch(`/admin/organization-roles/${id}`, { method: 'PUT', body: data }),
  deleteOrganizationRole: (id: string) =>
    useApiFetch(`/admin/organization-roles/${id}`, { method: 'DELETE' }),
  getOrganization: (id: string) => useApiFetch(`/admin/organization-roles/${id}`),
  getOrgProfile: (params?: any) => useApiFetch('/admin/organization/profile', { query: params }),
  updateOrgProfile: (data: any) =>
    useApiFetch(`/admin/organization/profile`, { method: 'PUT', body: data }),
  updateOrgLogo: (data: any) =>
    useApiFetch(`/admin/organization/logo`, { method: 'POST', body: data }),
};
