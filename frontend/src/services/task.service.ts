import api from '@/lib/axios';
import { Task, PaginatedTasks } from '@/types';

export const taskService = {
  getTasks: async (params: any): Promise<PaginatedTasks> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  createTask: async (data: Partial<Task>) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    return this.updateTask(id, { status: newStatus as any });
  }
};























// import api from '@/lib/axios';
// import { Task, TaskStatus, PaginatedTasks } from '@/types';

// export const taskService = {
//   // GET /tasks with search, status filter, and pagination
//   getTasks: async (params: { 
//     page?: number; 
//     limit?: number; 
//     status?: string; 
//     search?: string 
//   }): Promise<PaginatedTasks> => {
//     const response = await api.get('/tasks', { params });
//     return response.data;
//   },

//   createTask: async (data: Partial<Task>): Promise<Task> => {
//     const response = await api.post('/tasks', data);
//     return response.data;
//   },

//   updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
//     const response = await api.patch(`/tasks/${id}`, data);
//     return response.data;
//   },

//   deleteTask: async (id: string): Promise<void> => {
//     await api.delete(`/tasks/${id}`);
//   },

//   // The specific requirement: toggle status
//   // src/services/task.service.ts
// async toggleTask(id: string, currentStatus: string) {
//   const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
//   const response = await api.patch(`/tasks/${id}`, { status: newStatus });
//   return response.data;
// }
// };