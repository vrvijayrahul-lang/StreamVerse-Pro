'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Star, Calendar } from 'lucide-react';
import { Movie } from '@/types';

export default function MoviesSection() {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: 'movie-1',
      title: 'The Matrix',
      description: 'A hacker discovers the truth about reality.',
      posterUrl: 'https://via.placeholder.com/200x300',
      bannerUrl: 'https://via.placeholder.com/1920x1080',
      videoUrl: 'https://example.com/video.mp4',
      rating: 8.7,
      year: 1999,
      duration: 136,
      language: 'English',
      genres: ['Sci-Fi', 'Action'],
      cast: [],
      directors: ['Lana Wachowski', 'Lilly Wachowski'],
      viewCount: 2500000,
      isTrending: true,
      isFeatured: true,
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const handleAddMovie = () => {
    setShowAddModal(true);
    setEditingMovie(null);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setShowAddModal(true);
  };

  const handleDeleteMovie = (movieId: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      setMovies(movies.filter((m) => m.id !== movieId));
    }
  };

  const handleSaveMovie = () => {
    setShowAddModal(false);
    setEditingMovie(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Movies Management</h2>
          <p className="text-gray-400">Manage your movie catalog</p>
        </div>
        <motion.button
          onClick={handleAddMovie}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add New Movie
        </motion.button>
      </motion.div>

      {/* Movies Table */}
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
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Year</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Rating</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Views</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, idx) => (
                <motion.tr
                  key={movie.id}
                  className="border-b border-white/5 hover:bg-slate-700/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-slate-700 rounded overflow-hidden">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white font-medium">{movie.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{movie.year}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={16} fill="currentColor" />
                      <span>{movie.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-1">
                      <Eye size={16} className="text-blue-400" />
                      <span>{(movie.viewCount / 1000000).toFixed(1)}M</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {movie.isTrending && (
                        <span className="px-2 py-1 bg-red-600/30 text-red-400 text-xs rounded">
                          🔥 Trending
                        </span>
                      )}
                      {movie.isFeatured && (
                        <span className="px-2 py-1 bg-blue-600/30 text-blue-400 text-xs rounded">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleEditMovie(movie)}
                        className="p-2 hover:bg-slate-600 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={18} className="text-blue-400" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteMovie(movie.id)}
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-slate-800 border border-white/10 rounded-lg p-8 max-w-2xl w-full mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingMovie ? 'Edit Movie' : 'Add New Movie'}
            </h3>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              handleSaveMovie();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Movie title"
                    defaultValue={editingMovie?.title || ''}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <input
                    type="number"
                    placeholder="Release year"
                    defaultValue={editingMovie?.year || 2024}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  placeholder="Movie description"
                  defaultValue={editingMovie?.description || ''}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    defaultValue={editingMovie?.rating || 8.0}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="Movie duration"
                    defaultValue={editingMovie?.duration || 120}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingMovie ? 'Update Movie' : 'Add Movie'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-700 text-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-slate-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
