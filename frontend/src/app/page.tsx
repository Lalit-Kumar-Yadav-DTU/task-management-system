'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically sends user to /login
    router.push('/login');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-indigo-600 font-medium animate-pulse">
        Redirecting...
      </div>
    </div>
  );
}