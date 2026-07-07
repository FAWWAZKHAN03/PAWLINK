import { apiFetch } from "./client";

export async function getProfile() {
  const data = await apiFetch("/api/users/profile", { method: "GET" });
  return data.user;
}

export async function updateProfile({ name, email, phone, address, bio, licenseId }) {
  const data = await apiFetch("/api/users/profile", {
    method: "PUT",
    body: { name, email, phone, address, bio, licenseId },
  });
  return data.user;
}

export async function updatePassword({ currentPassword, newPassword }) {
  return apiFetch("/api/users/password", {
    method: "PUT",
    body: { currentPassword, newPassword },
  });
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const data = await apiFetch("/api/users/avatar", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
  return data.user;
}

export async function deleteAvatar() {
  const data = await apiFetch("/api/users/avatar", { method: "DELETE" });
  return data.user;
}
