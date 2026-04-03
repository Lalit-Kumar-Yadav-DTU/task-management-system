'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/components/shared/AuthProvider'; // Added this
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { syncToken } = useAuth(); // Added this
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      
      // FIX: Capture both token and user to update global state
      syncToken(response.accessToken, response.user);
      
      toast.success('Account created! Welcome.');
      router.push('/tasks'); 
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Get Started</h2>
          <p className="mt-2 text-sm text-slate-500">Create an account to manage your tasks</p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                placeholder="Lalit Kumar Yadav"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                placeholder="name@company.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                placeholder="Confirm password"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-indigo-400"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <span className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
            )}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}







// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { authService } from '@/services/auth.service';
// import { toast, Toaster } from 'react-hot-toast';
// import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

// export default function RegisterPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Service now handles setAccessToken(token) internally in memory
//       await authService.register(formData);
//       toast.success('Account created! Welcome.');
//       router.push('/tasks'); 
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
//       <Toaster position="top-center" reverseOrder={false} />
      
//       <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
//         <div className="text-center">
//           <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
//             <UserPlus className="h-6 w-6 text-indigo-600" />
//           </div>
//           <h2 className="text-3xl font-bold text-slate-900">Get Started</h2>
//           <p className="mt-2 text-sm text-slate-500">Create an account to manage your tasks</p>
//         </div>
        
//         <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             {/* Full Name */}
//             <div className="relative group">
//               <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//               <input
//                 type="text"
//                 required
//                 className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
//                 placeholder="Lalit Kumar Yadav"
//                 onChange={(e) => setFormData({...formData, fullName: e.target.value})}
//               />
//             </div>

//             {/* Email */}
//             <div className="relative group">
//               <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//               <input
//                 type="email"
//                 required
//                 className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
//                 placeholder="name@company.com"
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//               />
//             </div>

//             {/* Password */}
//             <div className="relative group">
//               <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//               <input
//                 type="password"
//                 required
//                 className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
//                 placeholder="••••••••"
//                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//               />
//             </div>

//             {/* Confirm Password */}
//             <div className="relative group">
//               <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//               <input
//                 type="password"
//                 required
//                 className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
//                 placeholder="Confirm password"
//                 onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-indigo-400 disabled:shadow-none"
//           >
//             {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
//               <span className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
//             )}
//           </button>

//           <p className="text-center text-sm text-slate-600">
//             Already have an account?{' '}
//             <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
//               Sign in
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }