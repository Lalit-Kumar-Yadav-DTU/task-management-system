import { cn } from '@/lib/utils';
import { TaskStatus } from '@/types';

interface BadgeProps {
  status: TaskStatus;
}

const statusStyles = {
  [TaskStatus.TODO]: 'bg-slate-100 text-slate-700 border-slate-200',
  [TaskStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TaskStatus.DONE]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const Badge = ({ status }: BadgeProps) => {
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
      statusStyles[status]
    )}>
      {status.replace('_', ' ')}
    </span>
  );
};