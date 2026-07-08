/**
 * src/api/auth.js
 * ---------------------------------------------------------------------------
 * Authentication API calls. Every function returns the `data` portion of
 * the backend's response envelope (or throws the normalized error object
 * from client.js on failure) - components consume plain data, not the raw
 * envelope.
 * ---------------------------------------------------------------------------
 */

import client from './client';
import { setToken, setStoredUser, clearSession } from '../utils/session';

/**
 * Registers a new account. The backend logs the user in immediately, so we
 * persist the returned token/user just like login().
 * @param {{name:string,email:string,password:string,phone?:string,role?:string}} payload
 */
export async function register(payload) {
  const { data } = await client.post('/auth/register', payload);
  setToken(data.accessToken);
  setStoredUser(data.user);
  return data.user;
}

/**
 * Logs in with email/password, persists the access token + user.
 * @param {{email:string,password:string}} payload
 */
export async function login(payload) {
  const { data } = await client.post('/auth/login', payload);
  setToken(data.accessToken);
  setStoredUser(data.user);
  return data.user;
}

/**
 * Verifies the current access token against the backend and returns the
 * fresh user object. Used on page refresh to restore/validate the session.
 * Throws (via client.js) if the token is invalid/expired and the silent
 * refresh also fails - callers should catch and treat that as "logged out".
 */
export async function getMe() {
  const { data } = await client.get('/auth/me');
  setStoredUser(data.user);
  return data.user;
}

/** Logs out the current device/session and clears local storage regardless of server outcome. */
export async function logout() {
  try {
    await client.post('/auth/logout');
  } finally {
    clearSession();
  }
}
