import { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../lib/mockData';
import { authApi } from '../apis/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isOperator: boolean;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'shamuga_user';
const TOKEN_KEY = 'token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const userJson = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (userJson && token) {
      try {
        setUser(JSON.parse(userJson));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });

      // Store token
      localStorage.setItem(TOKEN_KEY, data.access_token);

      // The login response includes user object (based on our backend fix)
      const userData = data.user;

      // Normalize user data to match frontend User type
      const user: User = {
        id: userData.id,
        email: userData.email,
        full_name: userData.name,
        role: userData.role_id === 1 ? 'admin' : 'operator',
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString(),
      };

      setUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return { success: true, user };
    } catch (err: any) {
      console.error("Login failed", err);
      return { success: false, error: err.detail || 'Invalid email or password' };
    }
  };

  const register = async (data: any) => {
    try {
      await authApi.register(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isOperator = user?.role === 'operator';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isOperator, register }}>
      {children}
    </AuthContext.Provider>
  );
}
