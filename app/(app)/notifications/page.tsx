'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Trash2,
  CheckCircle,
  AlertCircle,
  Gift,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: string;
  type: 'new_release' | 'watchlist_available' | 'episode_available' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'new_release',
      title: '🎬 New Release',
      message: 'Inception is now available to stream',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actionUrl: '/movie/inception',
    },
    {
      id: '2',
      type: 'watchlist_available',
      title: '📋 Watchlist Item Available',
      message: 'The Dark Knight is now available on StreamVerse',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      actionUrl: '/movie/dark-knight',
    },
    {
      id: '3',
      type: 'episode_available',
      title: '📺 New Episode',
      message: 'Breaking Bad Season 5 Episode 10 is available',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      actionUrl: '/watch/breaking-bad-s5e10',
    },
    {
      id: '4',
      type: 'system',
      title: '⭐ Special Offer',
      message: 'Get 30% off on annual premium subscription',
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
    }
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_release':
        return <Sparkles className="text-yellow-400" size={20} />;
      case 'watchlist_available':
        return <Gift className="text-purple-400" size={20} />;
      case 'episode_available':
        return <AlertCircle className="text-blue-400" size={20} />;
      case 'system':
        return <Bell className="text-green-400" size={20} />;
      default:
        return <Bell className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? 's' : ''}
            </p>
          </div>

          {unreadCount > 0 && (
            <motion.button
              onClick={markAllAsRead}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mark All as Read
            </motion.button>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {['all', 'unread'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setFilter(tab as 'all' | 'unread')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'unread' && unreadCount > 0 && (
                <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          ))}

          {notifications.length > 0 && (
            <motion.button
              onClick={clearAll}
              className="ml-auto px-4 py-2 text-red-400 hover:text-red-300 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Clear All
            </motion.button>
          )}
        </motion.div>

        {/* Notifications List */}
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification, idx) => (
                <motion.div
                  key={notification.id}
                  className={`group p-6 rounded-lg border transition-all cursor-pointer ${
                    notification.read
                      ? 'bg-slate-800/30 border-white/5 hover:border-white/10'
                      : 'bg-blue-600/10 border-blue-500/30 hover:border-blue-500/50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  {/* Content */}
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Text Content */}
                    <div
                      className="flex-1"
                      onClick={() => {
                        if (!notification.read) markAsRead(notification.id);
                        if (notification.actionUrl) {
                          // Navigate to action URL
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <motion.div
                            className="w-3 h-3 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <p className="text-gray-400 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <motion.button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-slate-700 rounded transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Mark as read"
                        >
                          <CheckCircle size={18} className="text-green-400" />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Button */}
                  {notification.actionUrl && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Link href={notification.actionUrl}>
                        <motion.button
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          whileHover={{ x: 5 }}
                        >
                          View Now →
                        </motion.button>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Bell size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread'
                  ? 'You are all caught up!'
                  : 'You will be notified about new releases, watchlist items, and more.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Settings Info */}
        <motion.div
          className="mt-12 p-6 bg-blue-600/10 border border-blue-500/30 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-blue-400 flex items-center gap-2">
            <AlertCircle size={18} />
            Manage your notification preferences in{' '}
            <Link href="/preferences" className="font-semibold hover:underline">
              Settings
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
