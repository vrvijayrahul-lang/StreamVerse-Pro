'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { currentUser } = useAuth();
  const { signOut } = useAuthActions();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearchClick = () => {
    router.push('/search');
  };

  const handleNotificationsClick = () => {
    router.push('/notifications');
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies' },
    { label: 'TV Shows', href: '/tv-shows' },
    { label: 'Anime', href: '/anime' },
    { label: 'Trending', href: '/trending' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-gradient-to-b from-black to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              StreamVerse
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-blue-400 transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.button
              onClick={handleSearchClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              title="Advanced Search"
            >
              <Search size={20} className="text-white" />
            </motion.button>

            {/* Notifications */}
            {currentUser && (
              <motion.button
                onClick={handleNotificationsClick}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                title="Notifications"
              >
                <Bell size={20} className="text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
            )}

            {/* User Menu */}
            {currentUser ? (
              <div className="relative group">
                <motion.button
                  className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </motion.button>

                {/* Dropdown Menu */}
                <motion.div
                  className="absolute right-0 mt-0 w-48 bg-black/95 rounded-lg shadow-xl border border-white/10 hidden group-hover:block"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/watchlist"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    My List
                  </Link>
                  <Link
                    href="/notifications"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    Notifications
                  </Link>
                  {currentUser?.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm border-t border-white/10"
                    >
                      <span className="font-semibold">👨‍💼 Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors rounded-b-lg flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              </div>
            ) : (
              <Link href="/auth/login">
                <motion.button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign In
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
          initial={{ height: 0 }}
          animate={{ height: isOpen ? 'auto' : 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
