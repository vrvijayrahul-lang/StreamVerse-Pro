'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Heart, Plus } from 'lucide-react';
import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onAddToWatchlist?: () => void;
  onAddToFavorites?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onAddToWatchlist,
  onAddToFavorites,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <motion.div
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative h-64 rounded-lg overflow-hidden bg-gray-900 shadow-lg">
          {/* Poster Image */}
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-poster.jpg';
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-sm text-yellow-400 font-bold">
            {movie.rating.toFixed(1)}
          </div>

          {/* Trending Badge */}
          {movie.isTrending && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              TRENDING
            </div>
          )}

          {/* Hover Content */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              {/* Title */}
              <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>

              {/* Info */}
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>{movie.year}</span>
                <span className="text-yellow-400">
                  {movie.genres[0] || 'Movies'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToWatchlist?.();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={16} />
                  Play
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToFavorites?.();
                    setIsFavorited(!isFavorited);
                  }}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isFavorited
                      ? 'bg-red-600 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to list action
                  }}
                  className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
