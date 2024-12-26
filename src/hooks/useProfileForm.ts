import { useState, useEffect } from 'react';
import { User } from '../types';

interface ProfileFormData {
  name: string;
  avatar: string;
}

export function useProfileForm(user: User | null) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    avatar: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const resetForm = () => {
    if (user) {
      setFormData({
        name: user.name,
        avatar: user.avatar || ''
      });
    }
  };

  return {
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    showCamera,
    setShowCamera,
    resetForm
  };
}