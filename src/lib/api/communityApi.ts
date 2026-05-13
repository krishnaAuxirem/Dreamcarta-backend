import apiClient from './client';
import type { CommunityComment, CommunityPost } from '@/types';

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asBool = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback;

const mapComment = (raw: any): CommunityComment => ({
  id: String(raw?.id ?? raw?._id ?? ''),
  author: asString(raw?.author, 'Anonymous'),
  authorAvatar: asString(raw?.authorAvatar),
  content: asString(raw?.content, ''),
  createdAt: asString(raw?.createdAt, new Date().toISOString()),
});

export const mapCommunityPostToFrontend = (raw: any): CommunityPost => ({
  id: String(raw?.id ?? raw?._id ?? ''),
  author: asString(raw?.author, 'Anonymous'),
  authorAvatar: asString(raw?.authorAvatar),
  content: asString(raw?.content, ''),
  image: asString(raw?.image),
  likes: asNumber(raw?.likes, 0),
  comments: asNumber(raw?.comments, 0),
  shares: asNumber(raw?.shares, 0),
  liked: asBool(raw?.liked, false),
  tags: Array.isArray(raw?.tags) ? raw.tags.map((item: any) => String(item)) : [],
  commentsList: Array.isArray(raw?.commentsList) ? raw.commentsList.map(mapComment) : [],
  createdAt: asString(raw?.createdAt, new Date().toISOString()),
});

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.posts)) {
    return data.posts;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

export const getCommunityPostsApi = async (): Promise<CommunityPost[]> => {
  const response = await apiClient.get('/community');
  return unwrapList(response.data).map(mapCommunityPostToFrontend);
};

export const createCommunityPostApi = async (payload: {
  content: string;
  image?: string;
  tags?: string[];
}): Promise<CommunityPost> => {
  const response = await apiClient.post('/community', payload);
  return mapCommunityPostToFrontend(response.data?.post ?? response.data);
};

export const likeCommunityPostApi = async (postId: string, action: 'like' | 'unlike' = 'like'): Promise<CommunityPost> => {
  const response = await apiClient.patch(`/community/${postId}/like`, { action });
  return mapCommunityPostToFrontend(response.data?.post ?? response.data);
};

export const commentCommunityPostApi = async (postId: string, content: string): Promise<CommunityPost> => {
  const response = await apiClient.post(`/community/${postId}/comments`, { content });
  return mapCommunityPostToFrontend(response.data?.post ?? response.data);
};