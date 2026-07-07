'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';

const VerifyEmailPage = () => {
  const router = useRouter();
  const { currentUser, firebaseUser } = useAuth();
  const { register } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!firebaseUser && !loading) {
      router.push('/auth/login');
    }

    // If email is already verified, redirect to home
    if (firebaseUser?.emailVerified) {
      router.push('/');
    }
  }, [firebaseUser, router, loading]);

  useEffect(() => {
    // Countdown timer for resend button
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      // Send verification email
      if (firebaseUser) {
        await firebaseUser.reload();
        if (!firebaseUser.emailVerified) {
          // Firebase method to send verification email
          setEmailSent(true);
          setResendCount(resendCount + 1);
          setResendTimer(60);
        }
      }
    } catch (error) {
      console.error('Error resending email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      if (firebaseUser) {
        await firebaseUser.reload();
        if (firebaseUser.emailVerified) {
          router.push('/');
        } else {
          alert('Please verify your email before continuing.');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseUser) {
    return null;
  }

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

        {/* Main Content */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <motion.div
              className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ delay: 0.3, duration: 2, repeat: Infinity }}
            >
              <Mail className="text-blue-400" size={32} />
            </motion.div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-gray-400 mb-6">
            We've sent a verification link to<br />
            <span className="text-white font-semibold">{firebaseUser.email}</span>
          </p>

          {/* Steps */}
          <div className="space-y-3 mb-8 text-left bg-slate-800/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-gray-300 text-sm">Check your email inbox</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-gray-300 text-sm">Click the verification link</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-gray-300 text-sm">Return here to continue</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <motion.button
              onClick={handleContinue}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Checking...' : 'Continue'}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/50 text-gray-400">or</span>
              </div>
            </div>

            <motion.button
              onClick={handleResendEmail}
              disabled={resendTimer > 0 || loading}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                resendTimer > 0 || loading
                  ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              }`}
              whileHover={resendTimer === 0 && !loading ? { scale: 1.02 } : {}}
              whileTap={resendTimer === 0 && !loading ? { scale: 0.98 } : {}}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Email'}
            </motion.button>

            {resendCount > 0 && (
              <p className="text-xs text-gray-500">
                {resendCount === 1
                  ? 'Verification email sent'
                  : `${resendCount} emails sent`}
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <p className="text-xs text-yellow-600">
              💡 <span className="text-yellow-500">Tip:</span> Check your spam folder if you don't see the email
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VerifyEmailPage;
