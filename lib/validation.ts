import { z } from 'zod';

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// User Schemas
export const profileUpdateSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  photoURL: z.string().url('Invalid URL').optional(),
});

export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark']),
  language: z.string(),
  autoPlay: z.boolean(),
  autoPlayNext: z.boolean(),
  autoSkipIntro: z.boolean(),
  autoSkipCredits: z.boolean(),
  subtitles: z.boolean(),
  subtitleLanguage: z.string(),
  qualityPreference: z.enum(['auto', '480p', '720p', '1080p', '4k']),
  playbackSpeed: z.number().min(0.5).max(2),
  notifications: z.boolean(),
});

// Content Schemas
export const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  poster: z.string().url('Invalid poster URL'),
  banner: z.string().url('Invalid banner URL'),
  rating: z.number().min(0).max(10),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  duration: z.number().positive('Duration must be positive'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  videoUrl: z.string().url('Invalid video URL'),
  trailerUrl: z.string().url('Invalid trailer URL').optional(),
});

export const reviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Review must be at least 10 characters'),
  rating: z.number().min(1).max(10),
});

export const ratingSchema = z.object({
  rating: z.number().min(1).max(10),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment too long'),
});

// Search Schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query required'),
  filters: z
    .object({
      genres: z.array(z.string()).optional(),
      year: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
      rating: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
      language: z.array(z.string()).optional(),
      country: z.array(z.string()).optional(),
    })
    .optional(),
});

// Subscription Schema
export const subscriptionSchema = z.object({
  plan: z.enum(['free', 'basic', 'standard', 'premium']),
  autoRenew: z.boolean(),
});

// Type Exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type MovieInput = z.infer<typeof movieSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
