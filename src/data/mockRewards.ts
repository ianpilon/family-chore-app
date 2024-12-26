import { Reward } from '../types/reward';

export const mockRewards: Reward[] = [
  // Contributor rewards
  {
    id: '1',
    title: 'Extra Screen Time',
    description: '30 minutes of additional screen time',
    pointsCost: 50,
    category: 'privilege',
    status: 'approved',
    forParents: false,
  },
  {
    id: '2',
    title: 'Choose Movie Night Film',
    description: 'Pick the movie for family movie night',
    pointsCost: 75,
    category: 'privilege',
    status: 'approved',
    forParents: false,
  },
  {
    id: '3',
    title: 'Stay Up Late',
    description: 'Stay up 1 hour past bedtime',
    pointsCost: 100,
    category: 'privilege',
    status: 'approved',
    forParents: false,
  },
  // Parent rewards
  {
    id: '4',
    title: 'Date Night',
    description: 'A romantic evening out',
    pointsCost: 100,
    category: 'activity',
    status: 'approved',
    forParents: true,
  },
  {
    id: '5',
    title: 'Spa Day',
    description: 'Relaxing day at the spa',
    pointsCost: 150,
    category: 'activity',
    status: 'approved',
    forParents: true,
  },
  {
    id: '6',
    title: 'Sleep In',
    description: 'Kids handle breakfast, you sleep in',
    pointsCost: 75,
    category: 'privilege',
    status: 'approved',
    forParents: true,
  },
];