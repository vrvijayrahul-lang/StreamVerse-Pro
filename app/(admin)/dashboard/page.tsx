'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Film, Users, Settings, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import MoviesSection from '@/components/admin/MoviesSection';
import UsersSection from '@/components/admin/UsersSection';

type TabType = 'analytics' | 'movies' | 'users' | 'reviews' | 'banners';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'movies', label: 'Movies', icon: <Film size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'reviews', label: 'Reviews', icon: <Bell size={20} /> },
    { id: 'banners', label: 'Banners', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">StreamVerse Admin</h1>
                <p className="text-sm text-gray-400">Management Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-400">Welcome,</p>
                <p className="text-white font-semibold">{currentUser?.displayName || 'Admin'}</p>
              </div>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="sticky top-16 z-30 bg-slate-800/50 backdrop-blur-xl border-b border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'analytics' && <AnalyticsSection />}
          {activeTab === 'movies' && <MoviesSection />}
          {activeTab === 'users' && <UsersSection />}

          {/* Reviews Section */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <motion.div
                className="bg-slate-800/50 border border-white/10 rounded-lg p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Reviews & Comments Moderation</h2>
                <p className="text-gray-400 mb-6">Manage user reviews and comments on content</p>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-gray-300 mb-2">No pending reviews for moderation</p>
                    <p className="text-sm text-gray-500">New reviews will appear here</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Banners Section */}
          {activeTab === 'banners' && (
            <div className="space-y-8">
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Homepage Banners</h2>
                  <p className="text-gray-400">Manage featured banners and promotions</p>
                </div>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Banner
                </motion.button>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {[1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-slate-800/50 border border-white/10 rounded-lg overflow-hidden hover:border-blue-500/50 transition-colors group cursor-pointer"
                    whileHover={{ y: -5 }}
                  >
                    <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">Banner Image #{i}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="text-lg font-semibold text-white">Featured Banner {i}</h3>
                      <div className="flex gap-2">
                        <motion.button
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl py-6 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2024 StreamVerse Admin Panel. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/auth/login" className="hover:text-white transition-colors">
                Main Site
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Settings
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
