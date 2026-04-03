'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { 
  LayoutDashboard, 
  CheckSquare, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
    // You can add more links here later like 'Analytics' or 'Profile'
  ];

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Taskly</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
        
        {/* Sidebar Footer (User & Logout) */}
        <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-slate-200">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>

      {/* --- MOBILE OVERLAY MENU --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-slate-600 bg-opacity-75 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition transform">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-6">
                <span className="text-xl font-bold text-slate-900">Taskly</span>
              </div>
              <nav className="mt-8 px-4 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2 text-base font-medium rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="mr-4 h-6 w-6" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}