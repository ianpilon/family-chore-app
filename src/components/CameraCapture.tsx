import React, { useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { usePhotoCapture } from '../hooks/usePhotoCapture';

interface CameraCaptureProps {
  onImageCapture: (url: string) => void;
  onClose: () => void;
  userId: string;
}

export function CameraCapture({ onImageCapture, onClose, userId }: CameraCaptureProps) {
  const {
    videoRef,
    isReady,
    isCapturing,
    isUploading,
    error,
    progress,
    captureAndUpload,
    clearError,
    start,
    stop
  } = usePhotoCapture(userId, 'profile');

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  const handleCapture = async () => {
    const result = await captureAndUpload();
    if (result?.success && result.url) {
      onImageCapture(result.url);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Take Profile Photo</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover mirror"
              playsInline
              muted
            />
            {(isCapturing || isUploading) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="mb-2">{isCapturing ? 'Capturing...' : 'Uploading...'}</p>
                  {isUploading && (
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleCapture}
              disabled={!isReady || isCapturing || isUploading}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}