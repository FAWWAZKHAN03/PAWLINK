/**
 * src/api/client.js
 * ---------------------------------------------------------------------------
 * Single reusable fetch wrapper used by every API module (auth.js, user.js,
 * and any future module). Responsibilities:
 *
 *  1. Prefixes requests with the API base URL.
 *  2. Automatically attaches `Authorization: Bearer <token>` when a token
 *     is stored.
 *  3. Sends cookies (`credentials: 'include'`) so the httpOnly refresh-token
 *     cookie round-trips with every request.
 *  4. On a 401 response, tries exactly ONE silent refresh via
 *     /api/auth/refresh-token, retries the original request once, and if
 *     that still fails, clears the local session and broadcasts a
 *     `pawlink:unauthorized` window event so the app can redirect to /login
 *     without this file needing to know about React Router.
 *  5. Normalizes every error into a consistent shape:
 *       { status, message, errors, code }
 * ---------------------------------------------------------------------------
 */

import { getToken, setToken, setStoredUser, clearSession } from '../utils/session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

let refreshPromise = null; // de-dupes concurrent refresh attempts

/** Broadcasts a logout signal the rest of the app can listen for. */
function notifyUnauthorized() {
  clearSession();
  window.dispatchEvent(new CustomEvent('pawlink:unauthorized'));
}

/**
 * Calls POST /auth/refresh-token. Multiple simultaneous 401s share a single
 * in-flight refresh request instead of firing one refresh call per failed
 * request.
 */
function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Refresh failed');
        const body = await res.json();
        const accessToken = body?.data?.accessToken;
        const user = body?.data?.user;
        if (!accessToken) throw new Error('Refresh response missing token');
        setToken(accessToken);
        if (user) setStoredUser(user);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Core request function.
 * @param {string} path - e.g. '/auth/login' (leading slash required)
 * @param {Object} [options]
 * @param {string} [options.method='GET']
 * @param {Object|FormData} [options.body]
 * @param {boolean} [options.isFormData=false] - set true when body is FormData (skips JSON stringify/headers)
 * @param {boolean} [options._isRetry] - internal flag, do not pass manually
 */
async function request(path, options = {}) {
  const { method = 'GET', body, isFormData = false, _isRetry = false } = options;

  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include', // sends the httpOnly refresh-token cookie
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    // fetch() itself threw - no connectivity, DNS failure, CORS block, etc.
    throw {
      status: 0,
      message: 'Unable to reach the server. Please check your connection and try again.',
      errors: [],
      code: 'NETWORK_ERROR',
    };
  }

  // No-content success responses (e.g. some DELETE endpoints) have no JSON body.
  const rawText = await response.text();
  const data = rawText ? JSON.parse(rawText) : null;

  if (response.status === 401 && !_isRetry) {
    // Access token missing/expired - try exactly one silent refresh, then retry.
    try {
      await refreshAccessToken();
      return request(path, { ...options, _isRetry: true });
    } catch {
      notifyUnauthorized();
      throw {
        status: 401,
        message: 'Your session has expired. Please log in again.',
        errors: [],
        code: 'SESSION_EXPIRED',
      };
    }
  }

  if (response.status === 401 && _isRetry) {
    // Refresh already attempted once for this call chain and it's still 401.
    notifyUnauthorized();
    throw {
      status: 401,
      message: data?.message || 'Your session has expired. Please log in again.',
      errors: data?.errors || [],
      code: data?.code || 'SESSION_EXPIRED',
    };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || 'Something went wrong. Please try again.',
      errors: data?.errors || [],
      code: data?.code || 'REQUEST_FAILED',
    };
  }

  return data; // full envelope: { success, message, data, meta }
}

const client = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts = {}) => request(path, { method: 'PUT', body, ...opts }),
  patch: (path, body, opts = {}) => request(path, { method: 'PATCH', body, ...opts }),
  delete: (path, opts = {}) => request(path, { method: 'DELETE', ...opts }),
};

export default client;
