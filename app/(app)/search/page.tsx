'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  Filter,
  X,
  ChevronDown,
  Star,
  Calendar,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { useUserList } from '@/hooks/useUserList';
import { Movie } from '@/types';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Filters
  const [filters, setFilters] = useState({
    genres: [] as string[],
    yearMin: 1990,
    yearMax: new Date().getFullYear(),
    ratingMin: 0,
    ratingMax: 10,
    languages: [] as string[],
  });

  const { handleAddToWatchlist, handleAddToFavorites } = useUserList();

  // Mock data for suggestions
  const allSuggestions = [
    'The Matrix',
    'Inception',
    'Interstellar',
    'The Dark Knight',
    'Pulp Fiction',
    'Fight Club',
    'Forrest Gump',
    'The Shawshank Redemption',
  ];

  const genreOptions = [
    'Action',
    'Drama',
    'Comedy',
    'Horror',
    'Sci-Fi',
    'Romance',
    'Thriller',
    'Adventure',
  ];

  const languageOptions = ['English', 'Spanish', 'French', 'Hindi', 'Japanese', 'Chinese'];

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSearchQuery(transcript);
        performSearch(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Handle search query changes and show suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = allSuggestions.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    // Mock search results
    const mockResults: Movie[] = [
      {
        id: 'movie-1',
        title: query.length > 0 ? `${query} - Movie 1` : 'The Matrix',
        description: 'A hacker discovers the truth about reality.',
        posterUrl: 'https://via.placeholder.com/200x300',
        bannerUrl: 'https://via.placeholder.com/1920x1080',
        videoUrl: 'https://example.com/video.mp4',
        rating: 8.7,
        year: 1999,
        duration: 136,
        language: 'English',
        genres: filters.genres.length > 0 ? filters.genres : ['Sci-Fi', 'Action'],
        cast: [],
        directors: ['Lana Wachowski', 'Lilly Wachowski'],
        viewCount: 2500000,
      },
      {
        id: 'movie-2',
        title: 'Inception',
        description: 'A skilled thief leads a team in pulling off the perfect heist.',
        posterUrl: 'https://via.placeholder.com/200x300',
        bannerUrl: 'https://via.placeholder.com/1920x1080',
        videoUrl: 'https://example.com/video.mp4',
        rating: 8.8,
        year: 2010,
        duration: 148,
        language: 'English',
        genres: ['Sci-Fi', 'Action', 'Thriller'],
        cast: [],
        directors: ['Christopher Nolan'],
        viewCount: 3000000,
      },
    ];

    // Apply filters
    const filtered = mockResults.filter((movie) => {
      const genreMatch =
        filters.genres.length === 0 ||
        filters.genres.some((g) => movie.genres.includes(g));
      const yearMatch =
        movie.year >= filters.yearMin && movie.year <= filters.yearMax;
      const ratingMatch =
        movie.rating >= filters.ratingMin && movie.rating <= filters.ratingMax;
      const languageMatch =
        filters.languages.length === 0 || filters.languages.includes(movie.language);

      return genreMatch && yearMatch && ratingMatch && languageMatch;
    });

    setTimeout(() => {
      setResults(filtered);
      setLoading(false);
      setHasSearched(true);
    }, 500);
  };

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const toggleGenre = (genre: string) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const toggleLanguage = (language: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const resetFilters = () => {
    setFilters({
      genres: [],
      yearMin: 1990,
      yearMax: new Date().getFullYear(),
      ratingMin: 0,
      ratingMax: 10,
      languages: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Advanced Search</h1>
          <p className="text-gray-400 text-lg">Find exactly what you're looking for</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search movies, shows, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') performSearch(searchQuery);
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-slate-700"
                />
              </div>

              <motion.button
                onClick={handleVoiceSearch}
                className={`p-4 rounded-lg font-semibold transition-all ${
                  isListening
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic size={20} />
              </motion.button>

              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={20} />
              </motion.button>

              <motion.button
                onClick={() => performSearch(searchQuery)}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 disabled:from-blue-600/50 disabled:to-blue-400/50 text-white rounded-lg font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Searching...' : 'Search'}
              </motion.button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-lg overflow-hidden z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {suggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        performSearch(suggestion);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-slate-700 transition-colors flex items-center gap-2 border-b border-white/5 last:border-b-0"
                      whileHover={{ x: 5 }}
                    >
                      <Search size={16} className="text-gray-500" />
                      {suggestion}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice Search Indicator */}
            {isListening && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-400"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="bg-slate-800/50 border border-white/10 rounded-lg p-6 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <motion.button
                  onClick={resetFilters}
                  className="text-sm text-blue-400 hover:text-blue-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Reset Filters
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Genres */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {genreOptions.map((genre) => (
                      <motion.button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          filters.genres.includes(genre)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {genre}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Year Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Year From</label>
                    <input
                      type="number"
                      min="1900"
                      value={filters.yearMin}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, yearMin: parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Year To</label>
                    <input
                      type="number"
                      max={new Date().getFullYear()}
                      value={filters.yearMax}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, yearMax: parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Rating Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Rating Min
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={filters.ratingMin}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ratingMin: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Rating Max
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={filters.ratingMax}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ratingMax: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((language) => (
                      <motion.button
                        key={language}
                        onClick={() => toggleLanguage(language)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          filters.languages.includes(language)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {language}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {hasSearched && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {loading ? (
              <div className="text-center py-12">
                <div className="flex justify-center gap-2 mb-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-blue-400 rounded-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ delay: i * 0.2, duration: 0.6, repeat: Infinity }}
                    />
                  ))}
                </div>
                <p className="text-gray-400">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-gray-400 mb-6">Found {results.length} results</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.map((movie, idx) => (
                    <motion.div
                      key={movie.id}
                      className="group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <Link href={`/movie/${movie.id}`}>
                        <div className="relative h-64 mb-3 rounded-lg overflow-hidden">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <div className="space-y-2 w-full">
                              <p className="text-white font-semibold line-clamp-1">
                                {movie.title}
                              </p>
                              <div className="flex gap-2">
                                <motion.button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToWatchlist(movie.id, 'movie');
                                  }}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm font-medium"
                                  whileTap={{ scale: 0.95 }}
                                >
                                  + List
                                </motion.button>
                                <motion.button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToFavorites(movie.id, 'movie');
                                  }}
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm font-medium"
                                  whileTap={{ scale: 0.95 }}
                                >
                                  ❤️
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm line-clamp-1">
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Star size={12} className="text-yellow-400" fill="currentColor" />
                            <span>{movie.rating}</span>
                            <span>•</span>
                            <span>{movie.year}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
