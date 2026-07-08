/**
 * src/api/user.js
 * ---------------------------------------------------------------------------
 * Profile / password / avatar API calls (Users module).
 * ---------------------------------------------------------------------------
 */

import client from './client';
import { setStoredUser } from '../utils/session';

/** GET /users/profile */
export async function getProfile() {
  const { data } = await client.get('/users/profile');
  setStoredUser(data.user);
  return data.user;
}

/**
 * PUT /users/profile
 * @param {{name?:string, phone?:string, address?:string, bio?:string, licenseId?:string}} updates
 */
export async function updateProfile(updates) {
  const { data } = await client.put('/users/profile', updates);
  setStoredUser(data.user);
  return data.user;
}

/**
 * PUT /users/password
 * @param {{currentPassword:string, newPassword:string, confirmPassword:string}} payload
 */
export async function changePassword(payload) {
  const { message } = await client.put('/users/password', payload);
  return message;
}

/**
 * POST /users/avatar
 * @param {File} file - the image file selected by the user
 */
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await client.post('/users/avatar', formData, { isFormData: true });
  setStoredUser(data.user);
  return data.user;
}

/** DELETE /users/avatar */
export async function removeAvatar() {
  const { data } = await client.delete('/users/avatar');
  setStoredUser(data.user);
  return data.user;
}
