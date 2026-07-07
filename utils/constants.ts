// Application Constants

export const APP_NAME = 'StreamVerse';
export const APP_DESCRIPTION = 'Premium Streaming Platform';

// Roles
export const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  PREMIUM: 'premium',
  ADMIN: 'admin',
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
} as const;

export const PLAN_FEATURES = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Ad-supported streaming',
      'Standard quality (480p)',
      'Single device',
      'Limited library access',
    ],
  },
  basic: {
    name: 'Basic',
    price: 4.99,
    features: [
      'Ad-free streaming',
      'HD quality (720p)',
      'Single device',
      'Full library access',
    ],
  },
  standard: {
    name: 'Standard',
    price: 9.99,
    features: [
      'Ad-free streaming',
      'Full HD quality (1080p)',
      'Two devices simultaneously',
      'Full library access',
      'Downloads (30 days)',
    ],
  },
  premium: {
    name: 'Premium',
    price: 14.99,
    features: [
      'Ad-free streaming',
      '4K Ultra HD quality',
      'Four devices simultaneously',
      'Full library access',
      'Downloads (unlimited)',
      'Priority support',
      'Early access to new content',
    ],
  },
} as const;

// Quality Options
export const QUALITY_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: '480p', value: '480p' },
  { label: '720p', value: '720p' },
  { label: '1080p', value: '1080p' },
  { label: '4K', value: '4k' },
] as const;

// Playback Speed Options
export const PLAYBACK_SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: 'Normal', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
] as const;

// Content Types
export const CONTENT_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
  EPISODE: 'episode',
} as const;

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
] as const;

// Themes
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_RELEASE: 'new_release',
  WATCHLIST_AVAILABLE: 'watchlist_available',
  EPISODE_AVAILABLE: 'episode_available',
  SYSTEM: 'system',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  MOVIES: '/api/movies',
  SERIES: '/api/series',
  USERS: '/api/users',
  SEARCH: '/api/search',
  WATCH_HISTORY: '/api/watch-history',
  FAVORITES: '/api/favorites',
  WATCHLIST: '/api/watchlist',
  RATINGS: '/api/ratings',
  REVIEWS: '/api/reviews',
  NOTIFICATIONS: '/api/notifications',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error occurred',
  NETWORK_ERROR: 'Network error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  EMAIL_VERIFIED: 'Email verified successfully',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  WATCH_HISTORY: 'watch_history',
  LAST_WATCHED: 'last_watched',
  SEARCH_HISTORY: 'search_history',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  SEARCH_QUERIES: 100,
  API_CALLS: 1000,
} as const;

// Cache Duration (in seconds)
export const CACHE_DURATION = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

export default {
  APP_NAME,
  APP_DESCRIPTION,
  ROLES,
  SUBSCRIPTION_PLANS,
  QUALITY_OPTIONS,
  PLAYBACK_SPEED_OPTIONS,
  CONTENT_TYPES,
  LANGUAGES,
  THEMES,
  NOTIFICATION_TYPES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  PAGINATION,
  RATE_LIMITS,
  CACHE_DURATION,
};
