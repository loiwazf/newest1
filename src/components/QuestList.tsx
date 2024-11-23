import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Plus, RotateCcw, Archive } from 'lucide-react';
import { Quest } from '../types';
import { useQuestStore } from '../store/questStore';
import { AddQuestModal } from './AddQuestModal';
import { format } from 'date-fns';
import { ArchivedQuests } from './ArchivedQuests';

interface QuestListProps {
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
}

export const QuestList: React.FC<QuestListProps> = ({ type, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const quests = useQuestStore((state) => 
    state.quests.filter((quest) => quest.type === type)
  );
  const { toggleQuest, deleteQuest, resetDaily, resetWeekly, resetMonthly } = useQuestStore();

  const handleReset = () => {
    switch (type) {
      case 'daily':
        resetDaily();
        break;
      case 'weekly':
        resetWeekly();
        break;
      case 'monthly':
        resetMonthly();
        break;
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex space-x-2">
          {type !== 'daily' && (
            <button
              onClick={() => setShowArchive(true)}
              className="btn btn-secondary"
            >
              <Archive className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleReset}
            className="btn btn-danger"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleQuest(quest.id)}
                className="text-white hover:text-blue-400"
              >
                {quest.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div>
                <h3 className="font-medium text-white">{quest.title}</h3>
                <p className="text-sm text-gray-300">
                  +{quest.xp} XP • {quest.stat}
                  {quest.dueDate && ` • Due ${format(new Date(quest.dueDate), 'MMM d, yyyy')}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => deleteQuest(quest.id)}
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {quests.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No {type} quests yet. Add one to get started!
          </div>
        )}
      </div>

      <AddQuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        questType={type}
      />

      <ArchivedQuests
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        type={type as 'weekly' | 'monthly'}
      />
    </div>
  );
};