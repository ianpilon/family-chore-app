import { useState, useEffect } from 'react';
import { User } from '../types';

export function useProfileForm(currentUser: User | null) {
  // Initialize state with a function to ensure proper initial values
  const [formData, setFormData] = useState(() => ({
    name: currentUser?.name || '',
    avatar: currentUser?.avatar || '',
  }));
  const [previewUrl, setPreviewUrl] = useState(() => currentUser?.avatar || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        avatar: currentUser.avatar,
      });
      setPreviewUrl(currentUser.avatar);
      setIsEditing(false);
      setShowCamera(false);
      setIsSaving(false);
    }
  }, [currentUser?.id]); // Only trigger when user ID changes

  const resetForm = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        avatar: currentUser.avatar,
      });
      setPreviewUrl(currentUser.avatar);
      setIsEditing(false);
      setShowCamera(false);
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    previewUrl,
    setPreviewUrl,
    isEditing,
    setIsEditing,
    showCamera,
    setShowCamera,
    isSaving,
    setIsSaving,
    resetForm,
  };
}