import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './config';

// Upload file with progress tracking
export const uploadFileWithProgress = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Simple file upload
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload poster
export const uploadPoster = async (
  file: File,
  movieId: string
): Promise<string> => {
  return uploadFile(file, `posters/${movieId}/${file.name}`);
};

// Upload banner
export const uploadBanner = async (
  file: File,
  movieId: string
): Promise<string> => {
  return uploadFile(file, `banners/${movieId}/${file.name}`);
};

// Upload video
export const uploadVideo = async (
  file: File,
  movieId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return uploadFileWithProgress(file, `videos/${movieId}/${file.name}`, onProgress);
};

// Upload trailer
export const uploadTrailer = async (
  file: File,
  movieId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return uploadFileWithProgress(
    file,
    `trailers/${movieId}/${file.name}`,
    onProgress
  );
};

// Upload subtitle
export const uploadSubtitle = async (
  file: File,
  contentId: string
): Promise<string> => {
  return uploadFile(file, `subtitles/${contentId}/${file.name}`);
};

// Upload user avatar
export const uploadUserAvatar = async (
  file: File,
  userId: string
): Promise<string> => {
  return uploadFile(file, `avatars/${userId}/${file.name}`);
};

// Delete file
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get file download URL
export const getFileDownloadURL = async (filePath: string): Promise<string> => {
  try {
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};
