import React, { useState } from 'react';
import { Trophy, Medal, Calendar } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { getCurrentMonthRange, getCurrentWeekRange, formatDateRange } from '../utils/dateUtils';

type TimeRange = 'all-time' | 'monthly' | 'weekly';

export function Leaderboard() {
  const { users, tasks } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('all-time');

  const currentMonth = getCurrentMonthRange();
  const currentWeek = getCurrentWeekRange();

  const calculatePoints = (userId: string, range?: { start: Date; end: Date }) => {
    if (!range) return users.find(u => u.id === userId)?.points || 0;

    return tasks
      .filter(task => 
        task.status === 'completed' &&
        task.assignedTo === userId &&
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

  const getLeaderboardData = () => {
    const range = timeRange === 'monthly' ? currentMonth : 
                 timeRange === 'weekly' ? currentWeek : 
                 undefined;

    return users
      .filter(user => user.role === 'contributor')
      .map(user => ({
        ...user,
        periodPoints: calculatePoints(user.id, range)
      }))
      .sort((a, b) => b.periodPoints - a.periodPoints);
  };

  const leaderboardData = getLeaderboardData();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Leaderboard</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTimeRange('all-time')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              timeRange === 'all-time'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Time
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
        </div>
      </div>

      {timeRange !== 'all-time' && (
        <div className="mb-4 text-sm text-gray-500 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {timeRange === 'monthly' 
            ? formatDateRange(currentMonth.start, currentMonth.end)
            : formatDateRange(currentWeek.start, currentWeek.end)
          }
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md divide-y">
        {leaderboardData.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 relative">
                {index === 0 && (
                  <Trophy className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500" />
                )}
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {timeRange === 'all-time' ? 'Total Points' : 'Period Points'}: {user.periodPoints}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {index === 0 && <Medal className="w-6 h-6 text-yellow-500" />}
              {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
              {index === 2 && <Medal className="w-6 h-6 text-amber-600" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}