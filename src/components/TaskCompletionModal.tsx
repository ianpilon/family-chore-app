import React, { useState } from 'react';
import { Modal } from './Modal';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { CameraCapture } from './CameraCapture';

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (photoUrl: string) => void;
  taskTitle: string;
}

export function TaskCompletionModal({ isOpen, onClose, onSubmit, taskTitle }: TaskCompletionModalProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handlePhotoCapture = (url: string) => {
    setPhotoUrl(url);
    setShowCamera(false);
  };

  const handleSubmit = () => {
    if (photoUrl) {
      onSubmit(photoUrl);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Show Your Great Work!">
      <div className="space-y-4">
        <p className="text-gray-600">
          Take a quick picture of your completed task: <strong>{taskTitle}</strong>
        </p>

        {photoUrl ? (
          <div className="relative">
            <img
              src={photoUrl}
              alt="Task completion"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => setShowCamera(true)}
              className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCamera(true)}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors"
          >
            <Camera className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">Click to take a photo</span>
          </button>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!photoUrl}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              photoUrl
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Submit for Review
          </button>
        </div>
      </div>

      {showCamera && (
        <CameraCapture
          onImageCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </Modal>
  );
}