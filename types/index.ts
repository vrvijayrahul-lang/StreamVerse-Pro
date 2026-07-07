// User and Authentication Types
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  subscription?: Subscription;
  preferences?: UserPreferences;
  verified: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  autoPlay: boolean;
  autoPlayNext: boolean;
  autoSkipIntro: boolean;
  autoSkipCredits: boolean;
  subtitles: boolean;
  subtitleLanguage: string;
  qualityPreference: 'auto' | '480p' | '720p' | '1080p' | '4k';
  playbackSpeed: number;
  notifications: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'standard' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  autoRenew: boolean;
}

// Content Types
export interface Movie {
  id: string;
  title: string;
  description: string;
  poster: string;
  banner: string;
  rating: number;
  votes: number;
  year: number;
  duration: number;
  genres: string[];
  cast: CastMember[];
  director: string[];
  writers: string[];
  language: string;
  country: string;
  videoUrl: string;
  trailerUrl?: string;
  subtitles: SubtitleTrack[];
  releaseDate: Date;
  isTrending: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  image?: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  url: string;
  default?: boolean;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  poster: string;
  banner: string;
  rating: number;
  votes: number;
  year: number;
  genres: string[];
  cast: CastMember[];
  director: string[];
  language: string;
  country: string;
  totalSeasons: number;
  totalEpisodes: number;
  status: 'ongoing' | 'completed';
  releaseDate: Date;
  isTrending: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  description?: string;
  poster?: string;
  releaseDate: Date;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  releaseDate: Date;
  subtitles: SubtitleTrack[];
  views: number;
  createdAt: Date;
}

export interface Genre {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  featured: boolean;
}

// User Interaction Types
export interface WatchHistory {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  watchedAt: Date;
  currentTime: number;
  duration: number;
  episodeId?: string;
  completed: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  addedAt: Date;
}

export interface Watchlist {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  addedAt: Date;
}

export interface Rating {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  title: string;
  content: string;
  rating: number;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  parentId?: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment and Subscription Types
export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  transactionId: string;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  maxUses: number;
  currentUses: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'new_release' | 'watchlist_available';
  read: boolean;
  actionUrl?: string;
  contentId?: string;
  createdAt: Date;
}

// Banner and Analytics Types
export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  contentId?: string;
  contentType?: 'movie' | 'series';
  displayOrder: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  contentId: string;
  contentType: 'movie' | 'series';
  viewCount: number;
  averageRating: number;
  totalReviews: number;
  watchTime: number;
  createdAt: Date;
}

export interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  totalMovies: number;
  totalSeries: number;
  totalViews: number;
  totalRevenue: number;
  activeSubscriptions: number;
  revenueThisMonth: number;
}

// Settings Type
export interface Settings {
  id: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  updatedAt: Date;
}

// Common Types for API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Search Types
export interface SearchFilters {
  genres?: string[];
  year?: { min: number; max: number };
  rating?: { min: number; max: number };
  language?: string[];
  country?: string[];
  actor?: string;
  director?: string;
  contentType?: 'movie' | 'series';
}

export interface SearchResult {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'series';
  rating: number;
  year: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Banner and Analytics Types
export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  contentId?: string;
  contentType?: 'movie' | 'series';
  displayOrder: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface Analytics {
  id: string;
  contentId: string;
  contentType: 'movie' | 'series';
  viewCount: number;
  averageRating: number;
  totalReviews: number;
  watchTime: number;
  createdAt: Date;
}

// Settings Type
export interface Settings {
  id: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  updatedAt: Date;
}

// Common Types for API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Search Types
export interface SearchFilters {
  genres?: string[];
  year?: { min: number; max: number };
  rating?: { min: number; max: number };
  language?: string[];
  country?: string[];
  actor?: string;
  director?: string;
  contentType?: 'movie' | 'series';
}

export interface SearchResult {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'series';
  rating: number;
  year: number;
}
