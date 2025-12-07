import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/UI';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@streetjunkies.in' && password === 'admin') {
        localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
        toast.success('Welcome back, Admin.');
        navigate('/admin/dashboard');
      } else if (email === 'sales@streetjunkies.in') {
        localStorage.setItem('user', JSON.stringify({ email, role: 'sales' }));
        toast.success('Ready to sell.');
        navigate('/scan');
      } else {
        toast.error('Invalid credentials. (Hint: admin@streetjunkies.in / admin)');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] dark:bg-zinc-950 p-4 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-zinc-900 opacity-40 dark:opacity-10 z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8 z-10 relative animate-slide-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 dark:bg-zinc-50 rounded-xl shadow-lg shadow-zinc-900/20 mb-6">
            <span className="text-white dark:text-zinc-900 font-bold text-lg">SJ</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Enter your credentials to access the console.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="name@streetjunkies.in"
            icon={Mail}
            required
            className="bg-zinc-50 dark:bg-zinc-950"
          />
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <a href="#" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">Forgot?</a>
            </div>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              icon={Lock}
              required
              className="bg-zinc-50 dark:bg-zinc-950"
            />
          </div>
          
          <Button type="submit" variant="primary" className="w-full py-3 mt-2 shadow-lg shadow-zinc-900/10 dark:shadow-none" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Protected by <span className="font-semibold text-zinc-600 dark:text-zinc-400">Street Junkies Security</span>
          </p>
        </div>
      </div>
    </div>
  );
};