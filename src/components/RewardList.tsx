import React from 'react';
import { User } from '../types';
import { Reward } from '../types/reward';
import { RewardCard } from './RewardCard';
import { Gift } from 'lucide-react';
import { AddRewardForm } from './AddRewardForm';

interface RewardListProps {
  currentUser: User | null;
  pendingRewards: Reward[];
  approvedRewards: Reward[];
  onRecommend: () => void;
  onReviewReward: (reward: Reward) => void;
}

export function RewardList({
  currentUser,
  pendingRewards,
  approvedRewards,
  onRecommend,
  onReviewReward,
}: RewardListProps) {
  // Filter rewards based on user role
  const filteredApprovedRewards = approvedRewards.filter(reward => 
    currentUser?.role === 'parent' ? reward.forParents : !reward.forParents
  );

  return (
    <>
      {currentUser?.role === 'parent' ? (
        <AddRewardForm />
      ) : (
        <div className="mb-6">
          <button
            onClick={onRecommend}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            <Gift className="w-4 h-4" />
            Recommend New Reward
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentUser?.role === 'parent' && pendingRewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            onReview={onReviewReward}
          />
        ))}
        {filteredApprovedRewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>

      {filteredApprovedRewards.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No rewards available at the moment
        </div>
      )}
    </>
  );
}