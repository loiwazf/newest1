import { create } from 'zustand';
import { CharacterStats } from '../types';
import { supabase } from '../lib/supabase';

interface Character {
  name: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  stats: CharacterStats;
}

interface CharacterStore {
  character: Character;
  setCharacter: (character: Character) => void;
  addXP: (amount: number) => void;
  removeXP: (amount: number) => void;
  addStats: (stat: keyof CharacterStats, amount: number) => void;
  removeStats: (stat: keyof CharacterStats, amount: number) => void;
  saveCharacter: () => Promise<void>;
  loadCharacter: () => Promise<void>;
}

const calculateRequiredXP = (level: number) => {
  return Math.floor(200 * Math.pow(2, level - 1));
};

const DEFAULT_CHARACTER = {
  name: "Maedre",
  level: 1,
  currentXP: 0,
  requiredXP: 200,
  stats: {
    willpower: 1,
    intelligence: 1,
    skill: 1,
    wisdom: 1,
    strength: 1,
  },
};

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  character: DEFAULT_CHARACTER,
  setCharacter: (character) => set({ character }),
  addXP: (amount) => {
    set((state) => {
      const newXP = state.character.currentXP + amount;
      let newLevel = state.character.level;
      let currentXP = newXP;

      while (currentXP >= state.character.requiredXP && newLevel < 80) {
        currentXP -= state.character.requiredXP;
        newLevel++;
      }

      const updatedCharacter = {
        ...state.character,
        level: newLevel,
        currentXP: currentXP,
        requiredXP: calculateRequiredXP(newLevel),
      };

      get().saveCharacter();
      return { character: updatedCharacter };
    });
  },
  removeXP: (amount) => {
    set((state) => {
      const updatedCharacter = {
        ...state.character,
        currentXP: Math.max(0, state.character.currentXP - amount),
      };
      get().saveCharacter();
      return { character: updatedCharacter };
    });
  },
  addStats: (stat, amount) => {
    set((state) => {
      const updatedCharacter = {
        ...state.character,
        stats: {
          ...state.character.stats,
          [stat]: Math.min(100, state.character.stats[stat] + amount),
        },
      };
      get().saveCharacter();
      return { character: updatedCharacter };
    });
  },
  removeStats: (stat, amount) => {
    set((state) => {
      const updatedCharacter = {
        ...state.character,
        stats: {
          ...state.character.stats,
          [stat]: Math.max(1, state.character.stats[stat] - amount),
        },
      };
      get().saveCharacter();
      return { character: updatedCharacter };
    });
  },
  saveCharacter: async () => {
    const character = get().character;
    await supabase
      .from('characters')
      .upsert({ id: 1, ...character })
      .eq('id', 1);
  },
  loadCharacter: async () => {
    const { data } = await supabase
      .from('characters')
      .select('*')
      .eq('id', 1)
      .single();

    if (data) {
      set({ character: data });
    } else {
      await get().saveCharacter();
    }
  },
}));