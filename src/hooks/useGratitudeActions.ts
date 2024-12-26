import { useState } from 'react';
import { GratitudeMessage, SavedGratitude } from '../types/gratitude';
import { User } from '../types';

export function useGratitudeActions(currentUser: User | null) {
  const [savedMessages, setSavedMessages] = useState<SavedGratitude[]>(() => {
    const saved = localStorage.getItem(`gratitude-${currentUser?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const saveMessage = (message: GratitudeMessage, fromUser: User) => {
    const savedGratitude: SavedGratitude = {
      ...message,
      from: fromUser,
      savedAt: new Date().toISOString(),
    };

    setSavedMessages(prev => {
      const updated = [...prev, savedGratitude];
      localStorage.setItem(`gratitude-${currentUser?.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const dismissMessage = (messageId: string) => {
    // You could also store dismissed messages if needed
    localStorage.setItem(`dismissed-${messageId}`, 'true');
  };

  return {
    savedMessages,
    saveMessage,
    dismissMessage,
  };
}