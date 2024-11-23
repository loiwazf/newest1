import React from 'react';
import { X } from 'lucide-react';
import { useQuestStore } from '../store/questStore';
import { format } from 'date-fns';

interface ArchivedQuestsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'weekly' | 'monthly';
}

export const ArchivedQuests: React.FC<ArchivedQuestsProps> = ({ isOpen, onClose, type }) => {
  const archivedQuests = useQuestStore(
    (state) => state.archivedQuests.filter((quest) => quest.type === type)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-white">
          Archived {type.charAt(0).toUpperCase() + type.slice(1)} Quests
        </h2>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {archivedQuests.map((quest) => (
            <div
              key={quest.id}
              className="p-3 bg-gray-700 rounded-lg"
            >
              <h3 className="font-medium text-white">{quest.title}</h3>
              <p className="text-sm text-gray-300">
                +{quest.xp} XP • {quest.stat}
                {quest.dueDate && ` • Due ${format(new Date(quest.dueDate), 'MMM d, yyyy')}`}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Status: {quest.completed ? 'Completed' : 'Incomplete'}
              </p>
            </div>
          ))}
          {archivedQuests.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No archived quests yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};