export interface User { id: string; fullName: string; email: string; }

export enum TaskStatus { TODO = 'TODO', DONE = 'DONE' }

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: { totalTasks: number; totalPages: number; currentPage: number; };
  stats: {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  };
}















// export interface User {
//   id: string;
//   fullName: string;
//   email: string;
// }

// export enum TaskStatus {
//   TODO = 'TODO',
//   IN_PROGRESS = 'IN_PROGRESS',
//   DONE = 'DONE',
// }

// export interface Task {
//   id: string;
//   title: string;
//   description?: string;
//   status: TaskStatus;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface AuthResponse {
//   user: User;
//   accessToken: string;
// }

// // For the paginated GET /tasks response
// export interface PaginatedTasks {
//   tasks: Task[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }