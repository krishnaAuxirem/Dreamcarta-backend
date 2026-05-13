import apiClient from './client';

export interface MentorUser {
  id: string;
  name: string;
  email: string;
}

export interface MentorGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
}

export interface MentorAdvicePayload {
  userId: string;
  advice: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  email: string;
  expertise: string;
  bio: string;
  avatar?: string;
  followers?: number;
  rating?: number;
}

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.users)) {
    return data.users;
  }
  if (Array.isArray(data?.goals)) {
    return data.goals;
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  return [];
};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const mapUser = (raw: any): MentorUser => ({
  id: String(raw?.id ?? raw?._id ?? raw?.uid ?? ''),
  name: asString(raw?.name, 'Unknown User'),
  email: asString(raw?.email),
});

const mapGoal = (raw: any): MentorGoal => ({
  id: String(raw?.id ?? raw?._id ?? ''),
  title: asString(raw?.title, 'Untitled Goal'),
  description: asString(raw?.description, ''),
  deadline: asString(raw?.deadline, ''),
});

export const getMentorUsersApi = async (): Promise<MentorUser[]> => {
  const response = await apiClient.get('/mentor/users');
  return unwrapList(response.data).map(mapUser);
};

export const getMentorGoalsApi = async (userId: string): Promise<MentorGoal[]> => {
  const response = await apiClient.get(`/mentor/goals/${userId}`);
  return unwrapList(response.data).map(mapGoal);
};

export const submitMentorAdviceApi = async (payload: MentorAdvicePayload) => {
  const response = await apiClient.post('/mentor/advice', payload);
  return response.data;
};

export const getMentorsListApi = async (): Promise<MentorProfile[]> => {
  try {
    const response = await apiClient.get('/mentor/available');
    const mentors = unwrapList(response.data);
    return mentors.map((mentor: any) => ({
      id: String(mentor?.id ?? mentor?._id ?? ''),
      name: asString(mentor?.name, 'Mentor'),
      email: asString(mentor?.email),
      expertise: asString(mentor?.expertise || mentor?.specialization, 'General'),
      bio: asString(mentor?.bio || mentor?.description, 'Experienced mentor'),
      avatar: mentor?.avatar || `https://ui-avatars.com/api/?name=${mentor?.name}&background=6133B4&color=fff`,
      followers: mentor?.followers || 0,
      rating: mentor?.rating || 4.5,
    }));
  } catch (error) {
    console.error('Failed to fetch mentors:', error);
    return [];
  }
};
