'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ContentSlider from '@/components/sections/ContentSlider';
import { getTrendingMovies, getTrendingSeries } from '@/firebase/firestore';
import { useUserList } from '@/hooks/useUserList';
import { Movie, Series } from '@/types';

const TrendingPage = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingSeries, setTrendingSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleAddToWatchlist, handleAddToFavorites } = useUserList();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const [movies, series] = await Promise.all([
          getTrendingMovies(30),
          getTrendingSeries(30),
        ]);

        setTrendingMovies(movies);
        setTrendingSeries(series as unknown as Series[]);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <main className="bg-black text-white min-h-screen pt-20">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Trending Now</h1>
        <p className="text-gray-400 text-lg">
          Discover what's hot right now on StreamVerse
        </p>
      </motion.div>

      {/* Content */}
      <div className="space-y-12">
        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <ContentSlider
            title="🔥 Trending Movies"
            subtitle="The hottest movies everyone's watching"
            movies={trendingMovies}
            onAddToWatchlist={handleAddToWatchlist}
            onAddToFavorites={handleAddToFavorites}
          />
        )}

        {/* Trending Series */}
        {trendingSeries.length > 0 && (
          <ContentSlider
            title="📺 Trending TV Shows"
            subtitle="The most popular series right now"
            movies={trendingSeries as unknown as Movie[]}
            onAddToWatchlist={handleAddToWatchlist}
            onAddToFavorites={handleAddToFavorites}
          />
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div className="flex items-center justify-center h-96">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-blue-600 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && trendingMovies.length === 0 && trendingSeries.length === 0 && (
        <motion.div
          className="flex items-center justify-center h-96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-400 text-lg">No trending content available</p>
        </motion.div>
      )}

      <div className="h-20" />
    </main>
  );
};

export default TrendingPage;
