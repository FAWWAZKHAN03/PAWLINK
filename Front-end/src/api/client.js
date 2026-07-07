// Base URL of the backend API. Configure via VITE_API_URL in a .env file
// (see .env.example). Falls back to localhost:5000 for local development.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TOKEN_KEY = "pawlink_token";
const USER_KEY = "pawlink_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Turns a relative avatar path (e.g. "/uploads/avatars/x.jpg") returned by the
// backend into a full URL the <img> tag can load.
export function resolveAssetUrl(relativePath) {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  return `${API_BASE_URL}${relativePath}`;
}

/**
 * Core fetch wrapper used by every API call in the app.
 * - Prefixes API_BASE_URL
 * - Attaches the Bearer token automatically when present
 * - Parses JSON responses and throws a normalized Error on failure
 * - Supports both JSON bodies and FormData (file uploads) transparently
 */
export async function apiFetch(path, { method = "GET", body, isFormData = false, headers = {} } = {}) {
  const token = getToken();

  const finalHeaders = { ...headers };
  if (!isFormData) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      "Could not reach the server. Please check that the backend is running and VITE_API_URL is set correctly."
    );
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
