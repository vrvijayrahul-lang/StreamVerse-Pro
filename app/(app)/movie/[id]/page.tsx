'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Bookmark, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getMovieById, incrementViewCount } from '@/firebase/firestore';
import { useUserList } from '@/hooks/useUserList';
import { Movie } from '@/types';

const MovieDetailsPage = () => {
  const params = useParams();
  const movieId = params.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleAddToWatchlist } = useUserList();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(movieId);
        setMovie(data);
        if (data) {
          await incrementViewCount(movieId, 'movie');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/">
            <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </Link>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold">Movie not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen pt-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>
        </Link>
      </div>

      <div className="relative">
        {/* Banner */}
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <Image
            src={movie.banner || movie.poster}
            alt={movie.title}
            fill
            priority
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-banner.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 relative -mt-32 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster */}
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-72 md:h-96 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-poster.jpg';
                  }}
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
                <span className="flex items-center gap-1">⭐ {movie.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}m</span>
                <span>•</span>
                <span className="text-blue-400">{movie.language}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-8">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm border border-blue-600"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">{movie.description}</p>

              {/* Cast */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Cast</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.cast.slice(0, 4).map((actor) => (
                    <div key={actor.id} className="text-sm">
                      <p className="font-semibold text-white">{actor.name}</p>
                      <p className="text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href={`/watch/${movie.id}`}>
                  <motion.button
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} />
                    Watch Now
                  </motion.button>
                </Link>

                <motion.button
                  onClick={() => handleAddToWatchlist(movie.id, 'movie')}
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold flex items-center gap-2 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark size={20} />
                  Add to List
                </motion.button>

                <motion.button
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold flex items-center gap-2 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={20} />
                  Share
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Director</p>
              <p className="text-white font-semibold">{movie.director.join(', ')}</p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Writers</p>
              <p className="text-white font-semibold">{movie.writers.slice(0, 2).join(', ')}</p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Release Date</p>
              <p className="text-white font-semibold">
                {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Views</p>
              <p className="text-white font-semibold">{movie.views.toLocaleString()}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetailsPage;
