import React, { useState } from 'react';
import { Task } from '../types';
import { useApp } from '../hooks/useApp';
import { Star, ThumbsUp, ThumbsDown, Camera, Calendar, Clock } from 'lucide-react';

interface ReviewTaskCardProps {
  task: Task;
}

export function ReviewTaskCard({ task }: ReviewTaskCardProps) {
  const { users, reviewTask } = useApp();
  const [effort, setEffort] = useState(3);
  const assignedUser = users.find(user => user.id === task.assignedTo);

  const handleReview = () => {
    reviewTask(task.id, effort);
  };

  const isParentTask = assignedUser?.role === 'parent';
  const submissionDate = task.completionPhoto ? new Date() : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={assignedUser?.avatar}
            alt={assignedUser?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
          />
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-500">Completed by {assignedUser?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">{task.points} points</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{task.description}</p>

      {task.completionPhoto && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>Completion Photo</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{submissionDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{submissionDate?.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <img
            src={task.completionPhoto}
            alt="Task completion"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate {isParentTask ? "Partner's" : "Contributor's"} Effort
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setEffort(value)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  effort === value
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } transition-all`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            {effort <= 2 && <ThumbsDown className="w-4 h-4 text-red-500" />}
            {effort >= 4 && <ThumbsUp className="w-4 h-4 text-green-500" />}
            {effort <= 2 && 'Needs improvement'}
            {effort === 3 && 'Met expectations'}
            {effort >= 4 && 'Excellent effort!'}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleReview}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            Approve & Award Points
          </button>
        </div>
      </div>
    </div>
  );
}