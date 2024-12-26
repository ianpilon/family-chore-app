import React from 'react';
import { Modal } from './Modal';
import { User } from '../types';
import { useApp } from '../hooks/useApp';

interface TaskAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

export function TaskAssignModal({ isOpen, onClose, taskId }: TaskAssignModalProps) {
  const { users, assignTask } = useApp();
  const contributors = users.filter(user => user.role === 'contributor');

  const handleAssign = (userId: string) => {
    assignTask(taskId, userId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Who wants to do this task?"
    >
      <div className="grid gap-4">
        {contributors.map((contributor) => (
          <button
            key={contributor.id}
            onClick={() => handleAssign(contributor.id)}
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={contributor.avatar}
              alt={contributor.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="ml-3 font-medium">{contributor.name}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}