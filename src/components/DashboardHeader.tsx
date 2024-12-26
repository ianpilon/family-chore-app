import React, { useState } from 'react';
import { User } from '../types';
import { Avatar } from './Avatar';
import { useApp } from '../hooks/useApp';
import { 
  ListTodo, 
  Star, 
  Gift, 
  Trophy,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Settings,
  Heart 
} from 'lucide-react';

interface DashboardHeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  reviewCount: number;
}

export function DashboardHeader({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  reviewCount,
}: DashboardHeaderProps) {
  const { users, login } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    ...(currentUser?.role === 'parent' ? [
      { id: 'review', label: 'Review', icon: Star, count: reviewCount }
    ] : []),
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'leaderboard', label: 'Level Up', icon: Trophy },
  ];

  const handleUserSwitch = (userId: string) => {
    login(userId);
    setIsDropdownOpen(false);
    setActiveTab('profile');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 hidden md:flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500" />
                Family Coach
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-1.5" />
                {item.label}
                {item.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="relative flex items-center gap-4">
            {currentUser?.role === 'parent' && (
              <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-purple-50 rounded-full">
                <Star className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">{currentUser.points}</span>
              </div>
            )}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              {currentUser && (
                <>
                  <Avatar
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="cursor-pointer"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 top-full">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm text-gray-500">Switch User</p>
                </div>
                {users.filter(u => u.role !== 'coach').map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSwitch(user.id)}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Avatar src={user.avatar} alt={user.name} size="sm" className="mr-2" />
                    <span className="flex-grow text-left">{user.name}</span>
                    {user.id === currentUser?.id && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </button>
                ))}
                <div className="border-t">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser?.role === 'parent' && (
              <div className="flex items-center gap-1 px-3 py-2 text-sm">
                <Star className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-purple-700">{currentUser.points} points</span>
              </div>
            )}
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md ${
                  activeTab === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
                {item.count > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}