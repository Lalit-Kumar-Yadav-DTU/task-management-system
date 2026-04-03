import { Request, Response } from 'express';
import * as taskService from '../services/task.service.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator.js';

export const create = async (req: Request, res: Response) => {
  const validation = createTaskSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ error: validation.error.issues[0].message });
  try {
    const task = await taskService.createTask(req.user!.id, validation.data);
    res.status(201).json({ success: true, data: task });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const search = req.query.search as string;
    const status = req.query.status as any;

    const result = await taskService.getTasks(req.user!.id, { page, limit, search, status });
    res.status(200).json({ success: true, ...result });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};

export const update = async (req: Request, res: Response) => {
  const validation = updateTaskSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ error: validation.error.issues[0].message });
  try {
    const task = await taskService.updateTask(parseInt(req.params.id), req.user!.id, validation.data);
    res.status(200).json({ success: true, data: task });
  } catch (error) { res.status(404).json({ error: "Unauthorized" }); }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await taskService.deleteTask(parseInt(req.params.id), req.user!.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) { res.status(404).json({ error: "Unauthorized" }); }
};




















// import { Request, Response } from 'express';
// import * as taskService from '../services/task.service.js';
// import { createTaskSchema, updateTaskSchema } from '../validators/task.validator.js';

// export const create = async (req: Request, res: Response) => {
//   const validation = createTaskSchema.safeParse(req.body);
//   if (!validation.success) {
//     return res.status(400).json({ error: validation.error.issues[0].message });
//   }

//   try {
//     const task = await taskService.createTask(req.user!.id, validation.data);
//     res.status(201).json({ success: true, data: task });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAll = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const search = req.query.search as string;
//     const status = req.query.status as any;

//     const result = await taskService.getTasks(req.user!.id, { page, limit, search, status });
//     res.status(200).json({ success: true, ...result });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const update = async (req: Request, res: Response) => {
//   const taskId = parseInt(req.params.id);
//   const validation = updateTaskSchema.safeParse(req.body);
  
//   if (!validation.success) {
//     return res.status(400).json({ error: validation.error.issues[0].message });
//   }

//   try {
//     const task = await taskService.updateTask(taskId, req.user!.id, validation.data);
//     res.status(200).json({ success: true, data: task });
//   } catch (error: any) {
//     res.status(404).json({ error: "Task not found or unauthorized" });
//   }
// };

// export const remove = async (req: Request, res: Response) => {
//   try {
//     await taskService.deleteTask(parseInt(req.params.id), req.user!.id);
//     res.status(200).json({ success: true, message: "Task deleted" });
//   } catch (error: any) {
//     res.status(404).json({ error: "Task not found or unauthorized" });
//   }
// };