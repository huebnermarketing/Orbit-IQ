export const teamsApi = {
  getTeams: () => useApiFetch('/admin/teams'),
  getTeam: (id: number) => useApiFetch(`/admin/teams/${id}`),
  createTeam: (data: any) => useApiFetch('/admin/teams', { method: 'POST', body: data }),
  updateTeam: (id: number, data: any) => useApiFetch(`/admin/teams/${id}`, { method: 'PUT', body: data }),
  deleteTeam: (id: number) => useApiFetch(`/admin/teams/${id}`, { method: 'DELETE' }),
};

