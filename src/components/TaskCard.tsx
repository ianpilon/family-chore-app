import React, { useState } from 'react';
import { Task } from '../types';
import { useApp } from '../hooks/useApp';
import { Star, Clock, RotateCcw } from 'lucide-react';
import { CompletedTaskBadge } from './CompletedTaskBadge';
import { TaskCompletionModal } from './TaskCompletionModal';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { currentUser, users, assignTask, submitForReview } = useApp();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const assignedUser = users.find(user => user.id === task.assignedTo);

  const handleComplete = () => {
    setShowCompletionModal(true);
  };

  const handleSubmitWithPhoto = (photoUrl: string) => {
    if (task.id) {
      submitForReview(task.id, photoUrl);
      setShowCompletionModal(false);
    }
  };

  const handleTakeTask = () => {
    if (currentUser && task.id) {
      assignTask(task.id, currentUser.id);
    }
  };

  const getStatusButton = () => {
    if (task.status === 'completed') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-500 font-medium">
            Completed by {assignedUser?.name}
          </span>
          {task.recurrence && (
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <RotateCcw className="w-4 h-4" />
              {task.recurrence === 'daily' ? 'Daily' : 'Weekly'}
            </span>
          )}
        </div>
      );
    }

    if (task.status === 'in_review') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-md">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Under Review</span>
        </div>
      );
    }

    if (task.assignedTo === currentUser?.id) {
      return (
        <button
          onClick={handleComplete}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Complete & Submit for Review
        </button>
      );
    }

    // Allow both parents and contributors to take tasks
    if (!task.assignedTo) {
      return (
        <button
          onClick={handleTakeTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Take Task
        </button>
      );
    }

    if (task.assignedTo) {
      return (
        <div className="flex items-center">
          <img
            src={assignedUser?.avatar}
            alt={assignedUser?.name}
            className="w-6 h-6 rounded-full object-cover mr-2"
          />
          <span className="text-sm text-gray-600">Assigned to {assignedUser?.name}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className={`relative bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${
        task.status === 'in_review' ? 'bg-orange-50 border border-orange-200' : ''
      }`}>
        {task.status === 'completed' && assignedUser && (
          <CompletedTaskBadge avatar={assignedUser.avatar} name={assignedUser.name} />
        )}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.recurrence && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <RotateCcw className="w-3 h-3" />
                {task.recurrence === 'daily' ? 'Daily' : 'Weekly'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{task.points}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-3">{task.description}</p>
        <div className="flex items-center justify-between">
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
          {getStatusButton()}
        </div>
      </div>

      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onSubmit={handleSubmitWithPhoto}
        taskTitle={task.title}
      />
    </>
  );
}