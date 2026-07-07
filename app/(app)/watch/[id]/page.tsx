'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react';
import { getMovieById, addWatchHistory } from '@/firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Movie } from '@/types';

const WatchPage = () => {
  const params = useParams();
  const movieId = params.id as string;
  const { currentUser } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('auto');

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(movieId);
        setMovie(data);
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

  // Save watch history periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser && movie && videoRef.current) {
        addWatchHistory(
          currentUser.id,
          movie.id,
          'movie',
          currentTime,
          duration
        ).catch((error) => console.error('Error saving watch history:', error));
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser, movie, currentTime, duration]);

  // Handle video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const percentage = clickX / progressBar.offsetWidth;
    const newTime = percentage * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '00:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white w-full h-screen flex flex-col">
      {/* Player Container */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-black group"
        onMouseMove={handleMouseMove}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={movie.videoUrl}
          className="w-full h-full"
          onClick={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Title Overlay */}
        <motion.div
          className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-300 mt-2">{movie.year}</p>
        </motion.div>

        {/* Center Play Button (when paused) */}
        {!isPlaying && (
          <motion.button
            onClick={handlePlayPause}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 p-6 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Play size={40} fill="currentColor" />
          </motion.button>
        )}

        {/* Controls */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress Bar */}
          <div
            className="mb-4 h-1 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all group/progress"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handlePlayPause}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleMute}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-24 cursor-pointer"
                />
              </div>

              {/* Time Display */}
              <div className="text-sm text-gray-300 ml-4">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              {/* Settings */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings size={24} />
                </motion.button>

                {showSettings && (
                  <motion.div
                    className="absolute right-0 bottom-12 bg-black/95 border border-white/20 rounded-lg p-4 min-w-48"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="space-y-4">
                      {/* Playback Speed */}
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Playback Speed</p>
                        <div className="space-y-2">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => handlePlaybackSpeed(speed)}
                              className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                                playbackSpeed === speed
                                  ? 'bg-blue-600'
                                  : 'hover:bg-white/10'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quality */}
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Quality</p>
                        <div className="space-y-2">
                          {['Auto', '480p', '720p', '1080p', '4K'].map((quality) => (
                            <button
                              key={quality}
                              onClick={() => setSelectedQuality(quality)}
                              className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                                selectedQuality === quality
                                  ? 'bg-blue-600'
                                  : 'hover:bg-white/10'
                              }`}
                            >
                              {quality}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Fullscreen */}
              <motion.button
                onClick={handleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Section (if not fullscreen) */}
      {!isFullscreen && (
        <div className="p-8 bg-black border-t border-white/10">
          <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>
          <p className="text-gray-300 mb-6">{movie.description}</p>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Rating</p>
              <p className="text-white font-semibold">{movie.rating}/10</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Year</p>
              <p className="text-white font-semibold">{movie.year}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Duration</p>
              <p className="text-white font-semibold">{movie.duration}m</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Genre</p>
              <p className="text-white font-semibold">{movie.genres[0]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPage;
