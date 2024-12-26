import React from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { GratitudeMessage } from '../types/gratitude';
import { Heart, X } from 'lucide-react';

interface SwipeableGratitudeCardProps {
  message: GratitudeMessage;
  onSave: () => void;
  onDismiss: () => void;
  fromUser: { name: string; avatar: string; role: string };
}

export function SwipeableGratitudeCard({ 
  message, 
  onSave, 
  onDismiss, 
  fromUser 
}: SwipeableGratitudeCardProps) {
  const controls = useAnimation();
  const SWIPE_THRESHOLD = 100;

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD) {
      await controls.start({ x: '100%', opacity: 0 });
      onSave();
    } else if (offset < -SWIPE_THRESHOLD) {
      await controls.start({ x: '-100%', opacity: 0 });
      onDismiss();
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const isCoach = fromUser.role === 'coach';

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="relative"
    >
      {/* Swipe indicators */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-red-500/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-green-500/20 to-transparent pointer-events-none" />
      
      <div className={`bg-white rounded-lg shadow-md p-6 ${
        isCoach ? 'border-l-4 border-pink-500' : ''
      }`}>
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
                src={fromUser.avatar}
                alt={fromUser.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-500">
                From {fromUser.name}
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{message.text}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <X className="w-4 h-4" />
            Swipe left to dismiss
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            Swipe right to save
          </div>
        </div>
      </div>
    </motion.div>
  );
}