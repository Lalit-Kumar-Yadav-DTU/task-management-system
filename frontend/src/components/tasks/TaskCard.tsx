'use client';

import { Task, TaskStatus } from '@/types';
import { Badge } from '../ui/Badge';
import { formatDate, cn } from '@/lib/utils';
import { CheckCircle2, Circle, Trash2, Pencil, Calendar } from 'lucide-react'; // Added Pencil

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void; 
}

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  const isDone = task.status === TaskStatus.DONE;

  return (
    <div className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button 
            onClick={() => onToggle(task.id)}
            className={cn(
              "mt-1 transition-colors",
              isDone ? "text-emerald-500" : "text-slate-300 hover:text-indigo-500"
            )}
          >
            {isDone ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
          </button>
          
          <div>
            <h3 className={cn(
              "font-semibold text-slate-900 transition-all",
              isDone && "line-through text-slate-400"
            )}>
              {task.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {task.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Edit Task"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <Badge status={task.status} />
        <div className="flex items-center text-xs text-slate-400">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(task.createdAt)}
        </div>
      </div>
    </div>
  );
};