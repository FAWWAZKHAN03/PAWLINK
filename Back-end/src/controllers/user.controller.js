const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * @route   GET /api/users/profile
 * @desc    Get the logged-in user's full profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toPublicJSON(),
  });
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update the logged-in user's profile details
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, bio, licenseId, email } = req.body;
  const user = req.user;

  if (email && email !== user.email) {
    const emailTaken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (emailTaken) {
      throw new ApiError('That email is already in use by another account', 409);
    }
    user.email = email.toLowerCase();
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (bio !== undefined) user.bio = bio;
  if (licenseId !== undefined) user.licenseId = licenseId;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toPublicJSON(),
  });
});

/**
 * @route   PUT /api/users/password
 * @desc    Change the logged-in user's password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError('Current and new password are required', 400);
  }
  if (newPassword.length < 6) {
    throw new ApiError('New password must be at least 6 characters long', 400);
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError('Current password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

/**
 * @route   POST /api/users/avatar
 * @desc    Upload / replace the logged-in user's profile image
 * @access  Private
 */
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError('No image file was provided', 400);
  }

  const user = req.user;

  // Remove the old avatar file from disk if it exists and isn't a placeholder URL
  if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
    const oldPath = path.join(__dirname, '..', user.avatar.replace('/uploads/avatars/', 'uploads/avatars/'));
    fs.unlink(oldPath, () => {}); // best-effort, ignore errors
  }

  user.avatar = `/uploads/avatars/${req.file.filename}`;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile image updated successfully',
    user: user.toPublicJSON(),
  });
});

/**
 * @route   DELETE /api/users/avatar
 * @desc    Remove the logged-in user's profile image
 * @access  Private
 */
exports.deleteAvatar = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
    const oldPath = path.join(__dirname, '..', user.avatar.replace('/uploads/avatars/', 'uploads/avatars/'));
    fs.unlink(oldPath, () => {});
  }

  user.avatar = '';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile image removed',
    user: user.toPublicJSON(),
  });
});
