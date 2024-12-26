import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../hooks/useApp';

export function AddRewardForm() {
  const { addReward, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: 50,
    category: 'privilege' as const,
    forParents: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'parent') {
      addReward({
        ...formData,
        status: 'approved',
      });
      setFormData({
        title: '',
        description: '',
        pointsCost: 50,
        category: 'privilege',
        forParents: false,
      });
      setIsOpen(false);
    }
  };

  if (currentUser?.role !== 'parent') return null;

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Reward
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Points Cost</label>
              <input
                type="number"
                value={formData.pointsCost}
                onChange={(e) => setFormData({ ...formData, pointsCost: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'privilege' | 'activity' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="privilege">Privilege</option>
                <option value="activity">Activity</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="forParents"
                checked={formData.forParents}
                onChange={(e) => setFormData({ ...formData, forParents: e.target.checked })}
                className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
              />
              <label htmlFor="forParents" className="text-sm font-medium text-gray-700">
                This is a parent reward
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600"
              >
                Add Reward
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}