export const projectApi = {
  getProjects: (params?: any) => useApiFetch('/projects', { query: params }),
  createProject: (data: any) => useApiFetch('/projects', { method: 'POST', body: data }),
  updateProject: (id: string, data: any) =>
    useApiFetch(`/projects/${id}`, { method: 'PUT', body: data }),
  deleteProject: (id: string) => useApiFetch(`/projects/${id}`, { method: 'DELETE' }),
  getProject: (id: string) => useApiFetch(`/projects/${id}`),
  updateProjectStatus: (id: string, data: any) =>
    useApiFetch(`/api/project-statuses/${id}`, { method: 'PUT', body: data }),
  createProjectStatus: (data: any) =>
    useApiFetch('/admin/project-statuses', { method: 'POST', body: data }),
  deleteProjectStatus: (id: string) =>
    useApiFetch(`/admin/project-statuses/${id}`, { method: 'DELETE' }),
  updateProjectType: (id: number, data: any) =>
    useApiFetch(`/admin/project-types/${id}`, { method: 'PUT', body: data }),
  createProjectType: (data: any) =>
    useApiFetch('/admin/project-types', { method: 'POST', body: data }),
  getProjectTypes: () => useApiFetch('/admin/project-types'),
  deleteProjectType: (id: string) =>
    useApiFetch(`/admin/project-types/${id}`, { method: 'DELETE' }),
};
