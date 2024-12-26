import React from 'react';
import { LucideIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
}

export function AchievementBadge({
  title,
  description,
  icon: Icon,
  unlocked,
}: AchievementBadgeProps) {
  return (
    <motion.div
      className={`relative p-4 rounded-lg border-2 ${
        unlocked
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 bg-gray-50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full ${
            unlocked ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {!unlocked && (
          <Lock className="w-4 h-4 text-gray-400 absolute top-2 right-2" />
        )}
      </div>
    </motion.div>
  );
}