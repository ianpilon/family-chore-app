import React, { useState } from 'react';
import { Modal } from './Modal';
import { Heart, Star, Users, Brain, Sparkles } from 'lucide-react';

interface GratitudeMessageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; category: string; emoji?: string }) => void;
  recipientName: string;
}

export function GratitudeMessageForm({ isOpen, onClose, onSubmit, recipientName }: GratitudeMessageFormProps) {
  const [formData, setFormData] = useState({
    text: '',
    category: 'kindness',
    emoji: '💛',
  });

  const categories = [
    { id: 'kindness', label: 'Kindness', icon: Heart, emoji: '💛' },
    { id: 'maturity', label: 'Maturity', icon: Brain, emoji: '🌟' },
    { id: 'teamwork', label: 'Teamwork', icon: Users, emoji: '🤝' },
    { id: 'other', label: 'Other', icon: Sparkles, emoji: '✨' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ text: '', category: 'kindness', emoji: '💛' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Send Gratitude to ${recipientName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you grateful for?
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            placeholder="I noticed that you..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  category: category.id,
                  emoji: category.emoji
                })}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 ${
                  formData.category === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <category.icon className={`w-5 h-5 ${
                  formData.category === category.id
                    ? 'text-blue-500'
                    : 'text-gray-500'
                }`} />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Send Gratitude
          </button>
        </div>
      </form>
    </Modal>
  );
}