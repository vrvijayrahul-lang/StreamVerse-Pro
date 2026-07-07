'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Shield, Zap, Mail } from 'lucide-react';
import { User } from '@/types';

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      email: 'user1@example.com',
      displayName: 'John Doe',
      photoURL: 'https://via.placeholder.com/40x40',
      role: 'user',
      subscription: {
        plan: 'premium',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        autoRenew: true,
        status: 'active',
      },
      createdAt: new Date('2024-01-01'),
      preferences: {
        theme: 'dark',
        language: 'en',
        autoPlay: true,
        playbackQuality: '1080p',
        playbackSpeed: 1,
        notificationsEnabled: true,
      },
    },
    {
      id: 'user-2',
      email: 'user2@example.com',
      displayName: 'Jane Smith',
      photoURL: 'https://via.placeholder.com/40x40',
      role: 'user',
      subscription: {
        plan: 'free',
        startDate: new Date('2024-06-15'),
        endDate: null,
        autoRenew: false,
        status: 'active',
      },
      createdAt: new Date('2024-06-15'),
      preferences: {
        theme: 'dark',
        language: 'en',
        autoPlay: false,
        playbackQuality: '720p',
        playbackSpeed: 1,
        notificationsEnabled: false,
      },
    },
  ]);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const handleChangeRole = (userId: string, newRole: string) => {
    if (newRole === 'admin' && !confirm('Are you sure? This will grant admin access.')) {
      return;
    }
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, role: newRole as any } : u
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const filteredUsers =
    selectedRole === 'all' ? users : users.filter((u) => u.role === selectedRole);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Users Management</h2>
          <p className="text-gray-400">Manage users and their roles</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {['all', 'user', 'premium', 'admin'].map((role) => (
          <motion.button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRole === role
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Users Table */}
      <motion.div
        className="bg-slate-800/50 border border-white/10 rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/50">
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">User</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Subscription</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Joined</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-slate-700/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || 'https://via.placeholder.com/40x40'}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="text-white font-medium">{user.displayName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      className="px-3 py-1 bg-slate-700 border border-white/10 rounded text-sm font-medium text-gray-300 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500"
                    >
                      <option value="guest">Guest</option>
                      <option value="user">User</option>
                      <option value="premium">Premium</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-yellow-400" />
                      <span className="text-gray-300 capitalize">
                        {user.subscription?.plan || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <motion.button
                        className="p-2 hover:bg-slate-600 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Mail size={18} className="text-blue-400" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-slate-600 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Total Users</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Premium Users</p>
          <p className="text-3xl font-bold text-purple-400">
            {users.filter((u) => u.subscription?.plan === 'premium').length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Admins</p>
          <p className="text-3xl font-bold text-blue-400">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
