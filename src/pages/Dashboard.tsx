import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { TaskList } from '../components/TaskList';
import { BeatYourBest } from '../components/BeatYourBest';
import { RewardList } from '../components/RewardList';
import { DashboardHeader } from '../components/DashboardHeader';
import { ReviewTaskCard } from '../components/ReviewTaskCard';
import { ReviewRewardCard } from '../components/ReviewRewardCard';
import { RecommendRewardModal } from '../components/RecommendRewardModal';
import { ReviewRewardModal } from '../components/ReviewRewardModal';
import { ProfileSettings } from './ProfileSettings';
import { GratitudeMessageForm } from '../components/GratitudeMessageForm';
import { AdminControls } from '../components/AdminControls';
import { Heart } from 'lucide-react';

export function Dashboard() {
  const { currentUser, tasks, rewards, users, logout, recommendReward, reviewReward } = useApp();
  const [activeTab, setActiveTab] = useState('tasks');
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showGratitudeForm, setShowGratitudeForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Filter tasks that this parent should review
  const tasksForReview = tasks.filter(task => 
    task.status === 'in_review' && 
    currentUser.role === 'parent' &&
    (
      (users.find(u => u.id === task.assignedTo)?.role === 'contributor') ||
      (users.find(u => u.id === task.assignedTo)?.role === 'parent' && task.reviewAssignedTo === currentUser.id)
    )
  );

  const rewardsForReview = rewards.filter(reward => 
    reward.status === 'pending' && 
    currentUser.role === 'parent'
  );

  const reviewCount = tasksForReview.length + rewardsForReview.length;

  const renderContent = () => {
    if (isAdmin) {
      return <AdminControls users={users} />;
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'tasks':
        return <TaskList 
          currentUser={currentUser} 
          pendingTasks={tasks.filter(t => t.status === 'pending')} 
          completedTasks={tasks.filter(t => t.status === 'completed')} 
        />;
      case 'review':
        if (currentUser.role !== 'parent') return null;
        return (
          <div className="grid gap-6">
            {tasksForReview.map(task => (
              <ReviewTaskCard key={task.id} task={task} />
            ))}
            {rewardsForReview.map(reward => (
              <ReviewRewardCard key={reward.id} reward={reward} />
            ))}
            {tasksForReview.length === 0 && rewardsForReview.length === 0 && (
              <p className="text-center py-12 text-gray-500">No items to review</p>
            )}
          </div>
        );
      case 'rewards':
        return (
          <RewardList
            currentUser={currentUser}
            pendingRewards={rewards.filter(r => r.status === 'pending')}
            approvedRewards={rewards.filter(r => r.status === 'approved')}
            onRecommend={() => setShowRecommendModal(true)}
            onReviewReward={setSelectedReward}
          />
        );
      case 'leaderboard':
        return <BeatYourBest />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        reviewCount={reviewCount}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modals */}
      <RecommendRewardModal
        isOpen={showRecommendModal}
        onClose={() => setShowRecommendModal(false)}
        onSubmit={recommendReward}
      />

      {selectedReward && (
        <ReviewRewardModal
          isOpen={true}
          onClose={() => setSelectedReward(null)}
          reward={selectedReward}
          onReview={reviewReward}
        />
      )}

      {selectedChild && (
        <GratitudeMessageForm
          isOpen={showGratitudeForm}
          onClose={() => {
            setShowGratitudeForm(false);
            setSelectedChild(null);
          }}
          onSubmit={console.log}
          recipientName={selectedChild.name}
        />
      )}
    </div>
  );
}