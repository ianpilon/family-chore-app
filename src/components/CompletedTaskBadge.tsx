import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompletedTaskBadgeProps {
  avatar: string;
  name: string;
}

export function CompletedTaskBadge({ avatar, name }: CompletedTaskBadgeProps) {
  return (
    <div className="absolute -top-3 -right-3 flex items-center">
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
        />
        <CheckCircle className="w-4 h-4 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
      </div>
    </div>
  );
}