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
    setState(prev => ({ ...prev, error, isCapturing: false, isUploading: false }));
  }, []);

  const { videoRef, isReady, start, stop } = useCamera({ onError: handleError });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const captureAndUpload = useCallback(async () => {
    if (!videoRef.current || !isReady) {
      handleError('Camera not ready');
      return null;
    }

    try {
      // Start capture phase
      setState(prev => ({ 
        ...prev, 
        isCapturing: true, 
        isUploading: false,
        error: null,
        progress: 0
      }));

      const canvas = await captureVideoFrame(videoRef.current);
      const blob = await canvasToBlob(canvas);

      // Start upload phase
      setState(prev => ({ 
        ...prev, 
        isCapturing: false,
        isUploading: true,
        error: null,
        progress: 0
      }));

      const result = await uploadImage(blob, userId, type, metadata);

      if (!result.success) {
        handleError(result.error || 'Failed to upload image');
        return null;
      }

      // Success - reset state
      setState(prev => ({ 
        ...prev, 
        isCapturing: false,
        isUploading: false,
        error: null,
        progress: 100
      }));

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process photo';
      handleError(message);
      return null;
    }
  }, [videoRef, isReady, userId, type, metadata, handleError]);

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