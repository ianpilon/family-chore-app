import { useRef, useState, useCallback, useEffect } from 'react';

interface UseCameraOptions {
  onError?: (error: string) => void;
  facingMode?: 'user' | 'environment';
}

export function useCamera({ onError, facingMode = 'user' }: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const mountedRef = useRef(true);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream first
      stopCamera();

      // Request camera access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Check if component is still mounted
      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return;
          
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current!.play();
              if (mountedRef.current) {
                setIsReady(true);
                resolve();
              }
            } catch (err) {
              onError?.('Failed to start video preview');
            }
          };
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access camera';
      console.error('Camera initialization error:', message);
      onError?.(message);
      setIsReady(false);
    }
  }, [onError, facingMode, stopCamera]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isReady,
    start: startCamera,
    stop: stopCamera
  };
}