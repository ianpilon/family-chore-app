import React, { useState } from 'react';
import { Modal } from './Modal';
import { Reward } from '../types/reward';
import { Star } from 'lucide-react';

interface ReviewRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward;
  onReview: (rewardId: string, approved: boolean, pointsCost?: number) => void;
}

export function ReviewRewardModal({ isOpen, onClose, reward, onReview }: ReviewRewardModalProps) {
  const [pointsCost, setPointsCost] = useState(50);

  const handleReview = (approved: boolean) => {
    onReview(reward.id, approved, approved ? pointsCost : undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Reward Recommendation">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">{reward.title}</h3>
          <p className="text-gray-600 mt-1">{reward.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Category: <span className="capitalize">{reward.category}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Set Point Cost
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pointsCost}
              onChange={(e) => setPointsCost(Math.max(1, parseInt(e.target.value)))}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
            />
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={() => handleReview(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Deny
          </button>
          <button
            onClick={() => handleReview(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Approve
          </button>
        </div>
      </div>
    </Modal>
  );
}