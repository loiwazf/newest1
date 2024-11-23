export interface Quest {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  stat: 'willpower' | 'intelligence' | 'skill' | 'wisdom' | 'strength';
  type: 'daily' | 'weekly' | 'monthly';
  dueDate?: string;
}

export interface CharacterStats {
  willpower: number;
  intelligence: number;
  skill: number;
  wisdom: number;
  strength: number;
}