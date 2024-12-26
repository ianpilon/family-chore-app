import React from 'react';
import { SavedGratitude } from '../types/gratitude';
import { motion } from 'framer-motion';

interface SavedGratitudeListProps {
  messages: SavedGratitude[];
}

export function SavedGratitudeList({ messages }: SavedGratitudeListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No saved gratitude messages yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Swipe right on messages you want to keep!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              message.category === 'kindness' ? 'bg-pink-100 text-pink-600' :
              message.category === 'maturity' ? 'bg-purple-100 text-purple-600' :
              message.category === 'teamwork' ? 'bg-blue-100 text-blue-600' :
              'bg-yellow-100 text-yellow-600'
            }`}>
              <span className="text-lg">{message.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={message.from.avatar}
                  alt={message.from.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-gray-500">
                  From {message.from.name}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{message.text}</p>
              <p className="text-xs text-gray-400 mt-2">
                Saved on {new Date(message.savedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}