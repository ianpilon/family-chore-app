import React from 'react';
import { Reward } from '../types/reward';
import { useApp } from '../hooks/useApp';
import { Gift, Star, Clock } from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
  onReview?: (reward: Reward) => void;
}

export function RewardCard({ reward, onReview }: RewardCardProps) {
  const { currentUser, claimReward } = useApp();

  const canClaim = currentUser && 
    currentUser.role === 'contributor' &&
    currentUser.points >= reward.pointsCost && 
    reward.status === 'approved' &&
    !reward.claimedBy;

  const handleClaim = () => {
    if (canClaim) {
      claimReward(reward.id);
    }
  };

  const getStatusBadge = () => {
    if (reward.status === 'pending' && !reward.claimedBy) {
      return (
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending Review
        </span>
      );
    }
    if (reward.claimedBy && reward.status === 'pending') {
      return (
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Claim Under Review
        </span>
      );
    }
    if (reward.isNew) {
      return (
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          New!
        </span>
      );
    }
    return null;
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {getStatusBadge()}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{reward.title}</h3>
        {reward.status === 'approved' && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{reward.pointsCost}</span>
          </div>
        )}
      </div>
      <p className="text-gray-600 mb-3">{reward.description}</p>
      {reward.status === 'pending' && currentUser?.role === 'parent' && onReview ? (
        <button
          onClick={() => onReview(reward)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Review Recommendation
        </button>
      ) : (
        canClaim && (
          <button
            onClick={handleClaim}
            disabled={!canClaim}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md ${
              canClaim
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            <Gift className="w-4 h-4" />
            Claim Reward
          </button>
        )
      )}
    </div>
  );
}