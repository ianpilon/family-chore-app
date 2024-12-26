import React from 'react';
import { useApp } from '../hooks/useApp';
import { Gift, Heart, Camera } from 'lucide-react';
import { RewardHistory } from '../components/RewardHistory';
import { GratitudeInbox } from '../components/GratitudeInbox';
import { useProfileForm } from '../hooks/useProfileForm';
import { AvatarSelector } from '../components/AvatarSelector';
import { CameraCapture } from '../components/CameraCapture';

export function ProfileSettings() {
  const { currentUser, users, gratitudeMessages, updateUserProfile } = useApp();
  const {
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    showCamera,
    setShowCamera,
    resetForm
  } = useProfileForm(currentUser);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUserProfile(currentUser.id, formData);
      setIsEditing(false);
    }
  };

  const handleImageCapture = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setShowCamera(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-32 h-32 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`;
                    }}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Camera className="w-4 h-4" />
                  Take New Photo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`;
                }}
              />
            </div>
            <h3 className="text-xl font-semibold">{currentUser.name}</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <RewardHistory userId={currentUser.id} />
      
      <GratitudeInbox
        messages={gratitudeMessages.filter(m => m.toUserId === currentUser.id)}
        users={users}
      />

      {showCamera && (
        <CameraCapture
          onImageCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
          userId={currentUser.id}
        />
      )}
    </div>
  );
}