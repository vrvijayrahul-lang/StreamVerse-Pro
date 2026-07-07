'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Film, Eye, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  totalMovies: number;
  totalSeries: number;
  totalViews: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newMoviesThisMonth: number;
}

export default function AnalyticsSection() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 15420,
    premiumUsers: 3850,
    totalMovies: 2340,
    totalSeries: 480,
    totalViews: 2540000,
    totalRevenue: 125400,
    newUsersThisMonth: 1240,
    newMoviesThisMonth: 42,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch stats from Firebase
    setLoading(false);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-600 to-blue-400',
      change: `+${stats.newUsersThisMonth} this month`,
    },
    {
      title: 'Premium Users',
      value: stats.premiumUsers.toLocaleString(),
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-400',
      change: `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% conversion`,
    },
    {
      title: 'Total Content',
      value: (stats.totalMovies + stats.totalSeries).toLocaleString(),
      icon: Film,
      color: 'from-pink-600 to-pink-400',
      change: `${stats.newMoviesThisMonth} added this month`,
    },
    {
      title: 'Total Views',
      value: (stats.totalViews / 1000000).toFixed(1) + 'M',
      icon: Eye,
      color: 'from-green-600 to-green-400',
      change: '+15% from last month',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-gray-400">Real-time platform statistics and insights</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} p-[1px] rounded-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-400">{stat.change}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Top Content */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Movies</h3>
          <div className="space-y-3">
            {[
              { title: 'Movie Title 1', views: 125000 },
              { title: 'Movie Title 2', views: 98000 },
              { title: 'Movie Title 3', views: 87000 },
              { title: 'Movie Title 4', views: 76000 },
              { title: 'Movie Title 5', views: 65000 },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg"
                whileHover={{ x: 5 }}
              >
                <span className="text-gray-300">{item.title}</span>
                <span className="text-blue-400 font-semibold">{item.views.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenue Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">This Month</span>
                <span className="text-green-400 font-bold">${(stats.totalRevenue / 12).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Revenue</span>
                <span className="text-green-400 font-bold">${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400 flex items-center gap-2">
                <AlertCircle size={16} />
                Revenue up 22% compared to last month
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
