'use client';

import { useCallback } from 'react';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  addToWatchlist,
  getWatchlist,
  addWatchHistory,
  getWatchHistory,
  addOrUpdateRating,
} from '@/firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export const useUserList = () => {
  const { currentUser } = useAuth();

  const handleAddToFavorites = useCallback(
    async (contentId: string, contentType: 'movie' | 'series') => {
      if (!currentUser) return;
      try {
        await addToFavorites(currentUser.id, contentId, contentType);
      } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
      }
    },
    [currentUser]
  );

  const handleRemoveFromFavorites = useCallback(
    async (contentId: string) => {
      if (!currentUser) return;
      try {
        await removeFromFavorites(currentUser.id, contentId);
      } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
      }
    },
    [currentUser]
  );

  const handleGetFavorites = useCallback(async () => {
    if (!currentUser) return [];
    try {
      return await getFavorites(currentUser.id);
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }, [currentUser]);

  const handleAddToWatchlist = useCallback(
    async (contentId: string, contentType: 'movie' | 'series') => {
      if (!currentUser) return;
      try {
        await addToWatchlist(currentUser.id, contentId, contentType);
      } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw error;
      }
    },
    [currentUser]
  );

  const handleGetWatchlist = useCallback(async () => {
    if (!currentUser) return [];
    try {
      return await getWatchlist(currentUser.id);
    } catch (error) {
      console.error('Error getting watchlist:', error);
      return [];
    }
  }, [currentUser]);

  const handleAddWatchHistory = useCallback(
    async (
      contentId: string,
      contentType: 'movie' | 'series',
      currentTime: number,
      duration: number,
      episodeId?: string
    ) => {
      if (!currentUser) return;
      try {
        await addWatchHistory(currentUser.id, contentId, contentType, currentTime, duration, episodeId);
      } catch (error) {
        console.error('Error adding watch history:', error);
        throw error;
      }
    },
    [currentUser]
  );

  const handleGetWatchHistory = useCallback(async () => {
    if (!currentUser) return [];
    try {
      return await getWatchHistory(currentUser.id);
    } catch (error) {
      console.error('Error getting watch history:', error);
      return [];
    }
  }, [currentUser]);

  const handleAddRating = useCallback(
    async (contentId: string, contentType: 'movie' | 'series', rating: number) => {
      if (!currentUser) return;
      try {
        await addOrUpdateRating(currentUser.id, contentId, contentType, rating);
      } catch (error) {
        console.error('Error adding rating:', error);
        throw error;
      }
    },
    [currentUser]
  );

  return {
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleGetFavorites,
    handleAddToWatchlist,
    handleGetWatchlist,
    handleAddWatchHistory,
    handleGetWatchHistory,
    handleAddRating,
  };
};
