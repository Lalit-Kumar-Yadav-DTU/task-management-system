import { Request, Response } from 'express';
import * as taskService from '../services/task.service.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator.js';

export const create = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const validation = createTaskSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }

  try {
    const task = await taskService.createTask(userId, validation.data);
    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // FIX: Safely parse query parameters to strings
    const page = parseInt(String(req.query.page || '1')) || 1;
    const limit = parseInt(String(req.query.limit || '9')) || 9;
    const search = req.query.search ? String(req.query.search) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;

    const result = await taskService.getTasks(userId, { 
      page, 
      limit, 
      search, 
      status 
    });

    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const validation = updateTaskSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }

  try {
    const taskId = parseInt(req.params.id);
    const task = await taskService.updateTask(taskId, userId, validation.data);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(404).json({ error: "Task not found or unauthorized" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const taskId = parseInt(req.params.id);
    await taskService.deleteTask(taskId, userId);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(404).json({ error: "Task not found or unauthorized" });
  }
};