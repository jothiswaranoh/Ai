import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '../lib/mockData';
import { authApi } from '../apis/auth';
import { isTokenExpired, clearAuthSession, handleSessionExpired, STORAGE_KEY, TOKEN_KEY } from '../lib/authUtils';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isOperator: boolean;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    // Check for existing session
    const userJson = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (userJson && token) {
      if (isTokenExpired(token)) {
        clearAuthSession();
        setUser(null);
      } else {
        try {
          setUser(JSON.parse(userJson));
        } catch {
          clearAuthSession();
          setUser(null);
        }
      }
    } else {
      clearAuthSession();
      setUser(null);
    }
    setLoading(false);
  }, []);

  // Listen for auth-expired event, window focus, and cross-tab storage changes
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY || e.key === STORAGE_KEY) {
        if (!e.newValue) {
          setUser(null);
        }
      }
    };

    const checkTokenStatus = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && isTokenExpired(token)) {
        handleSessionExpired();
      }
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkTokenStatus);
    const interval = setInterval(checkTokenStatus, 60000); // Check every minute

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkTokenStatus);
      clearInterval(interval);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });

      // Store token
      localStorage.setItem(TOKEN_KEY, data.access_token);

      // The login response includes user object (based on our backend fix)
      const userData = data.user;

      // Normalize user data to match frontend User type
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        full_name: userData.name,
        role: userData.role_id === 1 ? 'admin' : 'operator',
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString(),
      };

      setUser(userObj);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      return { success: true, user: userObj };
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

  const isAdmin = user?.role === 'admin';
  const isOperator = user?.role === 'operator';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isOperator, register }}>
      {children}
    </AuthContext.Provider>
  );
}
