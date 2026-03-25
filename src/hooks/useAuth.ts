import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const result = authLogin(email, password);
    if (result) {
      setUser(result);
      return true;
    }
    return false;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const register = (name: string, email: string, password: string): boolean => {
    return authRegister(name, email, password);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
    setUser,
  };
}
