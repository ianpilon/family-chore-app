import React, { useState } from 'react';
import { GratitudeMessage } from '../types/gratitude';
import { User } from '../types';
import { SwipeableGratitudeCard } from './SwipeableGratitudeCard';
import { SavedGratitudeList } from './SavedGratitudeList';
import { useGratitudeActions } from '../hooks/useGratitudeActions';
import { useApp } from '../hooks/useApp';

interface GratitudeInboxProps {
  messages: GratitudeMessage[];
  users: User[];
}

export function GratitudeInbox({ messages, users }: GratitudeInboxProps) {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'inbox' | 'saved'>('inbox');
  const { savedMessages, saveMessage, dismissMessage } = useGratitudeActions(currentUser);
  const [visibleMessages, setVisibleMessages] = useState(messages);

  const handleSave = (message: GratitudeMessage) => {
    const fromUser = users.find(u => u.id === message.fromUserId);
    if (fromUser) {
      saveMessage(message, fromUser);
      setVisibleMessages(prev => prev.filter(m => m.id !== message.id));
    }
  };

  const handleDismiss = (messageId: string) => {
    dismissMessage(messageId);
    setVisibleMessages(prev => prev.filter(m => m.id !== messageId));
  };

  return (
    <div>
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'inbox'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Inbox
          {visibleMessages.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
              {visibleMessages.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'saved'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Saved Messages
          {savedMessages.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
              {savedMessages.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'inbox' ? (
        <div className="space-y-4">
          {visibleMessages.map(message => {
            const fromUser = users.find(u => u.id === message.fromUserId);
            if (!fromUser) return null;

            return (
              <SwipeableGratitudeCard
                key={message.id}
                message={message}
                fromUser={fromUser}
                onSave={() => handleSave(message)}
                onDismiss={() => handleDismiss(message.id)}
              />
            );
          })}

          {visibleMessages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No new messages</p>
            </div>
          )}
        </div>
      ) : (
        <SavedGratitudeList messages={savedMessages} />
      )}
    </div>
  );
}