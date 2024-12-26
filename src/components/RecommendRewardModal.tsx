import React, { useState } from 'react';
import { Modal } from './Modal';
import { Gift } from 'lucide-react';

interface RecommendRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; category: 'privilege' | 'activity' }) => void;
}

export function RecommendRewardModal({ isOpen, onClose, onSubmit }: RecommendRewardModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'privilege' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', category: 'privilege' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recommend a New Reward">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What reward would you like?
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Extra TV time, Choose dinner menu"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why would this be a good reward?
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Explain why you'd like this reward..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as 'privilege' | 'activity' })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="privilege">Privilege</option>
            <option value="activity">Activity</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
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
            <Gift className="w-4 h-4" />
            Submit Recommendation
          </button>
        </div>
      </form>
    </Modal>
  );
}