import { Goal } from '@/types';
import apiClient from './client';

const today = () => new Date().toISOString().split('T')[0];

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const normalizeCategory = (value: unknown): Goal['category'] => {
  const raw = asString(value, 'personal').toLowerCase();
  const allowed: Goal['category'][] = ['career', 'health', 'finance', 'education', 'travel', 'relationships', 'personal'];
  return (allowed.includes(raw as Goal['category']) ? raw : 'personal') as Goal['category'];
};

const normalizeType = (value: unknown): Goal['type'] => {
  const raw = asString(value, 'short-term').toLowerCase();
  return raw === 'long-term' ? 'long-term' : 'short-term';
};

const normalizeStatus = (value: unknown): Goal['status'] => {
  const raw = asString(value, 'active').toLowerCase();
  if (raw === 'completed' || raw === 'paused') {
    return raw;
  }
  return 'active';
};

const normalizeSteps = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((step): step is string => typeof step === 'string');
};

export const mapBackendGoalToFrontend = (raw: any): Goal => ({
  id: String(raw?.id ?? raw?._id ?? ''),
  title: asString(raw?.title, 'Untitled Goal'),
  description: asString(raw?.description, ''),
  category: normalizeCategory(raw?.category),
  type: normalizeType(raw?.type),
  deadline: asString(raw?.deadline, today()),
  progress: asNumber(raw?.progress, 0),
  steps: normalizeSteps(raw?.steps),
  status: normalizeStatus(raw?.status),
  createdAt: asString(raw?.createdAt, today()),
});

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.goals)) {
    return data.goals;
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  return [];
};

const unwrapOne = (data: any): any => data?.goal ?? data?.data ?? data;

export interface GoalPayload {
  title: string;
  description?: string;
  category: Goal['category'];
  type: Goal['type'];
  deadline: string;
  progress?: number;
  steps?: string[];
  status?: Goal['status'];
}

export const getGoalsApi = async (): Promise<Goal[]> => {
  const response = await apiClient.get('/goals');
  return unwrapList(response.data).map(mapBackendGoalToFrontend);
};

export const getGoalByIdApi = async (id: string): Promise<Goal> => {
  const response = await apiClient.get(`/goals/${id}`);
  return mapBackendGoalToFrontend(unwrapOne(response.data));
};

export const createGoalApi = async (payload: GoalPayload): Promise<Goal> => {
  const response = await apiClient.post('/goals', payload);
  return mapBackendGoalToFrontend(unwrapOne(response.data));
};

export const updateGoalApi = async (id: string, payload: Partial<GoalPayload>): Promise<Goal> => {
  const response = await apiClient.put(`/goals/${id}`, payload);
  return mapBackendGoalToFrontend(unwrapOne(response.data));
};

export const deleteGoalApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/goals/${id}`);
};
