import { get, set } from 'idb-keyval';

export const USER_STATE_KEY = 'lumina_user_state';
export const TASKS_KEY = 'lumina_tasks';
export const CARDS_KEY = 'lumina_cards';
export const STATS_KEY = 'lumina_stats';

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  avatar: string;
  background: string;
  language: 'tr' | 'en';
  theme: 'dark' | 'light' | 'contrast';
  preferredPlaylist?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  createdAt: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReview: string;
}

export const defaultUserState: UserState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString(),
  avatar: '🌱',
  background: 'bg-zinc-950',
  language: 'tr',
  theme: 'dark',
  preferredPlaylist: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZIOAPKWdaG5'
};

export async function getUserState(): Promise<UserState> {
  return (await get<UserState>(USER_STATE_KEY)) || defaultUserState;
}

export async function saveUserState(state: UserState) {
  await set(USER_STATE_KEY, state);
}

export async function getTasks(): Promise<Task[]> {
  return (await get<Task[]>(TASKS_KEY)) || [];
}

export async function saveTasks(tasks: Task[]) {
  await set(TASKS_KEY, tasks);
}

export async function getFlashcards(): Promise<Flashcard[]> {
  return (await get<Flashcard[]>(CARDS_KEY)) || [];
}

export async function saveFlashcards(cards: Flashcard[]) {
  await set(CARDS_KEY, cards);
}

export const GOALS_KEY = 'lumina_goals';

export interface Goal {
  id: string;
  title: string;
  targetHours: number;
  currentHours: number;
  deadline: string;
  category: string;
}

export async function getGoals(): Promise<Goal[]> {
  return (await get<Goal[]>(GOALS_KEY)) || [];
}

export async function saveGoals(goals: Goal[]) {
  await set(GOALS_KEY, goals);
}
