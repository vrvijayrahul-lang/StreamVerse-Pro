'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuthActions } from '@/hooks/useAuthActions';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { forgotPassword } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
        {/* Back Button */}
        <Link href="/auth/login">
          <motion.button
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft size={18} />
            Back to Login
          </motion.button>
        </Link>

        {submitted ? (
          <>
            {/* Success State */}
            <div className="text-center">
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto bg-green-600/20 rounded-full flex items-center justify-center">
                  <Mail className="text-green-400" size={32} />
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to<br />
                <span className="text-white font-semibold">{email}</span>
              </p>

              <p className="text-gray-400 text-sm mb-6">
                Click the link in your email to reset your password. The link will expire in 24 hours.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Form State */}
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-400 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
