'use client';

import { useState, useCallback } from 'react';
import {
  registerWithEmail,
  loginWithEmail,
  logout,
  resetPassword,
  loginWithGoogle,
  loginWithGithub,
  updateUserProfile,
} from '@/firebase/auth';
import { createUserDocument, updateUserDocument } from '@/firebase/firestore';
import { User, UserPreferences } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setLoading(true);
      setError(null);
      try {
        const user = await registerWithEmail(email, password, displayName);
        
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || displayName,
          photoURL: user.photoURL || '',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          verified: false,
        };

        await createUserDocument(user.uid, newUser);
        return user;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithEmail(email, password);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      
      // Check if user exists in Firestore
      const userDoc = await fetch(`/api/users/${user.uid}`).then(res => res.json());
      
      if (!userDoc.data) {
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          verified: true,
        };

        await createUserDocument(user.uid, newUser);
      }

      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGithub = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGithub();
      
      const userDoc = await fetch(`/api/users/${user.uid}`).then(res => res.json());
      
      if (!userDoc.data) {
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          verified: true,
        };

        await createUserDocument(user.uid, newUser);
      }

      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'GitHub sign-in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (displayName?: string, photoURL?: string) => {
      setLoading(true);
      setError(null);
      try {
        await updateUserProfile(displayName, photoURL);
        
        if (currentUser) {
          await updateUserDocument(currentUser.id, {
            displayName: displayName || currentUser.displayName,
            photoURL: photoURL || currentUser.photoURL,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const updatePreferences = useCallback(
    async (preferences: Partial<UserPreferences>) => {
      setLoading(true);
      setError(null);
      try {
        if (currentUser) {
          await updateUserDocument(currentUser.id, {
            preferences: {
              ...currentUser.preferences,
              ...preferences,
            },
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Update failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  return {
    register,
    login,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    forgotPassword,
    updateProfile,
    updatePreferences,
    loading,
    error,
  };
};
