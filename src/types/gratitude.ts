import { User } from './user';

export interface GratitudeMessage {
  id: string;
  text: string;
  fromUserId: string;
  toUserId: string;
  category: 'kindness' | 'maturity' | 'teamwork' | 'other';
  createdAt: string;
  emoji?: string;
  saved?: boolean;
  dismissed?: boolean;
}

export interface SavedGratitude extends GratitudeMessage {
  from: User;
  savedAt: string;
}