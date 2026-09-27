import { createContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
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

const checkIsAdmin = (u: any): boolean => {
  if (!u) return false;
  if (u.role_id === 1 || u.role_id === '1') return true;
  const roleIdStr = String(u.role_id || '').toLowerCase();
  if (roleIdStr === 'admin' || roleIdStr === 'administrator') return true;
  const roleStr = String(u.role || '').toLowerCase();
  if (roleStr === 'admin' || roleStr === 'administrator') return true;
  return false;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<User | null>(null);

  // Keep ref in sync so event handlers always see the latest user
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  /**
   * Re-fetch /users/me and update the local user if role or active status changed.
   * - Role change → hard reload to the correct dashboard (clean slate, no stale state)
   * - Deactivated → force logout
   * - Name change only → silent state update (no reload needed)
   */
  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || isTokenExpired(token)) return;

    try {
      const profile: any = await authApi.getProfile();
      const currentUser = userRef.current;
      if (!currentUser) return;

      // Force logout if account was deactivated
      if (profile.is_active === false) {
        clearAuthSession();
        setUser(null);
        window.location.href = '/login?reason=deactivated';
        return;
      }

      const isProfileAdmin = checkIsAdmin(profile);
      const newRole: 'admin' | 'operator' = isProfileAdmin ? 'admin' : 'operator';
      const newName: string = profile.name || currentUser.full_name;

      // If role changed → persist new user data and hard-reload to correct dashboard
      // This ensures a completely clean component tree with no stale state
      if (newRole !== currentUser.role) {
        const updatedUser: User = {
          ...currentUser,
          full_name: newName,
          role: newRole,
          updated_at: profile.updated_at || new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

        // Hard navigate so all components re-mount fresh with the correct role
        const targetPath = newRole === 'admin' ? '/admin' : '/dashboard';
        window.location.href = targetPath;
        return;
      }

      // Name-only change → silent update, no reload needed
      if (newName !== currentUser.full_name) {
        const updatedUser: User = {
          ...currentUser,
          full_name: newName,
          updated_at: profile.updated_at || new Date().toISOString(),
        };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      }
    } catch {
      // Silently ignore network errors during background refresh
    }
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

  // ── Role-change detection: poll /users/me ─────────────────────────────────
  useEffect(() => {
    // Refresh on window focus (tab switch / coming back to the window)
    const handleFocus = () => refreshProfile();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshProfile();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // Also poll every 2 minutes while the tab is active
    const pollInterval = setInterval(refreshProfile, 2 * 60 * 1000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(pollInterval);
    };
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });

      // Store token
      localStorage.setItem(TOKEN_KEY, data.access_token);

      // The login response includes user object (based on our backend fix)
      const userData = data.user;

      // Normalize user data to match frontend User type
      const isLoginAdmin = checkIsAdmin(userData);
      const userObj: User = {
        id: userData.id || userData._id,
        email: userData.email,
        full_name: userData.name || userData.full_name || (userData.email ? userData.email.split('@')[0] : 'User'),
        role: isLoginAdmin ? 'admin' : 'operator',
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

  const isAdmin = checkIsAdmin(user);
  const isOperator = !isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isOperator, register }}>
      {children}
    </AuthContext.Provider>
  );
}
