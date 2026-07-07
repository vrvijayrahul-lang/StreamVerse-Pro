'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Bookmark, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/types';

interface HeroSectionProps {
  movies: Movie[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  movies,
  autoPlay = true,
  autoPlayInterval = 6000,
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % movies.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, movies.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + movies.length) % movies.length);
  };

  if (movies.length === 0) {
    return <div className="h-[600px] bg-gray-900" />;
  }

  const activeMovie = movies[current];

  return (
    <div className="relative h-[600px] md:h-[700px] w-full overflow-hidden pt-16">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <Image
            src={activeMovie.banner || activeMovie.poster}
            alt={activeMovie.title}
            fill
            priority
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-banner.jpg';
            }}
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="px-6 md:px-12 pb-12 md:pb-20 max-w-2xl w-full">
              {/* Featured Badge */}
              {activeMovie.isFeatured && (
                <motion.div
                  className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  ✨ Featured
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {activeMovie.title}
              </motion.h1>

              {/* Metadata */}
              <motion.div
                className="flex items-center gap-4 mb-6 text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="flex items-center gap-1">
                  ⭐ {activeMovie.rating.toFixed(1)}/10
                </span>
                <span>•</span>
                <span>{activeMovie.year}</span>
                <span>•</span>
                <span>{activeMovie.duration}m</span>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-gray-200 text-lg mb-8 line-clamp-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {activeMovie.description}
              </motion.p>

              {/* Genres */}
              <motion.div
                className="flex flex-wrap gap-2 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {activeMovie.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/20"
                  >
                    {genre}
                  </span>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href={`/watch/${activeMovie.id}`}>
                  <motion.button
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} />
                    Watch Now
                  </motion.button>
                </Link>

                {activeMovie.trailerUrl && (
                  <motion.button
                    className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold flex items-center gap-2 transition-colors border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Info size={20} />
                    Trailer
                  </motion.button>
                )}

                <motion.button
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold flex items-center gap-2 transition-colors border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark size={20} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        {movies.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === current
                ? 'bg-blue-600 w-8'
                : 'bg-white/30 w-2 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
