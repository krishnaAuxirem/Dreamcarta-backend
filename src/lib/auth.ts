/**
 * @deprecated Legacy local-demo auth module.
 * This file is intentionally disabled and is no longer used by the app.
 * Active auth/session wiring lives in:
 * - src/lib/auth/session.ts
 * - src/lib/api/authApi.ts
 * - src/hooks/useAuth.ts
 */

import { User } from '@/types';

const deprecatedMessage =
  'Legacy auth module is deprecated. Use useAuth + session/api layer.';

export function login(_email: string, _password: string): User | null {
  throw new Error(deprecatedMessage);
}

export function register(
  _name: string,
  _email: string,
  _password: string
): boolean {
  throw new Error(deprecatedMessage);
}

export function logout(): void {
  throw new Error(deprecatedMessage);
}

export function getCurrentUser(): User | null {
  throw new Error(deprecatedMessage);
}

export function isAuthenticated(): boolean {
  throw new Error(deprecatedMessage);
}

export function isAdmin(): boolean {
  throw new Error(deprecatedMessage);
}

export function updateUser(_updates: Partial<User>): User | null {
  throw new Error(deprecatedMessage);
}
