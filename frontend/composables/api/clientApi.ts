export const clientApi = {
  getClients: (params?: any) => useApiFetch('/admin/clients', { query: params }),
  createClient: (data: any) => useApiFetch('/admin/clients', { method: 'POST', body: data }),
  updateClient: (id: string, data: any) =>
    useApiFetch(`/admin/clients/${id}`, { method: 'PUT', body: data }),
  deleteClient: (id: string) => useApiFetch(`/admin/clients/${id}`, { method: 'DELETE' }),
  getClient: (id: string) => useApiFetch(`/admin/clients/${id}`),
  getAccountManagers: () => useApiFetch('/admin/clients/account-managers'),

  getClientPersons: (clientId: string) => useApiFetch(`/admin/clients/${clientId}/persons`),
  createClientPerson: (clientId: string, data: any) =>
    useApiFetch(`/admin/clients/${clientId}/persons`, { method: 'POST', body: data }),
  updateClientPerson: (clientId: string, personId: string, data: any) =>
    useApiFetch(`/admin/clients/${clientId}/persons/${personId}`, { method: 'PUT', body: data }),
  deleteClientPerson: (clientId: string, personId: string) =>
    useApiFetch(`/admin/clients/${clientId}/persons/${personId}`, { method: 'DELETE' }),
  resendInvitation: (clientId: string, personId: string) =>
    useApiFetch(`/admin/clients/${clientId}/persons/${personId}/resend-invitation`, {
      method: 'POST',
    }),
  getSubClients: (clientId: string) => useApiFetch(`/admin/clients/${clientId}/sub-clients`),
  updateSubClient: (clientId: string, subClientId: string, data: any) =>
    useApiFetch(`/admin/clients/${clientId}/sub-clients/${subClientId}`, {
      method: 'PUT',
      body: data,
    }),
  createSubClient: (clientId: string, data: any) =>
    useApiFetch(`/admin/clients/${clientId}/sub-clients`, { method: 'POST', body: data }),
  deleteSubClient: (clientId: string, subClientId: string) =>
    useApiFetch(`/admin/clients/${clientId}/sub-clients/${subClientId}`, { method: 'DELETE' }),
};
