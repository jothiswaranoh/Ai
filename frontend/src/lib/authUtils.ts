export const STORAGE_KEY = 'shamuga_user';
export const TOKEN_KEY = 'token';

/**
 * Checks whether a given JWT token string is expired.
 * Returns true if expired, invalid, or missing.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    const decoded = JSON.parse(atob(padded));

    if (typeof decoded.exp !== 'number') return false;
    // 5-second buffer to prevent edge-of-expiry race conditions
    return Date.now() >= (decoded.exp * 1000) - 5000;
  } catch {
    return true;
  }
}

/**
 * Clears authentication tokens and cached user data from storage
 * and notifies active components via a custom event.
 */
export function clearAuthSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear auth storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }
}

let isRedirecting = false;

/**
 * Clears the session and redirects the browser to /login if not already on the login page.
 */
export function handleSessionExpired(): void {
  clearAuthSession();

  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    if (!isRedirecting) {
      isRedirecting = true;
      window.location.href = '/login?expired=1';
    }
  }
}
