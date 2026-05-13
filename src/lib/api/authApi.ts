import apiClient from './client';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'mentor' | 'admin';
}

interface LoginPayload {
  email: string;
  password: string;
  role?: 'user' | 'mentor' | 'admin';
}

export const registerApi = async (payload: RegisterPayload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

export const firebaseLoginApi = async (firebaseIdToken: string) => {
  const response = await apiClient.post(
    '/auth/firebase-login',
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    }
  );
  return response.data;
};
