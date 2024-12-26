import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import type { UploadResult } from './storage/types';

// Development fallback when Firebase isn't configured
const mockUploadImage = async (file: Blob): Promise<UploadResult> => {
  try {
    const reader = new FileReader();
    const url = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
    
    return {
      url,
      success: true
    };
  } catch (error) {
    return {
      url: '',
      success: false,
      error: 'Failed to process image in development mode'
    };
  }
};

async function compressImage(file: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      const MAX_SIZE = 800;
      let { width, height } = img;
      
      if (width > height && width > MAX_SIZE) {
        height = (height * MAX_SIZE) / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = (width * MAX_SIZE) / height;
        height = MAX_SIZE;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to compress image')),
        'image/jpeg',
        0.8
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export const uploadImage = async (
  file: Blob, 
  userId: string,
  type: 'profile' | 'task' = 'profile',
  metadata?: { taskId?: string }
): Promise<UploadResult> => {
  try {
    if (!storage) {
      console.warn('Firebase storage not initialized');
      return {
        success: false,
        error: 'Firebase storage not initialized',
        url: ''
      };
    }

    const timestamp = Date.now();
    const filename = `${type}s/${userId}/${timestamp}${metadata?.taskId ? `_${metadata.taskId}` : ''}.jpg`;
    const storageRef = ref(storage, filename);
    
    const uploadMetadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };

    console.log('Uploading image...', { filename });
    const compressedFile = await compressImage(file);
    const snapshot = await uploadBytes(storageRef, compressedFile, uploadMetadata);
    console.log('Image uploaded successfully');
    
    const url = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', url);

    return {
      success: true,
      url
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
      url: ''
    };
  }
};