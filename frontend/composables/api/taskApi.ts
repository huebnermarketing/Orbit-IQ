export const taskApi = {
  getTasks: (params?: any) => useApiFetch('/tasks', { query: params }),
  createTask: (data: any) => useApiFetch('/tasks', { method: 'POST', body: data }),
  updateTask: (id: string, data: any) => useApiFetch(`/tasks/${id}`, { method: 'PUT', body: data }),
  deleteTask: (id: string) => useApiFetch(`/tasks/${id}`, { method: 'DELETE' }),
  getTask: (id: string) => useApiFetch(`/tasks/${id}`),
  updateTaskStatus: (id: string, data: any) =>
    useApiFetch(`/api/task-statuses/${id}`, { method: 'PUT', body: data }),
  createTaskStatus: (data: any) =>
    useApiFetch(`/api/task-statuses`, { method: 'POST', body: data }),
};
