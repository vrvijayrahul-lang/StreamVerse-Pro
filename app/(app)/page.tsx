'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import ContentSlider from '@/components/sections/ContentSlider';
import { getTrendingMovies, getFeaturedMovies, getMoviesByGenre } from '@/firebase/firestore';
import { useUserList } from '@/hooks/useUserList';
import { Movie } from '@/types';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleAddToWatchlist, handleAddToFavorites } = useUserList();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [trending, featured, action, drama, comedy] = await Promise.all([
          getTrendingMovies(20),
          getFeaturedMovies(15),
          getMoviesByGenre('Action', 20),
          getMoviesByGenre('Drama', 20),
          getMoviesByGenre('Comedy', 20),
        ]);

        setTrendingMovies(trending);
        setFeaturedMovies(featured);
        setActionMovies(action);
        setDramaMovies(drama);
        setComedyMovies(comedy);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <main className="bg-black min-h-screen">
      {/* Hero Section */}
      <HeroSection
        movies={featuredMovies.length > 0 ? featuredMovies : trendingMovies}
        autoPlay={true}
        autoPlayInterval={6000}
      />

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Trending Now */}
        {trendingMovies.length > 0 && (
          <ContentSlider
            title="Trending Now"
            subtitle="The hottest content right now"
            movies={trendingMovies}
            onAddToWatchlist={handleAddToWatchlist}
            onAddToFavorites={handleAddToFavorites}
          />
        )}

        {/* Action Movies */}
        {actionMovies.length > 0 && (
          <ContentSlider
            title="Action Packed"
            subtitle="High-octane entertainment"
            movies={actionMovies}
            onAddToWatchlist={handleAddToWatchlist}
            onAddToFavorites={handleAddToFavorites}
          />
        )}

        {/* Drama Series */}
        {dramaMovies.length > 0 && (
          <ContentSlider
            title="Gripping Dramas"
            subtitle="Compelling storytelling at its finest"
            movies={dramaMovies}
            onAddToWatchlist={handleAddToWatchlist}
            onAddToFavorites={handleAddToFavorites}
          />
        )}

        {/* Comedy */}
        {comedyMovies.length > 0 && (
          <ContentSlider
            title="Laugh Out Loud"
            subtitle="Hilarious entertainment"
            movies={comedyMovies}
            onAddToWatchlist={handleAddToWatchlist}
            onAddToFavorites={handleAddToFavorites}
          />
        )}

        {/* Featured Content */}
        {featuredMovies.length > 0 && (
          <ContentSlider
            title="Featured"
            subtitle="Hand-picked for you"
            movies={featuredMovies}
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

      {/* Footer Padding */}
      <div className="h-20" />
    </main>
  );
};

export default HomePage;
