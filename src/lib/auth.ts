import { User } from '@/types';

const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'user@demo.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    profession: 'Software Engineer',
    bio: 'Dreaming big and building bigger. Passionate about personal growth and continuous learning.',
    joinedAt: '2024-01-15',
    goals: 8,
    habits: 5,
    streak: 21,
  },
  {
    id: 'admin-1',
    name: 'Sarah Williams',
    email: 'admin@demo.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    profession: 'Platform Administrator',
    bio: 'DreamCarta platform admin. Helping dreams become reality.',
    joinedAt: '2023-06-01',
    goals: 12,
    habits: 8,
    streak: 45,
  },
];

export function login(email: string, password: string): User | null {
  const validPasswords: Record<string, string> = {
    'user@demo.com': '123456',
    'admin@demo.com': '123456',
  };

  if (validPasswords[email] === password) {
    const user = DEMO_USERS.find((u) => u.email === email);
    if (user) {
      localStorage.setItem('dc_user', JSON.stringify(user));
      return user;
    }
  }
  return null;
}

export function register(name: string, email: string, _password: string): boolean {
  const existing = DEMO_USERS.find((u) => u.email === email);
  if (existing) return false;

  const newUser: User = {
    id: 'user-' + Date.now(),
    name,
    email,
    role: 'user',
    profession: '',
    bio: '',
    joinedAt: new Date().toISOString().split('T')[0],
    goals: 0,
    habits: 0,
    streak: 0,
  };
  DEMO_USERS.push(newUser);
  return true;
}

export function logout(): void {
  localStorage.removeItem('dc_user');
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem('dc_user');
    if (stored) return JSON.parse(stored);
  } catch {
    return null;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function updateUser(updates: Partial<User>): User | null {
  const current = getCurrentUser();
  if (!current) return null;
  const updated = { ...current, ...updates };
  localStorage.setItem('dc_user', JSON.stringify(updated));
  return updated;
}
