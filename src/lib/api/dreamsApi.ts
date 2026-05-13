import { Dream, DreamMilestone } from '@/types';
import apiClient from './client';

const today = () => new Date().toISOString().split('T')[0];

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asBool = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback;

const normalizeMilestones = (value: unknown): DreamMilestone[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((raw): DreamMilestone => ({
    id: String((raw as any)?.id ?? (raw as any)?._id ?? ''),
    title: asString((raw as any)?.title, 'Untitled Milestone'),
    completed: asBool((raw as any)?.completed, false),
    completedAt: asString((raw as any)?.completedAt, ''),
  }));
};

const normalizeProgress = (raw: any, milestones: DreamMilestone[]): number => {
  const directProgress = asNumber(raw?.progress, -1);
  if (directProgress >= 0) {
    return Math.max(0, Math.min(100, Math.round(directProgress)));
  }

  if (milestones.length === 0) {
    return 0;
  }

  const completedCount = milestones.filter((m) => m.completed).length;
  return Math.round((completedCount / milestones.length) * 100);
};

export const mapBackendDreamToFrontend = (raw: any): Dream => {
  const milestones = normalizeMilestones(raw?.milestones);

  return {
    id: String(raw?.id ?? raw?._id ?? ''),
    title: asString(raw?.title, 'Untitled Dream'),
    category: asString(raw?.category, 'personal'),
    progress: normalizeProgress(raw, milestones),
    deadline: asString(raw?.deadline, today()),
    milestones,
    image: asString(raw?.image, ''),
  };
};

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.dreams)) {
    return data.dreams;
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  return [];
};

const unwrapOne = (data: any): any => data?.dream ?? data?.data ?? data;

export const getDreamsApi = async (): Promise<Dream[]> => {
  const response = await apiClient.get('/dreams');
  return unwrapList(response.data).map(mapBackendDreamToFrontend);
};

export const toggleDreamMilestoneApi = async (dreamId: string, milestoneId: string): Promise<Dream> => {
  const response = await apiClient.post(`/dreams/${dreamId}/milestones/${milestoneId}/toggle`);
  return mapBackendDreamToFrontend(unwrapOne(response.data));
};
