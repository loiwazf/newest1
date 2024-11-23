import React from 'react';
import { Shield, Brain, Sparkles, Book, Dumbbell } from 'lucide-react';
import { useCharacterStore } from '../store/characterStore';

export const CharacterPanel = () => {
  const character = useCharacterStore((state) => state.character);
  const xpPercentage = (character.currentXP / character.requiredXP) * 100;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">{character.name}</h2>
          <p className="text-gray-400">Level {character.level}</p>
        </div>
        <div className="bg-gray-700 px-4 py-2 rounded-full">
          <span className="font-mono text-white">LVL {character.level}/80</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2 text-gray-300">
          <span>XP Progress</span>
          <span>{character.currentXP}/{character.requiredXP}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<Shield className="w-6 h-6" />} name="Willpower" value={character.stats.willpower} />
        <StatCard icon={<Brain className="w-6 h-6" />} name="Intelligence" value={character.stats.intelligence} />
        <StatCard icon={<Sparkles className="w-6 h-6" />} name="Skill" value={character.stats.skill} />
        <StatCard icon={<Book className="w-6 h-6" />} name="Wisdom" value={character.stats.wisdom} />
        <StatCard icon={<Dumbbell className="w-6 h-6" />} name="Strength" value={character.stats.strength} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, name, value }: { icon: React.ReactNode; name: string; value: number }) => (
  <div className="bg-gray-700 p-3 rounded-lg text-center">
    <div className="flex justify-center mb-2 text-blue-400">{icon}</div>
    <div className="text-sm text-gray-300">{name}</div>
    <div className="font-bold text-white">{value}</div>
  </div>
);