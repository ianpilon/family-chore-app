import React, { useState } from 'react';
import { Modal } from './Modal';
import { User } from '../types';

interface ContributorProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Omit<User, 'id' | 'points'>) => void;
}

export function ContributorProfileForm({ isOpen, onClose, onSave }: ContributorProfileFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      role: 'contributor',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Contributor Profile">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture URL
          </label>
          <input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Create Profile
          </button>
        </div>
      </form>
    </Modal>
  );
}