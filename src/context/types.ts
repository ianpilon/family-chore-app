import { User, Task } from '../types';
import { Reward } from '../types/reward';
import { GratitudeMessage } from '../types/gratitude';

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  rewards: Reward[];
  gratitudeMessages: GratitudeMessage[];
  login: (userId: string) => void;
  logout: () => void;
  addChild: (profile: Omit<User, 'id' | 'points'>) => void;
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  assignTask: (taskId: string, userId: string) => void;
  submitForReview: (taskId: string, photoUrl?: string) => void;
  reviewTask: (taskId: string, effort: number) => void;
  recommendReward: (reward: Omit<Reward, 'id' | 'status' | 'recommendedAt' | 'pointsCost'>) => void;
  reviewReward: (rewardId: string, approved: boolean, pointsCost?: number) => void;
  claimReward: (rewardId: string) => void;
  updateUserProfile: (userId: string, updates: { name: string; avatar: string }) => void;
  sendGratitude: (message: Omit<GratitudeMessage, 'id' | 'createdAt'>) => void;
}