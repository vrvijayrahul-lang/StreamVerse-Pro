'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getWatchlist } from '@/firebase/firestore';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MovieCard from '@/components/player/MovieCard';
import { Watchlist, Movie } from '@/types';

const WatchlistPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const data = await getWatchlist(currentUser.id);
        setWatchlist(data);
        // In a real app, you would fetch the full movie details
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [currentUser, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6">
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

          <h1 className="text-4xl font-bold">My Watchlist</h1>
          <p className="text-gray-400 mt-2">
            {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}
          </p>
        </motion.div>

        {/* Watchlist Grid */}
        {watchlist.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {watchlist.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Movie Card would go here */}
                <div className="text-gray-400 text-sm">{item.contentId}</div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-96 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-400 mb-4">
              <p className="text-lg mb-2">Your watchlist is empty</p>
              <p className="text-sm mb-6">Start adding movies and shows to your list</p>
            </div>
            <Link href="/">
              <motion.button
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Content
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default WatchlistPage;
