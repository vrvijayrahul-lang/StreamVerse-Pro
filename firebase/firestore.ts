import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  WriteBatch,
  writeBatch,
  FieldValue,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import {
  Movie,
  Series,
  User,
  WatchHistory,
  Favorite,
  Watchlist,
  Rating,
  Review,
  Notification,
  Analytics,
  Banner,
  CastMember,
  SubtitleTrack,
  Genre,
  Category,
} from '@/types';

// User Services
export const createUserDocument = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const getUserDocument = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
};

export const updateUserDocument = async (userId: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

// Movie Services
export const getMovies = async (constraints: QueryConstraint[] = [], pageSize = 20) => {
  try {
    const q = query(
      collection(db, 'movies'),
      ...constraints,
      limit(pageSize)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
  } catch (error) {
    console.error('Error getting movies:', error);
    throw error;
  }
};

export const getMovieById = async (movieId: string) => {
  try {
    const movieRef = doc(db, 'movies', movieId);
    const movieSnap = await getDoc(movieRef);
    return movieSnap.exists() ? ({ id: movieSnap.id, ...movieSnap.data() } as Movie) : null;
  } catch (error) {
    console.error('Error getting movie:', error);
    throw error;
  }
};

export const getTrendingMovies = async (limit_count = 10) => {
  try {
    const q = query(
      collection(db, 'movies'),
      where('isTrending', '==', true),
      orderBy('views', 'desc'),
      limit(limit_count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
  } catch (error) {
    console.error('Error getting trending movies:', error);
    throw error;
  }
};

export const getFeaturedMovies = async (limit_count = 10) => {
  try {
    const q = query(
      collection(db, 'movies'),
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limit_count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
  } catch (error) {
    console.error('Error getting featured movies:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genre: string, limit_count = 20) => {
  try {
    const q = query(
      collection(db, 'movies'),
      where('genres', 'array-contains', genre),
      limit(limit_count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
  } catch (error) {
    console.error('Error getting movies by genre:', error);
    throw error;
  }
};

// Series Services
export const getSeriesById = async (seriesId: string) => {
  try {
    const seriesRef = doc(db, 'series', seriesId);
    const seriesSnap = await getDoc(seriesRef);
    return seriesSnap.exists() ? ({ id: seriesSnap.id, ...seriesSnap.data() } as Series) : null;
  } catch (error) {
    console.error('Error getting series:', error);
    throw error;
  }
};

export const getTrendingSeries = async (limit_count = 10) => {
  try {
    const q = query(
      collection(db, 'series'),
      where('isTrending', '==', true),
      orderBy('views', 'desc'),
      limit(limit_count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
  } catch (error) {
    console.error('Error getting trending series:', error);
    throw error;
  }
};

// Watch History Services
export const addWatchHistory = async (
  userId: string,
  contentId: string,
  contentType: 'movie' | 'series',
  currentTime: number,
  duration: number,
  episodeId?: string
) => {
  try {
    const watchHistoryRef = collection(db, 'watchHistory');
    const q = query(
      watchHistoryRef,
      where('userId', '==', userId),
      where('contentId', '==', contentId),
      where('contentType', '==', contentType)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await setDoc(doc(watchHistoryRef), {
        userId,
        contentId,
        contentType,
        currentTime,
        duration,
        episodeId,
        watchedAt: serverTimestamp(),
        completed: currentTime >= duration * 0.9,
      });
    } else {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(watchHistoryRef, docId), {
        currentTime,
        duration,
        watchedAt: serverTimestamp(),
        completed: currentTime >= duration * 0.9,
      });
    }
  } catch (error) {
    console.error('Error adding watch history:', error);
    throw error;
  }
};

export const getWatchHistory = async (userId: string, limit_count = 20) => {
  try {
    const q = query(
      collection(db, 'watchHistory'),
      where('userId', '==', userId),
      orderBy('watchedAt', 'desc'),
      limit(limit_count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as WatchHistory);
  } catch (error) {
    console.error('Error getting watch history:', error);
    throw error;
  }
};

// Favorite Services
export const addToFavorites = async (
  userId: string,
  contentId: string,
  contentType: 'movie' | 'series'
) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('contentId', '==', contentId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await setDoc(doc(favoritesRef), {
        userId,
        contentId,
        contentType,
        addedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (
  userId: string,
  contentId: string
) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('contentId', '==', contentId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      orderBy('addedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Favorite);
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

// Watchlist Services
export const addToWatchlist = async (
  userId: string,
  contentId: string,
  contentType: 'movie' | 'series'
) => {
  try {
    const watchlistRef = collection(db, 'watchlist');
    const q = query(
      watchlistRef,
      where('userId', '==', userId),
      where('contentId', '==', contentId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await setDoc(doc(watchlistRef), {
        userId,
        contentId,
        contentType,
        addedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const getWatchlist = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'watchlist'),
      where('userId', '==', userId),
      orderBy('addedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Watchlist);
  } catch (error) {
    console.error('Error getting watchlist:', error);
    throw error;
  }
};

// Rating Services
export const addOrUpdateRating = async (
  userId: string,
  contentId: string,
  contentType: 'movie' | 'series',
  rating: number
) => {
  try {
    const ratingsRef = collection(db, 'ratings');
    const q = query(
      ratingsRef,
      where('userId', '==', userId),
      where('contentId', '==', contentId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await setDoc(doc(ratingsRef), {
        userId,
        contentId,
        contentType,
        rating,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(ratingsRef, docId), {
        rating,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
};

// Notification Services
export const createNotification = async (
  userId: string,
  notification: Partial<Notification>
) => {
  try {
    await setDoc(doc(collection(db, 'notifications')), {
      userId,
      ...notification,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId: string, limit_count = 20) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limit_count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Notification);
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

// Analytics Services
export const incrementViewCount = async (
  contentId: string,
  contentType: 'movie' | 'series'
) => {
  try {
    const contentRef = doc(db, contentType === 'movie' ? 'movies' : 'series', contentId);
    await updateDoc(contentRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

// Genre Services
export const getGenres = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'genres'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Genre));
  } catch (error) {
    console.error('Error getting genres:', error);
    throw error;
  }
};

// Banner Services
export const getActiveBanners = async () => {
  try {
    const q = query(
      collection(db, 'banners'),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Banner);
  } catch (error) {
    console.error('Error getting banners:', error);
    throw error;
  }
};
