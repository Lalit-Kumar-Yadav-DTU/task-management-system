'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/components/shared/AuthProvider'; // <-- THIS WAS MISSING
import { toast, Toaster } from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { syncToken } = useAuth(); // Now this will work
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      // Update the global reactive state
      syncToken(response.accessToken); 
      
      toast.success('Successfully logged in');
      router.push('/tasks'); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      <Toaster position="top-center" />
      
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">Log in to your secure workspace</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-indigo-400"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <span className="flex items-center gap-2 font-bold"><LogIn className="h-5 w-5" /> Sign In</span>
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              New here?{' '}
              <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


  

// export default function LoginPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({ email: '', password: '' });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await authService.login(formData);
//       toast.success('Successfully logged in');
//       router.push('/tasks'); 
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Invalid credentials');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans">
//       <Toaster position="top-center" />
      
//       <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
//         <div className="text-center">
//           <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
//             <ShieldCheck className="h-6 w-6 text-indigo-600" />
//           </div>
//           <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
//           <p className="mt-2 text-sm text-slate-500">Log in to your secure workspace</p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             {/* Email */}
//             <div className="relative group">
//               <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//               <input
//                 type="email"
//                 required
//                 className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>

//             {/* Password */}
//             <div className="relative group">
//               <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//               <input
//                 type="password"
//                 required
//                 className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center py-3.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-indigo-400"
//           >
//             {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
//               <span className="flex items-center gap-2 font-bold"><LogIn className="h-5 w-5" /> Sign In</span>
//             )}
//           </button>

//           <div className="text-center space-y-2">
//             <p className="text-sm text-slate-600">
//               New here?{' '}
//               <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
//                 Create an account
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

