import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import type { UploadResult } from './types';
import { STORAGE_CONFIG } from './config';

export async function firebaseUploadImage(
  file: Blob,
  userId: string,
  type: 'profile' | 'task' = 'profile',
  metadata?: { taskId?: string }
): Promise<UploadResult> {
  if (!storage) {
    throw new Error('Firebase storage not initialized');
  }

  try {
    // Organize files by type and user
    const path = type === 'profile' 
      ? `${STORAGE_CONFIG.paths.profiles}/${userId}/${Date.now()}.jpg`
      : `tasks/${userId}/${metadata?.taskId || Date.now()}.jpg`;

    const storageRef = ref(storage, path);
    
    // Add metadata
    const uploadMetadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        userId,
        type,
        ...(metadata || {})
      }
    };

    const snapshot = await uploadBytes(storageRef, file, uploadMetadata);
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path,
      success: true
    };
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw error;
  }
}