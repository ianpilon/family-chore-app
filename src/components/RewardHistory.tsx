import React from 'react';
import { useApp } from '../hooks/useApp';
import { Gift, Clock, CheckCircle, XCircle } from 'lucide-react';

interface RewardHistoryProps {
  userId: string;
}

export function RewardHistory({ userId }: RewardHistoryProps) {
  const { rewards, users } = useApp();
  const user = users.find(u => u.id === userId);

  // Filter rewards based on user role and claims
  const userRewards = rewards.filter(reward => {
    if (user?.role === 'parent') {
      return reward.forParents && reward.claimedBy === userId;
    }
    return !reward.forParents && reward.claimedBy === userId;
  }).sort((a, b) => {
    const dateA = new Date(a.claimedAt || 0);
    const dateB = new Date(b.claimedAt || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Reward History</h2>
      
      <div className="space-y-4">
        {userRewards.length === 0 ? (
          <div className="text-center py-8">
            <img 
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200"
              alt="Growing Plant"
              className="mx-auto w-32 h-32 rounded-full object-cover mb-4"
            />
            <p className="text-gray-500">
              {user?.role === 'parent' 
                ? "No rewards claimed yet. Take time to enjoy some well-deserved treats!"
                : "No rewards claimed yet. Start earning points and claim some rewards!"}
            </p>
          </div>
        ) : (
          userRewards.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  reward.status === 'approved' ? 'bg-green-100' :
                  reward.status === 'denied' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  {reward.status === 'approved' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : reward.status === 'denied' ? (
                    <XCircle className="w-6 h-6 text-red-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{reward.title}</h3>
                  <p className="text-sm text-gray-500">
                    {reward.claimedAt && new Date(reward.claimedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{reward.pointsCost} points</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}