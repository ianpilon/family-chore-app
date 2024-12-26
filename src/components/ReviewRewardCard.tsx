import React from 'react';
import { Reward } from '../types/reward';
import { useApp } from '../hooks/useApp';
import { Gift, Star, User } from 'lucide-react';

interface ReviewRewardCardProps {
  reward: Reward;
}

export function ReviewRewardCard({ reward }: ReviewRewardCardProps) {
  const { users, reviewReward } = useApp();
  const claimingUser = users.find(user => user.id === reward.claimedBy);

  const handleReview = (approved: boolean) => {
    reviewReward(reward.id, approved);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {claimingUser && (
            <img
              src={claimingUser.avatar}
              alt={claimingUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{reward.title}</h3>
            <p className="text-sm text-gray-500">
              Claimed by {claimingUser?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">{reward.pointsCost} points</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">{reward.description}</p>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={() => handleReview(false)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Deny
        </button>
        <button
          onClick={() => handleReview(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Gift className="w-4 h-4" />
          Approve Reward
        </button>
      </div>
    </div>
  );
}