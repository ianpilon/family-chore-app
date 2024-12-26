import { useState, useCallback } from 'react';
import { User, Task } from '../types';
import { Reward } from '../types/reward';
import { GratitudeMessage } from '../types/gratitude';
import { mockUsers, mockTasks, mockRewards, mockGratitudeMessages } from '../data/mockData';
import { taskActions } from '../context/taskActions';
import { rewardActions } from '../context/rewardActions';
import { AppContextType } from '../context/types';

export function useAppState(): AppContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [gratitudeMessages, setGratitudeMessages] = useState<GratitudeMessage[]>(mockGratitudeMessages);

  const login = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addChild = useCallback((profile: Omit<User, 'id' | 'points'>) => {
    const newChild: User = {
      ...profile,
      id: crypto.randomUUID(),
      points: 0,
    };
    setUsers(prev => [...prev, newChild]);
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'status'>) => {
    setTasks(prev => taskActions.addTask(prev, task));
  }, []);

  const addReward = useCallback((reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: crypto.randomUUID(),
    };
    setRewards(prev => [...prev, newReward]);
  }, []);

  const assignTask = useCallback((taskId: string, userId: string) => {
    setTasks(prev => taskActions.assignTask(prev, taskId, userId));
  }, []);

  const submitForReview = useCallback((taskId: string, photoUrl?: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      const assignedUser = users.find(u => u.id === task?.assignedTo);
      
      if (assignedUser?.role === 'parent') {
        const otherParent = users.find(u => 
          u.role === 'parent' && u.id !== assignedUser.id
        );
        
        if (otherParent) {
          return prev.map(t => 
            t.id === taskId 
              ? {
                  ...t,
                  status: 'in_review',
                  completionPhoto: photoUrl,
                  reviewAssignedTo: otherParent.id
                }
              : t
          );
        }
      }
      
      return taskActions.submitForReview(prev, taskId, photoUrl);
    });
  }, [users]);

  const reviewTask = useCallback((taskId: string, effort: number) => {
    if (!currentUser) return;
    
    const task = tasks.find(t => t.id === taskId);
    const assignedUser = users.find(u => u.id === task?.assignedTo);
    
    if (
      task?.status === 'in_review' && 
      (
        (assignedUser?.role === 'parent' && task.reviewAssignedTo === currentUser.id) ||
        (assignedUser?.role === 'contributor' && currentUser.role === 'parent')
      )
    ) {
      const result = taskActions.reviewTask(tasks, users, taskId, effort, currentUser.id);
      setTasks(result.tasks);
      setUsers(result.users);
    }
  }, [currentUser, tasks, users]);

  const recommendReward = useCallback((reward: Omit<Reward, 'id' | 'status' | 'recommendedAt' | 'pointsCost'>) => {
    if (!currentUser) return;
    setRewards(prev => rewardActions.recommendReward(prev, reward, currentUser.id));
  }, [currentUser]);

  const reviewReward = useCallback((rewardId: string, approved: boolean, pointsCost?: number) => {
    setRewards(prev => rewardActions.reviewReward(prev, rewardId, approved, pointsCost));
  }, []);

  const claimReward = useCallback((rewardId: string) => {
    if (!currentUser) return;
    const result = rewardActions.claimReward(rewards, users, rewardId, currentUser.id);
    setRewards(result.rewards);
    setUsers(result.users);
  }, [currentUser, rewards, users]);

  const updateUserProfile = useCallback((userId: string, updates: { name: string; avatar: string }) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    ));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentUser]);

  const sendGratitude = useCallback((message: Omit<GratitudeMessage, 'id' | 'createdAt'>) => {
    const newMessage: GratitudeMessage = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setGratitudeMessages(prev => [...prev, newMessage]);
  }, []);

  return {
    currentUser,
    users,
    tasks,
    rewards,
    gratitudeMessages,
    login,
    logout,
    addChild,
    addTask,
    addReward,
    assignTask,
    submitForReview,
    reviewTask,
    recommendReward,
    reviewReward,
    claimReward,
    updateUserProfile,
    sendGratitude,
  };
}