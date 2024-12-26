import React from 'react';
import { User } from '../types';
import { useApp } from '../hooks/useApp';
import { Users } from 'lucide-react';

interface AdminControlsProps {
  users: User[];
}

export function AdminControls({ users }: AdminControlsProps) {
  const { login } = useApp();

  const nonAdminUsers = users.filter(u => u.role !== 'admin' && u.role !== 'coach');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold">View As User</h2>
      </div>
      
      <div className="grid gap-2">
        {nonAdminUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => login(user.id)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left w-full"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500 capitalize">{user.role}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}