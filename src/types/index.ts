import { User } from './user';

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  assignedTo?: string;
  completed: boolean;
  createdBy: string;
  category: 'chore' | 'homework' | 'hygiene' | 'other';
  dueDate?: string;
  status: 'pending' | 'in_review' | 'completed';
  recurrence?: 'daily' | 'weekly';
  lastCompleted?: string;
  completionPhoto?: string;
  reviewAssignedTo?: string; // Added to track which parent should review
  review?: {
    effort: number;
    reviewedBy: string;
    reviewedAt: string;
  };
}

export type { User };