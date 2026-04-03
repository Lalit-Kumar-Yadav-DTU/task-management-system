'use client';

import { Search } from 'lucide-react';
import { TaskStatus } from '@/types';

interface FilterProps {
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
}

export const TaskFilters = ({ onSearchChange, onStatusChange }: FilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select 
        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value={TaskStatus.TODO}>To Do</option>
        {/* <option value={TaskStatus.IN_PROGRESS}>In Progress</option> */}
        <option value={TaskStatus.DONE}>Done</option>
      </select>
    </div>
  );
};