'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '@/components/player/MovieCard';
import { Movie } from '@/types';

interface ContentSliderProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  onAddToWatchlist?: (movieId: string) => void;
  onAddToFavorites?: (movieId: string) => void;
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  subtitle,
  movies,
  onAddToWatchlist,
  onAddToFavorites,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`slider-${title}`);
    if (!container) return;

    const scrollAmount = 300;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    container.scrollLeft = newPosition;
    setScrollPosition(newPosition);
  };

  return (
    <motion.section
      className="py-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>

      {/* Slider Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <motion.button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        {/* Slider */}
        <div
          id={`slider-${title}`}
          className="overflow-x-auto scrollbar-hide flex gap-4 px-6 pb-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48"
            >
              <MovieCard
                movie={movie}
                onAddToWatchlist={() => onAddToWatchlist?.(movie.id)}
                onAddToFavorites={() => onAddToFavorites?.(movie.id)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Loading State */}
      {movies.length === 0 && (
        <div className="px-6 h-64 flex items-center justify-center text-gray-400">
          No content available
        </div>
      )}
    </motion.section>
  );
};

export default ContentSlider;
