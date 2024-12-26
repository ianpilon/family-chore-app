import React from 'react';
import { Task, User } from '../types';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { Heart } from 'lucide-react';
import { GratitudeMessageForm } from './GratitudeMessageForm';
import { useApp } from '../hooks/useApp';

interface TaskListProps {
  currentUser: User | null;
  pendingTasks: Task[];
  completedTasks: Task[];
}

export function TaskList({ currentUser, pendingTasks, completedTasks }: TaskListProps) {
  const [showGratitudeForm, setShowGratitudeForm] = React.useState(false);
  const [selectedRecipient, setSelectedRecipient] = React.useState<User | null>(null);
  const { users, sendGratitude } = useApp();
  
  if (!currentUser) return null;

  const parents = users.filter(user => 
    user.role === 'parent' && user.id !== currentUser.id
  );
  const contributors = users.filter(user => 
    user.role === 'contributor' && user.id !== currentUser.id
  );

  // For contributors, show:
  // 1. Tasks assigned to them (including in_review status)
  // 2. Available tasks (no assignee)
  // 3. Their completed tasks
  const visibleTasks = currentUser.role === 'contributor'
    ? [
        ...pendingTasks.filter(task => 
          task.assignedTo === currentUser.id || 
          (!task.assignedTo && task.status === 'pending')
        ),
        ...completedTasks.filter(task => task.assignedTo === currentUser.id)
      ]
    : [...pendingTasks, ...completedTasks];

  // Sort tasks: in-review first, then pending, then completed
  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (a.status === 'in_review' && b.status !== 'in_review') return -1;
    if (b.status === 'in_review' && a.status !== 'in_review') return 1;
    if (a.status === 'pending' && b.status === 'completed') return -1;
    if (b.status === 'pending' && a.status === 'completed') return 1;
    return 0;
  });

  const handleSendGratitude = (data: { text: string; category: string; emoji?: string }) => {
    if (!currentUser || !selectedRecipient) return;
    
    sendGratitude({
      text: data.text,
      fromUserId: currentUser.id,
      toUserId: selectedRecipient.id,
      category: data.category as 'kindness' | 'maturity' | 'teamwork' | 'other',
      emoji: data.emoji,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        {currentUser.role === 'parent' && <AddTaskForm />}
        <div className="flex flex-wrap gap-2">
          {/* Parents can thank other parents */}
          {currentUser.role === 'parent' && parents.map((parent) => (
            <button
              key={parent.id}
              onClick={() => {
                setSelectedRecipient(parent);
                setShowGratitudeForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Thank {parent.name}
            </button>
          ))}
          
          {/* Parents can thank contributors */}
          {currentUser.role === 'parent' && contributors.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setSelectedRecipient(child);
                setShowGratitudeForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Thank {child.name}
            </button>
          ))}
          
          {/* Contributors can thank parents and other contributors */}
          {currentUser.role === 'contributor' && (
            <>
              {/* Thank parents */}
              {parents.map((parent) => (
                <button
                  key={parent.id}
                  onClick={() => {
                    setSelectedRecipient(parent);
                    setShowGratitudeForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Thank {parent.name}
                </button>
              ))}
              {/* Thank other contributors */}
              {contributors.map((contributor) => (
                <button
                  key={contributor.id}
                  onClick={() => {
                    setSelectedRecipient(contributor);
                    setShowGratitudeForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Thank {contributor.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tasks available at the moment
        </div>
      )}

      {selectedRecipient && (
        <GratitudeMessageForm
          isOpen={showGratitudeForm}
          onClose={() => {
            setShowGratitudeForm(false);
            setSelectedRecipient(null);
          }}
          onSubmit={handleSendGratitude}
          recipientName={selectedRecipient.name}
        />
      )}
    </div>
  );
}