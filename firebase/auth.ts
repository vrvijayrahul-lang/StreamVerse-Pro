import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';
import { User } from '@/types';

// Email & Password Authentication
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const verifyEmail = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Google Authentication
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// GitHub Authentication
export const loginWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update User Profile
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
) => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName || undefined,
        photoURL: photoURL || auth.currentUser.photoURL || undefined,
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get Current User
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Convert Firebase User to App User
export const convertFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || 'User',
    photoURL: firebaseUser.photoURL || '',
    role: 'user',
    createdAt: firebaseUser.metadata?.creationTime || new Date(),
    updatedAt: new Date(),
    verified: firebaseUser.emailVerified,
  };
};
