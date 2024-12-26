import React, { useState } from 'react';
import { Trophy, Star, Sparkles, Calendar, ArrowUp } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { getCurrentMonthRange, getCurrentWeekRange, formatDateRange } from '../utils/dateUtils';
import { ProgressBar } from './ProgressBar';
import { AchievementBadge } from './AchievementBadge';

type TimeRange = 'weekly' | 'monthly';

export function BeatYourBest() {
  const { currentUser, tasks } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');

  const currentMonth = getCurrentMonthRange();
  const currentWeek = getCurrentWeekRange();

  const calculatePoints = (range: { start: Date; end: Date }) => {
    if (!currentUser) return 0;

    return tasks
      .filter(task => 
        task.status === 'completed' &&
        task.assignedTo === currentUser.id &&
        task.review &&
        new Date(task.review.reviewedAt) >= range.start &&
        new Date(task.review.reviewedAt) <= range.end
      )
      .reduce((total, task) => {
        const basePoints = task.points;
        const effort = task.review?.effort || 3;
        const bonusPoints = Math.floor(basePoints * (effort - 3) / 2);
        return total + Math.max(basePoints + bonusPoints, Math.floor(basePoints / 2));
      }, 0);
  };

  const range = timeRange === 'monthly' ? currentMonth : currentWeek;
  const currentPoints = calculatePoints(range);
  const previousBest = timeRange === 'monthly' ? 450 : 120; // Mock data - would come from user history
  const progress = Math.min((currentPoints / previousBest) * 100, 100);
  const isNewRecord = currentPoints > previousBest;

  const achievements = [
    {
      title: 'First 100 Points',
      description: 'Earned your first 100 points',
      icon: Star,
      unlocked: currentPoints >= 100,
    },
    {
      title: 'Record Breaker',
      description: 'Beat your previous best score',
      icon: Trophy,
      unlocked: isNewRecord,
    },
    {
      title: 'Consistency King',
      description: 'Completed tasks 5 days in a row',
      icon: Sparkles,
      unlocked: true, // Mock data - would be calculated from task history
    },
  ];

  if (!currentUser || currentUser.role !== 'contributor') return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Beat Your Best!</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              timeRange === 'weekly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              timeRange === 'monthly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          {formatDateRange(range.start, range.end)}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-medium">Current Score</h3>
              <p className="text-3xl font-bold text-blue-600">{currentPoints}</p>
            </div>
            <div className="text-right">
              <h3 className="font-medium">Previous Best</h3>
              <p className="text-2xl font-semibold text-gray-600">{previousBest}</p>
            </div>
          </div>
          <ProgressBar progress={progress} isNewRecord={isNewRecord} />
          {isNewRecord && (
            <div className="mt-2 flex items-center gap-2 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="font-medium">New personal record!</span>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.title}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              unlocked={achievement.unlocked}
            />
          ))}
        </div>
      </div>
    </div>
  );
}