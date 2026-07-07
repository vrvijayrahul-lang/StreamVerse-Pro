'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ContentSlider from '@/components/sections/ContentSlider';
import { getMovies } from '@/firebase/firestore';
import { useUserList } from '@/hooks/useUserList';
import { Movie } from '@/types';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleAddToWatchlist, handleAddToFavorites } = useUserList();

  const genres = [
    'Action',
    'Drama',
    'Comedy',
    'Horror',
    'Sci-Fi',
    'Romance',
    'Thriller',
    'Adventure',
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getMovies([], 50);
        
        // Filter by genre if selected
        const filtered = selectedGenre
          ? data.filter((movie) => movie.genres.includes(selectedGenre))
          : data;

        // Filter by search term
        const searched = searchTerm
          ? filtered.filter((movie) =>
              movie.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : filtered;

        setMovies(searched);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, searchTerm]);

  return (
    <main className="bg-black text-white min-h-screen pt-20">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Movies</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            onClick={() => setSelectedGenre(null)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedGenre === null
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>

          {genres.map((genre) => (
            <motion.button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                selectedGenre === genre
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {genre}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
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
        ) : movies.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Movie cards will be rendered here */}
                <div className="text-gray-400 text-sm">{movie.title}</div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-lg">No movies found</p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default MoviesPage;
