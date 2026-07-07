'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { getUserDocument, createUserDocument } from '@/firebase/firestore';
import { User, UserRole } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  userRole: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setFirebaseUser(user);
          
          // Try to get existing user document
          let userData = await getUserDocument(user.uid);
          
          // If user doesn't exist in Firestore, create document
          if (!userData) {
            const newUser: User = {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'User',
              photoURL: user.photoURL || '',
              role: 'user',
              createdAt: new Date(),
              updatedAt: new Date(),
              verified: user.emailVerified,
            };
            
            await createUserDocument(user.uid, newUser);
            userData = newUser;
          }

          setCurrentUser(userData as User);
          setError(null);
        } else {
          setCurrentUser(null);
          setFirebaseUser(null);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    error,
    userRole: currentUser?.role || 'guest',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
