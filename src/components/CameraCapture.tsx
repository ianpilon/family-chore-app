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
    captureAndUpload,
    clearError,
    start,
    stop
  } = usePhotoCapture(userId);

  // Start camera when component mounts
  useEffect(() => {
    start();
  }, [start]);

  const handleCapture = async () => {
    const url = await captureAndUpload();
    if (url) {
      onImageCapture(url);
      handleClose();
    }
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Take Profile Photo</h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={clearError}
                className="text-red-700 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={!isReady || isCapturing || isUploading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 
               isCapturing ? 'Processing...' : 
               'Take Photo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}