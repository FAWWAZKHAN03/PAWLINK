import { apiFetch, setSession, clearSession } from "./client";

export async function signup({ name, email, password, role, licenseId }) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: { name, email, password, role, licenseId },
  });
  setSession(data.token, data.user);
  return data.user;
}

export async function login({ email, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setSession(data.token, data.user);
  return data.user;
}

export async function fetchCurrentUser() {
  const data = await apiFetch("/api/auth/me", { method: "GET" });
  return data.user;
}

export function logout() {
  clearSession();
}
