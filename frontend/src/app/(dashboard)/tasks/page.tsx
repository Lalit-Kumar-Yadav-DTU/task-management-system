'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/task.service';
import { Task } from '@/types';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskModal } from '@/components/tasks/TaskModal'; 
import { useAuth } from '@/components/shared/AuthProvider';
import { 
  Plus, Loader2, ClipboardList, ChevronLeft, ChevronRight,
  ListChecks, CheckCircle2, Clock, Percent 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TasksPage() {
  const router = useRouter();
  
  // 1. Auth Context - Accessing reactive token, loading state, and user data
  const { isLoading, token, user } = useAuth(); 

  // 2. Data States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentage: 0 });
  const [fetchingTasks, setFetchingTasks] = useState(true);
  
  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // 4. Filter & Pagination States
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 5. Auth Guard: Redirect if session check finishes and no token is found
  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [isLoading, token, router]);

  // 6. API Fetch Logic
  const fetchTasks = useCallback(async () => {
    if (!token) return; 
    setFetchingTasks(true);
    try {
      const data = await taskService.getTasks({ 
        page, 
        limit: 9, 
        status, 
        search: debouncedSearch 
      });
      setTasks(data.tasks);
      setTotalPages(data.pagination.totalPages);
      setStats(data.stats); // Global stats from backend
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setFetchingTasks(false);
    }
  }, [page, status, debouncedSearch, token]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [fetchTasks, token]);

  // 7. Handler Functions
  const handleAddNewTrigger = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTrigger = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      // Logic restricted to TODO <-> DONE for now
      const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
      await taskService.updateTask(task.id, { status: newStatus as any });
      fetchTasks();
      toast.success(newStatus === 'DONE' ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      fetchTasks();
      toast.success('Task removed');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // 8. Visual Guard: Show spinner while verifying session on refresh
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium tracking-tight">Restoring session...</p>
      </div>
    );
  }

  // Prevent UI flash if not authorized
  if (!token) return null;

  // Extract First Name for the greeting
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'there';

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      {/* Task Creation/Editing Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTasks} 
        taskToEdit={editingTask} 
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, {firstName}!
          </h1>
          <p className="text-slate-500 mt-1">Here is an overview of your productivity.</p>
        </div>
        <button 
          onClick={handleAddNewTrigger}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          New Task
        </button>
      </div>

      {/* STATS OVERVIEW SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<ListChecks className="text-indigo-600" />} 
          label="Total" 
          value={stats.total} 
          color="bg-indigo-50" 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          label="Completed" 
          value={stats.completed} 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<Clock className="text-amber-600" />} 
          label="Pending" 
          value={stats.pending} 
          color="bg-amber-50" 
        />
        <StatCard 
          icon={<Percent className="text-blue-600" />} 
          label="Progress" 
          value={`${stats.percentage}%`} 
          color="bg-blue-50" 
          isProgress 
          percentage={stats.percentage} 
        />
      </div>

      {/* Search and Filters */}
      <TaskFilters 
        onSearchChange={(v) => { setSearch(v); setPage(1); }} 
        onStatusChange={(v) => { setStatus(v); setPage(1); }} 
      />

      {/* Tasks Grid Section */}
      {fetchingTasks ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin h-10 w-10 mx-auto text-indigo-600" />
          <p className="mt-4 text-slate-400 text-sm">Updating your workspace...</p>
        </div>
      ) : tasks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={() => handleToggleStatus(task)} 
                onDelete={handleDelete} 
                onEdit={handleEditTrigger} 
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)} 
                className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-20 transition-all shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-bold text-slate-600 text-sm">
                Page {page} of {totalPages}
              </span>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)} 
                className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-20 transition-all shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
          <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Workspace Empty</h3>
          <p className="text-slate-500 mt-2">Time to get some work done. Create your first task!</p>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable StatCard Component
 */
function StatCard({ icon, label, value, color, isProgress, percentage }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={`p-3 ${color} rounded-xl`}>{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-slate-900">{value}</h3>
          {isProgress && (
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-blue-500 transition-all duration-700 ease-out" 
                style={{ width: `${percentage}%` }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}