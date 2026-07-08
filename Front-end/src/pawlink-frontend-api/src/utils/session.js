/**
 * src/utils/session.js
 * ---------------------------------------------------------------------------
 * Thin localStorage wrapper for the JWT access token and the cached user
 * object. Kept as small pure functions (no React) so both api/client.js and
 * any component can import them without a dependency cycle.
 *
 * NOTE: the refresh token itself is NOT stored here - it lives only in the
 * httpOnly cookie set by the backend and is never touched by JS.
 * ---------------------------------------------------------------------------
 */

const TOKEN_KEY = 'pawlink_access_token';
const USER_KEY = 'pawlink_user';

// ── Access token ─────────────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Cached user object ───────────────────────────────────────────────────
export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted cache entry - treat as "no user" rather than throwing.
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user) {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem(USER_KEY);
}

/** Clears the entire local session (token + cached user) in one call. */
export function clearSession() {
  removeToken();
  removeStoredUser();
}
