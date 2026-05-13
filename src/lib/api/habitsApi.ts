import { Habit } from '@/types';
import apiClient from './client';

const today = () => new Date().toISOString().split('T')[0];
const palette = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asBool = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback;

const normalizeFrequency = (value: unknown): Habit['frequency'] =>
  asString(value, 'daily').toLowerCase() === 'weekly' ? 'weekly' : 'daily';

const normalizeCompletedDates = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === 'string');
};

const resolveColor = (raw: any) => {
  const fromBackend = asString(raw?.color, '');
  if (fromBackend) {
    return fromBackend;
  }
  const seed = asNumber(raw?.id, Math.floor(Math.random() * palette.length));
  return palette[Math.abs(seed) % palette.length];
};

export const mapBackendHabitToFrontend = (raw: any): Habit => ({
  id: String(raw?.id ?? raw?._id ?? ''),
  title: asString(raw?.title, 'Untitled Habit'),
  description: asString(raw?.description, ''),
  category: asString(raw?.category, 'Mindfulness'),
  frequency: normalizeFrequency(raw?.frequency),
  streak: asNumber(raw?.streak, 0),
  completedToday: asBool(raw?.completedToday, false),
  completedDates: normalizeCompletedDates(raw?.completedDates),
  reminderTime: asString(raw?.reminderTime, ''),
  createdAt: asString(raw?.createdAt, today()),
  color: resolveColor(raw),
});

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.habits)) {
    return data.habits;
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  return [];
};

const unwrapOne = (data: any): any => data?.habit ?? data?.data ?? data;

export interface HabitPayload {
  title: string;
  description?: string;
  category: string;
  frequency: Habit['frequency'];
  reminderTime?: string;
}

export const getHabitsApi = async (): Promise<Habit[]> => {
  const response = await apiClient.get('/habits');
  return unwrapList(response.data).map(mapBackendHabitToFrontend);
};

export const createHabitApi = async (payload: HabitPayload): Promise<Habit> => {
  const response = await apiClient.post('/habits', payload);
  return mapBackendHabitToFrontend(unwrapOne(response.data));
};

export const updateHabitApi = async (id: string, payload: Partial<HabitPayload>): Promise<Habit> => {
  const response = await apiClient.put(`/habits/${id}`, payload);
  return mapBackendHabitToFrontend(unwrapOne(response.data));
};

export const deleteHabitApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/habits/${id}`);
};

export const checkInHabitApi = async (id: string): Promise<Habit> => {
  const response = await apiClient.post(`/habits/${id}/check-in`);
  return mapBackendHabitToFrontend(unwrapOne(response.data));
}; 
                                                              