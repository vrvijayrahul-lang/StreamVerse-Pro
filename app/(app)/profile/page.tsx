'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, LogOut } from 'lucide-react';
import { useAuthActions } from '@/hooks/useAuthActions';
import Image from 'next/image';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <main className="bg-black text-white min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              Back
            </motion.button>
          </Link>

          <h1 className="text-4xl font-bold">My Profile</h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar & Name */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600">
              {currentUser.photoURL ? (
                <Image
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {currentUser.displayName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
              <p className="text-gray-400">{currentUser.email}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {currentUser.role.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-white/10">
            <div>
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-white">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Email Status</p>
              <p className="text-white">
                {currentUser.verified ? (
                  <span className="text-green-400">✓ Verified</span>
                ) : (
                  <span className="text-yellow-400">⚠ Unverified</span>
                )}
              </p>
            </div>

            {currentUser.subscription && (
              <>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Subscription</p>
                  <p className="text-white capitalize">{currentUser.subscription.plan}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <p className={currentUser.subscription.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                    {currentUser.subscription.status.toUpperCase()}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Preferences Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Theme</p>
                <p className="text-white capitalize">{currentUser.preferences?.theme || 'Dark'}</p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Language</p>
                <p className="text-white">{currentUser.preferences?.language || 'English'}</p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Video Quality</p>
                <p className="text-white uppercase">
                  {currentUser.preferences?.qualityPreference || 'Auto'}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Auto Play</p>
                <p className="text-white">
                  {currentUser.preferences?.autoPlay ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/preferences">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 size={18} />
                Edit Profile
              </motion.button>
            </Link>

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Subscription Section */}
        {currentUser.subscription && (
          <motion.div
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/50 rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">Subscription Details</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Start Date</p>
                <p className="text-white">
                  {new Date(currentUser.subscription.startDate).toLocaleDateString()}
                </p>
              </div>

              {currentUser.subscription.endDate && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">End Date</p>
                  <p className="text-white">
                    {new Date(currentUser.subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm mb-1">Auto Renewal</p>
                <p className="text-white">
                  {currentUser.subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            <Link href="/subscription">
              <motion.button
                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage Subscription
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
