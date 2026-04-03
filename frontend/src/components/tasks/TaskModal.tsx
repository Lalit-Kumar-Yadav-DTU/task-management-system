'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { taskService } from '@/services/task.service';
import { toast } from 'react-hot-toast';
import { Task } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit?: Task | null; // Optional: if present, we are editing
}

export const TaskModal = ({ isOpen, onClose, onSuccess, taskToEdit }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Sync form data when taskToEdit changes
  useEffect(() => {
    if (taskToEdit) {
      setFormData({ 
        title: taskToEdit.title, 
        description: taskToEdit.description || '' 
      });
    } else {
      setFormData({ title: '', description: '' });
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (taskToEdit) {
        // CALL UPDATE API
        await taskService.updateTask(taskToEdit.id, formData);
        toast.success('Task updated!');
      } else {
        // CALL CREATE API
        await taskService.createTask(formData);
        toast.success('Task created!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Task Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.title}
            className="w-full bg-indigo-600 text-white py-3 font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (taskToEdit ? 'Save Changes' : 'Create Task')}
          </button>
        </form>
      </div>
    </div>
  );
};