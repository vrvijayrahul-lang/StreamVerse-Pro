'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Github, Eye, EyeOff } from 'lucide-react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, signInWithGoogle, signInWithGithub, error } = useAuthActions();
  const { currentUser } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser && !currentUser.email?.includes('@')) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      router.push('/');
    } catch (err) {
      setLocalError(error || (err instanceof Error ? err.message : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      await signInWithGoogle();
      router.push('/');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      await signInWithGithub();
      router.push('/');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'GitHub login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Card */}
      <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
            StreamVerse
          </h1>
          <p className="text-gray-400">Welcome back</p>
        </div>

        {/* Error Message */}
        {localError && (
          <motion.div
            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {localError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-400 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Google
          </motion.button>

          <motion.button
            type="button"
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github size={16} />
            GitHub
          </motion.button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
