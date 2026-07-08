const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

/**
 * @route   POST /api/auth/register
 * @desc    Create a new user account
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, licenseId } = req.body;

  if (!name || !email || !password) {
    throw new ApiError('Name, email and password are required', 400);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError('Please provide a valid email address', 400);
  }

  if (password.length < 6) {
    throw new ApiError('Password must be at least 6 characters long', 400);
  }

  const allowedRoles = ['Citizen', 'Responder', 'NGO'];
  const finalRole = allowedRoles.includes(role) ? role : 'Citizen';

  if ((finalRole === 'Responder' || finalRole === 'NGO') && !licenseId) {
    throw new ApiError('A licensing/credential ID is required for this role', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError('An account with this email already exists', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: finalRole,
    licenseId: licenseId || '',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: user.toPublicJSON(),
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and return a token
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError('Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toPublicJSON(),
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get the currently authenticated user (used to restore session on refresh)
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toPublicJSON(),
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Stateless logout - client discards the token. Kept for a consistent API surface.
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
