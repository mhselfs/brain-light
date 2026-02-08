
export type HabitType = string;

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredDays: number;
}

export interface HabitData {
  id: string;
  name: string;
  icon: string;
  color: string;
  startDate: string;
  completions: string[]; // ISO date strings (YYYY-MM-DD)
  streakCount: number;
  achievements: Achievement[];
}

export interface AppState {
  habits: HabitData[];
  activeHabitId: string | null;
}

export const PRESET_HABITS = [
  { name: 'Reading', icon: '📚', color: 'indigo' },
  { name: 'Gym', icon: '💪', color: 'rose' },
  { name: 'Social Media', icon: '📵', color: 'amber' },
  { name: 'Focus', icon: '🧠', color: 'blue' }
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Step', description: 'Begin your journey.', icon: '🌱', requiredDays: 1 },
  { id: '2', title: 'Momentum', description: 'Getting in the groove.', icon: '🔥', requiredDays: 3 },
  { id: '3', title: 'Mastery', description: 'A full week of focus.', icon: '📚', requiredDays: 7 },
  { id: '4', title: 'Routine', description: 'Discipline becomes habit.', icon: '💳', requiredDays: 21 },
  { id: '5', title: 'Iron Will', description: '50 days of dedication.', icon: '🕹️', requiredDays: 50 },
  { id: '6', title: 'Legendary', description: '100 days of absolute grit.', icon: '🏆', requiredDays: 100 },
];
