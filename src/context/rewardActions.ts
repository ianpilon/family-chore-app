import { User, Reward } from '../types';

export const rewardActions = {
  recommendReward: (
    rewards: Reward[],
    reward: Omit<Reward, 'id' | 'status' | 'recommendedAt' | 'pointsCost'>,
    userId: string
  ): Reward[] => {
    const newReward: Reward = {
      ...reward,
      id: crypto.randomUUID(),
      status: 'pending',
      recommendedBy: userId,
      recommendedAt: new Date().toISOString(),
      pointsCost: 0,
    };
    return [...rewards, newReward];
  },

  reviewReward: (
    rewards: Reward[],
    rewardId: string,
    approved: boolean,
    pointsCost?: number
  ): Reward[] => {
    return rewards.map(reward => {
      if (reward.id === rewardId) {
        return {
          ...reward,
          status: approved ? 'approved' : 'denied',
          pointsCost: pointsCost || reward.pointsCost,
          reviewedAt: new Date().toISOString(),
          isNew: approved ? true : undefined,
        };
      }
      return reward;
    });
  },

  claimReward: (
    rewards: Reward[],
    users: User[],
    rewardId: string,
    userId: string
  ): { rewards: Reward[]; users: User[] } => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || !userId || reward.status !== 'approved') {
      return { rewards, users };
    }

    const user = users.find(u => u.id === userId);
    if (!user || user.points < reward.pointsCost) {
      return { rewards, users };
    }

    // Deduct points from user
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, points: u.points - reward.pointsCost } : u
    );

    // Update reward status and add claim information
    const updatedRewards = rewards.map(r =>
      r.id === rewardId
        ? {
            ...r,
            status: 'pending', // Change status to pending for parent review
            claimedBy: userId,
            claimedAt: new Date().toISOString(),
          }
        : r
    );

    return {
      rewards: updatedRewards,
      users: updatedUsers,
    };
  },

  approveClaimedReward: (
    rewards: Reward[],
    rewardId: string,
    approved: boolean
  ): Reward[] => {
    return rewards.map(reward => {
      if (reward.id === rewardId && reward.claimedBy) {
        return {
          ...reward,
          status: approved ? 'approved' : 'denied',
          reviewedAt: new Date().toISOString(),
        };
      }
      return reward;
    });
  },
};