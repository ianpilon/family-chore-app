import React from 'react';
import { animalAvatars } from '../data/avatars';
import { Check } from 'lucide-react';

interface AvatarSelectorProps {
  selected: string;
  onSelect: (url: string) => void;
}

export function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {animalAvatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar.url)}
          className="relative group"
        >
          <div className={`
            relative rounded-lg overflow-hidden border-2 transition-all
            ${selected === avatar.url 
              ? 'border-blue-500 ring-2 ring-blue-200' 
              : 'border-gray-200 hover:border-blue-200'}
          `}>
            <img
              src={avatar.url}
              alt={avatar.name}
              className="w-full h-32 object-cover"
            />
            {selected === avatar.url && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-center text-gray-600">{avatar.name}</p>
        </button>
      ))}
    </div>
  );
}