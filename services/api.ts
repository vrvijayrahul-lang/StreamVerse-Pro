import axios, { AxiosError, AxiosInstance } from 'axios';
import { auth } from '@/firebase/config';
import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      console.error('Unauthorized request');
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const apiService = {
  // Movies
  getMovies: async (limit = 20) => {
    const response = await api.get<ApiResponse<any[]>>('/api/movies', {
      params: { limit },
    });
    return response.data;
  },

  getMovieById: async (movieId: string) => {
    const response = await api.get<ApiResponse<any>>(`/api/movies/${movieId}`);
    return response.data;
  },

  searchMovies: async (query: string, filters?: any) => {
    const response = await api.get<ApiResponse<any[]>>('/api/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // Users
  getProfile: async (userId: string) => {
    const response = await api.get<ApiResponse<any>>(`/api/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/api/users/${userId}`, data);
    return response.data;
  },

  // Watch History
  addWatchHistory: async (
    contentId: string,
    contentType: 'movie' | 'series',
    currentTime: number,
    duration: number
  ) => {
    const response = await api.post<ApiResponse<any>>('/api/watch-history', {
      contentId,
      contentType,
      currentTime,
      duration,
    });
    return response.data;
  },

  getWatchHistory: async (limit = 20) => {
    const response = await api.get<ApiResponse<any[]>>('/api/watch-history', {
      params: { limit },
    });
    return response.data;
  },

  // Favorites
  addToFavorites: async (contentId: string, contentType: 'movie' | 'series') => {
    const response = await api.post<ApiResponse<any>>('/api/favorites', {
      contentId,
      contentType,
    });
    return response.data;
  },

  removeFromFavorites: async (contentId: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/favorites/${contentId}`);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get<ApiResponse<any[]>>('/api/favorites');
    return response.data;
  },

  // Watchlist
  addToWatchlist: async (contentId: string, contentType: 'movie' | 'series') => {
    const response = await api.post<ApiResponse<any>>('/api/watchlist', {
      contentId,
      contentType,
    });
    return response.data;
  },

  removeFromWatchlist: async (contentId: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/watchlist/${contentId}`);
    return response.data;
  },

  getWatchlist: async () => {
    const response = await api.get<ApiResponse<any[]>>('/api/watchlist');
    return response.data;
  },

  // Ratings
  addRating: async (
    contentId: string,
    contentType: 'movie' | 'series',
    rating: number
  ) => {
    const response = await api.post<ApiResponse<any>>('/api/ratings', {
      contentId,
      contentType,
      rating,
    });
    return response.data;
  },

  getRating: async (contentId: string) => {
    const response = await api.get<ApiResponse<any>>(`/api/ratings/${contentId}`);
    return response.data;
  },

  // Reviews
  addReview: async (
    contentId: string,
    contentType: 'movie' | 'series',
    data: any
  ) => {
    const response = await api.post<ApiResponse<any>>('/api/reviews', {
      contentId,
      contentType,
      ...data,
    });
    return response.data;
  },

  getReviews: async (contentId: string, limit = 10) => {
    const response = await api.get<ApiResponse<any[]>>(`/api/reviews/${contentId}`, {
      params: { limit },
    });
    return response.data;
  },

  // Notifications
  getNotifications: async (limit = 20) => {
    const response = await api.get<ApiResponse<any[]>>('/api/notifications', {
      params: { limit },
    });
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.put<ApiResponse<any>>(
      `/api/notifications/${notificationId}`,
      { read: true }
    );
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get<ApiResponse<any>>('/api/analytics');
    return response.data;
  },

  trackEvent: async (event: string, data?: any) => {
    const response = await api.post<ApiResponse<any>>('/api/analytics/track', {
      event,
      data,
    });
    return response.data;
  },
};

export default api;
