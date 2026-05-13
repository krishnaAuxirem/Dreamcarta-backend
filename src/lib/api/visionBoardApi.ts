import { VisionBoardItem } from '@/types';
import apiClient from './client';

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const normalizeType = (value: unknown): VisionBoardItem['type'] =>
  asString(value, 'image').toLowerCase() === 'text' ? 'text' : 'image';

export const mapBackendVisionItemToFrontend = (raw: any): VisionBoardItem => ({
  id: String(raw?.id ?? raw?._id ?? ''),
  type: normalizeType(raw?.type),
  content: asString(raw?.content, ''),
  category: asString(raw?.category, 'All'),
  x: asNumber(raw?.x, 0),
  y: asNumber(raw?.y, 0),
  width: asNumber(raw?.width, 4),
  height: asNumber(raw?.height, 3),
});

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.items)) {
    return data.items;
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  return [];
};

const unwrapOne = (data: any): any => data?.item ?? data?.data ?? data;

export interface VisionBoardItemPayload {
  type: VisionBoardItem['type'];
  content: string;
  category: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export const getVisionBoardItemsApi = async (): Promise<VisionBoardItem[]> => {
  const response = await apiClient.get('/vision-board/items');
  return unwrapList(response.data).map(mapBackendVisionItemToFrontend);
};

export const createVisionBoardItemApi = async (payload: VisionBoardItemPayload): Promise<VisionBoardItem> => {
  const response = await apiClient.post('/vision-board/items', payload);
  return mapBackendVisionItemToFrontend(unwrapOne(response.data));
};

export const updateVisionBoardItemApi = async (
  id: string,
  payload: Partial<VisionBoardItemPayload>
): Promise<VisionBoardItem> => {
  const response = await apiClient.put(`/vision-board/items/${id}`, payload);
  return mapBackendVisionItemToFrontend(unwrapOne(response.data));
};

export const deleteVisionBoardItemApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/vision-board/items/${id}`);
};
