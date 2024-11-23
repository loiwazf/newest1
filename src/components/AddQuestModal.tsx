import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Quest } from '../types';
import { useQuestStore } from '../store/questStore';

interface AddQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  questType: Quest['type'];
}

export const AddQuestModal: React.FC<AddQuestModalProps> = ({ isOpen, onClose, questType }) => {
  const addQuest = useQuestStore((state) => state.addQuest);
  const [formData, setFormData] = useState({
    title: '',
    xp: 50,
    stat: 'willpower' as Quest['stat'],
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuest({
      ...formData,
      type: questType,
    });
    onClose();
    setFormData({ title: '', xp: 50, stat: 'willpower', dueDate: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-white">
          Add {questType.charAt(0).toUpperCase() + questType.slice(1)} Quest
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md input"
              required
            />
          </div>

          <div>
            <label htmlFor="xp" className="block text-sm font-medium text-gray-200">
              XP Reward
            </label>
            <input
              type="number"
              id="xp"
              value={formData.xp}
              onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md input"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="stat" className="block text-sm font-medium text-gray-200">
              Related Stat
            </label>
            <select
              id="stat"
              value={formData.stat}
              onChange={(e) => setFormData({ ...formData, stat: e.target.value as Quest['stat'] })}
              className="mt-1 block w-full rounded-md select"
            >
              <option value="willpower">Willpower</option>
              <option value="intelligence">Intelligence</option>
              <option value="skill">Skill</option>
              <option value="wisdom">Wisdom</option>
              <option value="strength">Strength</option>
            </select>
          </div>

          {questType !== 'daily' && (
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-200">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1 block w-full rounded-md input"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};