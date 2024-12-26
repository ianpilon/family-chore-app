import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadImage } from '../services/storage';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  userId: string;
}

export function FileUpload({ onUploadComplete, userId }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setIsUploading(true);

    // Create preview immediately
    createPreview(file);

    try {
      const result = await uploadImage(file, userId);
      if (!result.success || !result.url) {
        throw new Error(result.error || 'Upload failed');
      }
      onUploadComplete(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload profile photo"
        />
        <button
          type="button"
          className={`w-full px-4 py-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg ${
            isUploading 
              ? 'bg-gray-100 border-gray-300 text-gray-400'
              : 'border-blue-300 text-blue-500 hover:bg-blue-50'
          }`}
        >
          <Upload className="w-5 h-5" />
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
      
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}