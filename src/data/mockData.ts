import { User } from '../types';
import { GratitudeMessage } from '../types/gratitude';
import { FamilyCoach } from '../services/FamilyCoach';
import { mockTasks } from './mockTasks';
import { mockRewards } from './mockRewards';

// Add admin user to mockUsers array
export const mockUsers: User[] = [
  {
    id: 'admin',
    name: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'admin',
    points: 0,
  },
  {
    ...FamilyCoach.getCoachProfile(),
    points: 0
  },
  {
    id: '1',
    name: 'Anita',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'parent',
    points: 100,
  },
  {
    id: '2',
    name: 'Ian',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    role: 'parent',
    points: 80,
  },
  {
    id: '3',
    name: 'Brooklyn',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'contributor',
    points: 120,
  },
  {
    id: '4',
    name: 'Celine',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'contributor',
    points: 90,
  },
  {
    id: '5',
    name: 'Vanessa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'contributor',
    points: 150,
  },
];

// Add initial coach messages
export const mockGratitudeMessages: GratitudeMessage[] = [
  {
    id: 'coach-1',
    text: "Welcome to your family journey! Remember, every small effort counts, and celebrating each other's wins helps everyone feel supported. What's one thing you're grateful for about a family member today?",
    fromUserId: FamilyCoach.getCoachProfile().id,
    toUserId: '1', // Anita
    category: 'teamwork',
    emoji: '💫',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'coach-2',
    text: "You're the glue holding this amazing team together! Your dedication to making this family thrive is inspiring. Remember, even small actions have a big impact.",
    fromUserId: FamilyCoach.getCoachProfile().id,
    toUserId: '2', // Ian
    category: 'maturity',
    emoji: '🌟',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'coach-3',
    text: "Your creativity and energy make such a difference in this family! Keep sharing your unique perspective - it helps everyone grow.",
    fromUserId: FamilyCoach.getCoachProfile().id,
    toUserId: '3', // Brooklyn
    category: 'kindness',
    emoji: '✨',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'coach-4',
    text: "Remember, progress over perfection! Each task you complete is a step towards your goals. You're doing great!",
    fromUserId: FamilyCoach.getCoachProfile().id,
    toUserId: '4', // Celine
    category: 'maturity',
    emoji: '🌱',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'coach-5',
    text: "Your commitment to helping the family is amazing! Keep up that wonderful team spirit - it's making a real difference.",
    fromUserId: FamilyCoach.getCoachProfile().id,
    toUserId: '5', // Vanessa
    category: 'teamwork',
    emoji: '🤝',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  // Original messages
  {
    id: '1',
    text: "Thank you for helping your sister with her homework today. Your patience and kindness really showed!",
    fromUserId: '1', // Anita
    toUserId: '3', // Brooklyn
    category: 'kindness',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    emoji: '💛',
  },
  {
    id: '2',
    text: "I noticed how you took initiative to clean up after dinner without being asked. That shows great maturity!",
    fromUserId: '2', // Ian
    toUserId: '4', // Celine
    category: 'maturity',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    emoji: '🌟',
  },
  {
    id: '3',
    text: "Thanks for being such a supportive partner and handling the morning routine so I could sleep in.",
    fromUserId: '1', // Anita
    toUserId: '2', // Ian
    category: 'teamwork',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    emoji: '🤝',
  },
];

export { mockTasks, mockRewards };