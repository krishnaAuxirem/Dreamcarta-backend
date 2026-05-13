import apiClient from './client';

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

export interface ActivityUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ActivityRecord {
  id: string;
  userId: number;
  type: string;
  description: string;
  user: ActivityUser;
  createdAt: string;
  metadata: any;
}

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.activities)) {
    return data.activities;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

export const mapActivityRecordToFrontend = (raw: any): ActivityRecord => ({
  id: String(raw?.id ?? raw?._id ?? `${raw?.type ?? 'activity'}-${Date.now()}`),
  userId: asNumber(raw?.userId ?? raw?.user?.id, 0),
  type: asString(raw?.type, 'activity'),
  description: asString(raw?.description ?? raw?.action, 'Activity event'),
  user: {
    id: asNumber(raw?.user?.id ?? raw?.userId, 0),
    name: asString(raw?.user?.name ?? raw?.name, 'Unknown User'),
    email: asString(raw?.user?.email ?? raw?.email, ''),
    role: asString(raw?.user?.role ?? raw?.role, 'user'),
  },
  createdAt: asString(raw?.createdAt ?? raw?.timestamp, new Date().toISOString()),
  metadata: raw?.metadata ?? raw ?? {},
});

export const getAllActivityApi = async (type?: string, limit = 100): Promise<ActivityRecord[]> => {
  const params: Record<string, string | number> = { limit };
  if (type) {
    params.type = type;
  }

  const response = await apiClient.get('/activity/all', {
    params,
    __noRetry: true,
  } as any);

  return unwrapList(response.data).map(mapActivityRecordToFrontend);
};

export const getUserActivityApi = async (userId: string | number, limit = 100): Promise<ActivityRecord[]> => {
  const response = await apiClient.get(`/activity/user/${userId}`, {
    params: { limit },
    __noRetry: true,
  } as any);

  return unwrapList(response.data).map(mapActivityRecordToFrontend);
};

export const getUserMentionsApi = async (): Promise<ActivityRecord[]> => {
  const response = await apiClient.get('/activity/mentions/my');
  return unwrapList(response.data).map(mapActivityRecordToFrontend);
};

export const markMentionAsReadApi = async (mentionId: string) => {
  const response = await apiClient.patch(`/activity/mentions/${mentionId}/read`);
  return response.data;
};