import { mockUploadImage } from './development';
import type { UploadResult } from './types';

export async function uploadImage(file: Blob, userId: string): Promise<UploadResult> {
  // Always use development storage for now until Firebase issues are resolved
  try {
    return await mockUploadImage(file);
  } catch (error) {
    console.error('Image upload failed:', error);
    return {
      url: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    };
  }
}

export * from './types';