const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Animal = require('../models/Animal');
const RescueRequest = require('../models/RescueRequest');
const Donation = require('../models/Donation');
const AdoptionRequest = require('../models/AdoptionRequest');

/**
 * @route   GET /api/admin/stats
 * @desc    Aggregate dashboard stats across the whole platform
 * @access  Private (NGO)
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [userCount, animalCount, activeRescues, completedRescues, campaigns, pendingAdoptions] = await Promise.all([
    User.countDocuments(),
    Animal.countDocuments(),
    RescueRequest.countDocuments({ status: { $ne: 'Completed' } }),
    RescueRequest.countDocuments({ status: 'Completed' }),
    Donation.find(),
    AdoptionRequest.countDocuments({ status: 'Pending' }),
  ]);

  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);

  res.status(200).json({
    success: true,
    stats: { userCount, animalCount, activeRescues, completedRescues, totalRaised, pendingAdoptions },
  });
});

/**
 * @route   GET /api/admin/users
 * @access  Private (NGO)
 */
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users: users.map((u) => u.toPublicJSON()) });
});
