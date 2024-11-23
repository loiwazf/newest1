import React, { useEffect } from 'react';
import { CharacterPanel } from './components/CharacterPanel';
import { QuestList } from './components/QuestList';
import { useCharacterStore } from './store/characterStore';
import { useQuestStore } from './store/questStore';

function App() {
  const loadCharacter = useCharacterStore((state) => state.loadCharacter);
  const loadQuests = useQuestStore((state) => state.loadQuests);

  useEffect(() => {
    loadCharacter();
    loadQuests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">RPG Habit Tracker</h1>
        <CharacterPanel />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuestList type="daily" title="Daily Quests" />
          <QuestList type="weekly" title="Weekly Goals" />
          <QuestList type="monthly" title="Monthly Goals" />
        </div>
      </div>
    </div>
  );
}

export default App;