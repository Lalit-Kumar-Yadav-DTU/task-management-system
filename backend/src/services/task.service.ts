import prisma from '../config/db.js';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator.js';

export const createTask = async (userId: number, data: CreateTaskInput) => {
  return prisma.task.create({
    data: { ...data, userId },
  });
};

export const getTasks = async (
  userId: number,
  params: { page: number; limit: number; search?: string; status?: 'TODO' | 'DONE' }
) => {
  const { page, limit, search, status } = params;
  const skip = (page - 1) * limit;

  const where: any = { userId };
  if (search) where.title = { contains: search };
  if (status) where.status = status;

  // We fetch: 1. Paginated Tasks, 2. Filtered Count, 3. Global Stats
  const [tasks, totalCount, globalStats] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where }),
    // Fetch global stats for the user regardless of filters
    prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    }),
  ]);

  // Format globalStats array into a clean object
  const stats = {
    total: globalStats.reduce((acc, curr) => acc + curr._count, 0),
    completed: globalStats.find((s) => s.status === 'DONE')?._count || 0,
    pending: globalStats.find((s) => s.status === 'TODO')?._count || 0,
  };

  const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return {
    tasks,
    pagination: {
      totalTasks: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
    stats: { ...stats, percentage },
  };
};

export const updateTask = async (taskId: number, userId: number, data: UpdateTaskInput) => {
  return prisma.task.update({
    where: { id: taskId, userId },
    data,
  });
};

export const deleteTask = async (taskId: number, userId: number) => {
  return prisma.task.delete({
    where: { id: taskId, userId },
  });
};
















// import prisma from '../config/db.js';
// import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator.js';

// export const createTask = async (userId: number, data: CreateTaskInput) => {
//   return prisma.task.create({
//     data: {
//       ...data,
//       userId,
//     },
//   });
// };

// export const getTasks = async (
//   userId: number,
//   params: { page: number; limit: number; search?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE' }
// ) => {
//   const { page, limit, search, status } = params;
//   const skip = (page - 1) * limit;

//   // Build the dynamic filter
//   const where: any = { userId };

//   if (search) {
//     where.title = { contains: search }; 
//   }

//   if (status) {
//     where.status = status;
//   }

//   // Fetching data and count in parallel is a "Senior" performance move
//   const [tasks, totalCount] = await Promise.all([
//     prisma.task.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//     }),
//     prisma.task.count({ where }),
//   ]);

//   return {
//     tasks,
//     pagination: {
//       totalTasks: totalCount,
//       totalPages: Math.ceil(totalCount / limit),
//       currentPage: page,
//       hasNextPage: skip + tasks.length < totalCount,
//     },
//   };
// };

// export const updateTask = async (taskId: number, userId: number, data: UpdateTaskInput) => {
//   // We include userId in the 'where' to ensure users can't edit other people's tasks
//   return prisma.task.update({
//     where: { id: taskId, userId },
//     data,
//   });
// };

// export const deleteTask = async (taskId: number, userId: number) => {
//   return prisma.task.delete({
//     where: { id: taskId, userId },
//   });
// };