import { get, set } from 'idb-keyval';
import { auth, db, OperationType, handleFirestoreError } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

import { Language } from './i18n';

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
  language: Language;
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

// Help helper to fetch collection list from Firestore or IDB
async function fetchCollectionList<T>(collectionName: string, idbKey: string): Promise<T[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    return (await get<T[]>(idbKey)) || [];
  }
  const path = `users/${uid}/${collectionName}`;
  try {
    const colRef = collection(db, 'users', uid, collectionName);
    const querySnapshot = await getDocs(colRef);
    const items: T[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push(docSnap.data() as T);
    });
    // Cache locally
    await set(idbKey, items);
    return items;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

// Help helper to sync collection list to Firestore and save locally
async function syncCollectionList<T extends { id: string }>(
  collectionName: string,
  idbKey: string,
  items: T[],
  cleaner?: (item: T) => any
): Promise<void> {
  // First save locally under key
  await set(idbKey, items);

  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const path = `users/${uid}/${collectionName}`;
  try {
    const colRef = collection(db, 'users', uid, collectionName);
    // 1. Get existing items IDs from Firestore
    const querySnapshot = await getDocs(colRef);
    const existingIds = new Set<string>();
    querySnapshot.forEach((docSnap) => existingIds.add(docSnap.id));

    // 2. Write active items
    const activeIds = new Set(items.map((item) => item.id));
    for (const item of items) {
      const docRef = doc(db, 'users', uid, collectionName, item.id);
      const cleaned: any = cleaner ? cleaner(item) : { ...item };
      
      // Enforce absolute strict fields structure validation
      if (cleaned.priority === undefined) {
        delete cleaned.priority;
      }
      
      await setDoc(docRef, cleaned);
    }

    // 3. Delete obsolete ones
    for (const existingId of existingIds) {
      if (!activeIds.has(existingId)) {
        const docRef = doc(db, 'users', uid, collectionName, existingId);
        await deleteDoc(docRef);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserState(): Promise<UserState> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    return (await get<UserState>(USER_STATE_KEY)) || defaultUserState;
  }
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as UserState;
      await set(USER_STATE_KEY, data);
      return data;
    } else {
      // First initialization for authenticated user
      const defaultStateWithCorrectTime = {
        ...defaultUserState,
        lastActive: new Date().toISOString()
      };
      await setDoc(docRef, defaultStateWithCorrectTime);
      await set(USER_STATE_KEY, defaultStateWithCorrectTime);
      return defaultStateWithCorrectTime;
    }
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserState(state: UserState) {
  await set(USER_STATE_KEY, state);

  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const cleaned = {
      xp: Math.max(0, state.xp || 0),
      level: Math.max(1, state.level || 1),
      streak: Math.max(0, state.streak || 0),
      lastActive: state.lastActive || new Date().toISOString(),
      avatar: state.avatar || '🌱',
      background: state.background || 'bg-zinc-950',
      theme: state.theme || 'dark',
      language: state.language || 'tr',
    } as any;
    if (state.preferredPlaylist) {
      cleaned.preferredPlaylist = state.preferredPlaylist;
    }
    await setDoc(docRef, cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getTasks(): Promise<Task[]> {
  return fetchCollectionList<Task>('tasks', TASKS_KEY);
}

export async function saveTasks(tasks: Task[]) {
  await syncCollectionList<Task>('tasks', TASKS_KEY, tasks, (task) => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    duration: Math.max(0, task.duration || 0),
    completed: !!task.completed,
    createdAt: task.createdAt || new Date().toISOString(),
    ...(task.priority ? { priority: task.priority } : {})
  }));
}

export async function getFlashcards(): Promise<Flashcard[]> {
  return fetchCollectionList<Flashcard>('flashcards', CARDS_KEY);
}

export async function saveFlashcards(cards: Flashcard[]) {
  await syncCollectionList<Flashcard>('flashcards', CARDS_KEY, cards, (card) => ({
    id: card.id,
    question: card.question,
    answer: card.answer,
    interval: Math.max(0, card.interval || 0),
    repetition: Math.max(0, card.repetition || 0),
    easeFactor: Math.max(0, card.easeFactor || 2.5),
    nextReview: card.nextReview || new Date().toISOString()
  }));
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
  return fetchCollectionList<Goal>('goals', GOALS_KEY);
}

export async function saveGoals(goals: Goal[]) {
  await syncCollectionList<Goal>('goals', GOALS_KEY, goals, (goal) => ({
    id: goal.id,
    title: goal.title,
    targetHours: Math.max(0, goal.targetHours || 0),
    currentHours: Math.max(0, goal.currentHours || 0),
    deadline: goal.deadline || new Date().toISOString(),
    category: goal.category || 'General'
  }));
}

