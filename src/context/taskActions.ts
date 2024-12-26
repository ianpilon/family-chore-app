import { Task, User } from '../types';

export const taskActions = {
  addTask: (
    tasks: Task[],
    task: Omit<Task, 'id' | 'status'>
  ): Task[] => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      status: 'pending',
    };
    return [...tasks, newTask];
  },

  assignTask: (
    tasks: Task[],
    taskId: string,
    userId: string
  ): Task[] => {
    return tasks.map(task =>
      task.id === taskId ? { ...task, assignedTo: userId } : task
    );
  },

  submitForReview: (
    tasks: Task[],
    taskId: string,
    photoUrl?: string
  ): Task[] => {
    return tasks.map(task =>
      task.id === taskId 
        ? { 
            ...task, 
            status: 'in_review',
            completionPhoto: photoUrl,
          }
        : task
    );
  },

  reviewTask: (
    tasks: Task[],
    users: User[],
    taskId: string,
    effort: number,
    reviewerId: string
  ): { tasks: Task[]; users: User[] } => {
    let updatedUsers = [...users];
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const basePoints = task.points;
        const bonusPoints = Math.floor(basePoints * (effort - 3) / 2);
        const totalPoints = Math.max(basePoints + bonusPoints, Math.floor(basePoints / 2));

        if (task.assignedTo) {
          updatedUsers = updatedUsers.map(user =>
            user.id === task.assignedTo
              ? { ...user, points: user.points + totalPoints }
              : user
          );
        }

        return {
          ...task,
          status: 'completed',
          review: {
            effort,
            reviewedBy: reviewerId,
            reviewedAt: new Date().toISOString(),
          },
        };
      }
      return task;
    });

    return { tasks: updatedTasks, users: updatedUsers };
  },
};