import apiClient from './client';

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  profilePic?: string;
  profession?: string;
  bio?: string;
}

export interface UserSettingsPayload {
  [key: string]: unknown;
}

export const getProfileApi = async () => {
  const response = await apiClient.get('/user/profile');
  return response.data;
};

export const updateProfileApi = async (payload: UpdateProfilePayload) => {
  const response = await apiClient.put('/user/profile', payload);
  return response.data;
};

export const deleteProfileApi = async () => {
  const response = await apiClient.delete('/user/profile');
  return response.data;
};

export const getUserSettingsApi = async () => {
  const response = await apiClient.get('/user/settings');
  return response.data;
};

export const updateUserSettingsApi = async (payload: UserSettingsPayload) => {
  const response = await apiClient.put('/user/settings', payload);
  return response.data;
};
