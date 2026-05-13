import { User } from '@/types';

const AUTH_TOKEN_KEY = 'auth_token';
const LEGACY_AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_CHANGED_EVENT = 'auth-changed';
const AUTH_UNAUTHORIZED_EVENT = 'auth-unauthorized';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(LEGACY_AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem(AUTH_USER_KEY);
};

export const emitAuthChanged = (): void => {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const saveSession = (token: string, user: User): void => {
  setAuthToken(token);
  setStoredUser(user);
  emitAuthChanged();
};

export const clearSession = (): void => {
  clearAuthToken();
  clearStoredUser();
  emitAuthChanged();
};

export const AUTH_CHANGED_EVENT_NAME = AUTH_CHANGED_EVENT;
export const AUTH_UNAUTHORIZED_EVENT_NAME = AUTH_UNAUTHORIZED_EVENT;

export const emitUnauthorized = (): void => {
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

export const mapBackendUserToFrontend = (rawUser: any): User => {
  const now = new Date().toISOString().split('T')[0];
  const normalizedRole = String(rawUser?.role ?? '')
    .trim()
    .toLowerCase();

  const mappedRole = normalizedRole === 'admin'
    ? 'admin'
    : normalizedRole === 'mentor'
      ? 'mentor'
      : 'user';

  return {
    id: String(rawUser?.id ?? rawUser?.uid ?? ''),
    name: rawUser?.name ?? 'User',
    email: rawUser?.email ?? '',
    role: mappedRole,
    avatar: rawUser?.profilePic || rawUser?.avatar || undefined,
    profession: rawUser?.profession || '',
    bio: rawUser?.bio || '',
    joinedAt: rawUser?.createdAt ? String(rawUser.createdAt).split('T')[0] : now,
    goals: Number(rawUser?.goals ?? 0),
    habits: Number(rawUser?.habits ?? 0),
    streak: Number(rawUser?.streak ?? 0),
  };
};
