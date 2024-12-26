import { useState, useCallback } from 'react';
import { useCamera } from './useCamera';
import { captureVideoFrame, canvasToBlob } from '../utils/imageProcessing';
import { uploadImage } from '../services/storage';

interface PhotoCaptureState {
  isCapturing: boolean;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export function usePhotoCapture(
  userId: string,
  type: 'profile' | 'task' = 'profile',
  metadata?: { taskId?: string }
) {
  const [state, setState] = useState<PhotoCaptureState>({
    isCapturing: false,
    isUploading: false,
    error: null,
    progress: 0
  });
  
  const handleError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const { videoRef, isReady, start, stop } = useCamera({ onError: handleError });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const captureAndUpload = useCallback(async () => {
    if (!videoRef.current || !isReady) {
      setState(prev => ({ 
        ...prev, 
        error: 'Camera not ready',
        isCapturing: false,
        isUploading: false,
        progress: 0
      }));
      return null;
    }

    try {
      // Capture phase
      setState(prev => ({ 
        ...prev, 
        isCapturing: true, 
        isUploading: false,
        error: null,
        progress: 0
      }));

      const canvas = await captureVideoFrame(videoRef.current);
      const blob = await canvasToBlob(canvas);

      // Upload phase
      setState(prev => ({ 
        ...prev, 
        isCapturing: false,
        isUploading: true,
        progress: 0
      }));

      const result = await uploadImage(blob, userId, type, metadata);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to upload image');
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process photo';
      setState(prev => ({ 
        ...prev, 
        error: message,
        isCapturing: false,
        isUploading: false,
        progress: 0
      }));
      return null;
    } finally {
      setState(prev => ({ 
        ...prev, 
        isCapturing: false, 
        isUploading: false,
        progress: 0
      }));
    }
  }, [videoRef, isReady, userId, type, metadata]);

  return {
    videoRef,
    isReady,
    ...state,
    captureAndUpload,
    clearError,
    start,
    stop
  };
}