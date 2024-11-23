import { create } from 'zustand';
import { Quest } from '../types';
import { useCharacterStore } from './characterStore';
import { supabase } from '../lib/supabase';

interface QuestStore {
  quests: Quest[];
  archivedQuests: Quest[];
  addQuest: (quest: Omit<Quest, 'id' | 'completed'>) => Promise<void>;
  toggleQuest: (questId: string) => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
  resetDaily: () => Promise<void>;
  resetWeekly: () => Promise<void>;
  resetMonthly: () => Promise<void>;
  archiveQuests: (type: 'weekly' | 'monthly') => Promise<void>;
  loadQuests: () => Promise<void>;
}

const DEFAULT_DAILY_QUESTS = [
  { id: '1', title: 'Journal', xp: 50, completed: false, stat: 'willpower', type: 'daily' },
  { id: '2', title: 'Reading', xp: 50, completed: false, stat: 'intelligence', type: 'daily' },
  { id: '3', title: 'Design', xp: 150, completed: false, stat: 'skill', type: 'daily' },
  { id: '4', title: 'Meditation', xp: 50, completed: false, stat: 'wisdom', type: 'daily' },
  { id: '5', title: 'Workout', xp: 75, completed: false, stat: 'strength', type: 'daily' },
] as const;

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: [...DEFAULT_DAILY_QUESTS],
  archivedQuests: [],
  addQuest: async (quest) => {
    const newQuest = {
      ...quest,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
    };
    
    await supabase.from('quests').insert([newQuest]);
    const { data } = await supabase.from('quests').select('*');
    if (data) set({ quests: data });
  },
  toggleQuest: async (questId) => {
    const quest = get().quests.find(q => q.id === questId);
    if (!quest) return;

    const newCompleted = !quest.completed;
    const { addXP, addStats, removeXP, removeStats } = useCharacterStore.getState();
    
    if (newCompleted) {
      addXP(quest.xp);
      addStats(quest.stat, quest.xp * 0.01);
    } else {
      removeXP(quest.xp);
      removeStats(quest.stat, quest.xp * 0.01);
    }
    
    await supabase
      .from('quests')
      .update({ completed: newCompleted })
      .eq('id', questId);

    const { data } = await supabase.from('quests').select('*');
    if (data) set({ quests: data });
  },
  deleteQuest: async (questId) => {
    await supabase.from('quests').delete().eq('id', questId);
    const { data } = await supabase.from('quests').select('*');
    if (data) set({ quests: data });
  },
  resetDaily: async () => {
    const dailyQuests = get().quests.filter(q => q.type === 'daily');
    await supabase
      .from('quests')
      .update({ completed: false })
      .eq('type', 'daily');
    
    const { data } = await supabase.from('quests').select('*');
    if (data) set({ quests: data });
  },
  resetWeekly: async () => {
    const weeklyQuests = get().quests.filter(q => q.type === 'weekly');
    await supabase.from('archived_quests').insert(weeklyQuests);
    await supabase.from('quests').delete().eq('type', 'weekly');
    
    const { data: questsData } = await supabase.from('quests').select('*');
    const { data: archivedData } = await supabase.from('archived_quests').select('*');
    
    if (questsData && archivedData) {
      set({ 
        quests: questsData,
        archivedQuests: archivedData
      });
    }
  },
  resetMonthly: async () => {
    const monthlyQuests = get().quests.filter(q => q.type === 'monthly');
    await supabase.from('archived_quests').insert(monthlyQuests);
    await supabase.from('quests').delete().eq('type', 'monthly');
    
    const { data: questsData } = await supabase.from('quests').select('*');
    const { data: archivedData } = await supabase.from('archived_quests').select('*');
    
    if (questsData && archivedData) {
      set({ 
        quests: questsData,
        archivedQuests: archivedData
      });
    }
  },
  archiveQuests: async (type) => {
    const questsToArchive = get().quests.filter(q => q.type === type);
    await supabase.from('archived_quests').insert(questsToArchive);
    await supabase.from('quests').delete().eq('type', type);
    
    const { data: questsData } = await supabase.from('quests').select('*');
    const { data: archivedData } = await supabase.from('archived_quests').select('*');
    
    if (questsData && archivedData) {
      set({ 
        quests: questsData,
        archivedQuests: archivedData
      });
    }
  },
  loadQuests: async () => {
    const { data: questsData } = await supabase.from('quests').select('*');
    const { data: archivedData } = await supabase.from('archived_quests').select('*');
    
    if (questsData && archivedData) {
      set({ 
        quests: questsData,
        archivedQuests: archivedData
      });
    } else if (questsData) {
      set({ quests: questsData });
    }
  },
}));