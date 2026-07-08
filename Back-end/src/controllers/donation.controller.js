const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Donation = require('../models/Donation');

/**
 * @route   POST /api/donations
 * @desc    Create a new fundraising campaign
 * @access  Private (NGO)
 */
exports.createCampaign = asyncHandler(async (req, res) => {
  const { title, goal } = req.body;
  if (!title || !goal) throw new ApiError('title and goal are required', 400);

  const campaign = await Donation.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Campaign created', campaign });
});

/**
 * @route   GET /api/donations
 * @access  Public
 */
exports.getCampaigns = asyncHandler(async (req, res) => {
  const { category, active } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (active !== undefined) filter.isActive = active === 'true';

  const campaigns = await Donation.find(filter).sort({ createdAt: -1 });
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);

  res.status(200).json({ success: true, count: campaigns.length, totalRaised, campaigns });
});

/**
 * @route   GET /api/donations/:id
 * @access  Public
 */
exports.getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Donation.findById(req.params.id);
  if (!campaign) throw new ApiError('Campaign not found', 404);
  res.status(200).json({ success: true, campaign });
});

/**
 * @route   POST /api/donations/:id/contribute
 * @desc    Make a donation towards a campaign (guests allowed)
 * @access  Public
 */
exports.contribute = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) throw new ApiError('A valid donation amount is required', 400);

  const campaign = await Donation.findById(req.params.id);
  if (!campaign) throw new ApiError('Campaign not found', 404);
  if (!campaign.isActive) throw new ApiError('This campaign is no longer accepting donations', 400);

  campaign.contributions.push({
    user: req.user ? req.user._id : undefined,
    name: req.user ? req.user.name : 'Anonymous Backer',
    amount,
  });
  campaign.raised += amount;
  await campaign.save();

  res.status(201).json({ success: true, message: 'Thank you for your donation!', campaign });
});

/**
 * @route   GET /api/donations/history/mine
 * @access  Private
 */
exports.getMyDonations = asyncHandler(async (req, res) => {
  const campaigns = await Donation.find({ 'contributions.user': req.user._id });

  const history = [];
  campaigns.forEach((c) => {
    c.contributions
      .filter((con) => con.user && con.user.toString() === req.user._id.toString())
      .forEach((con) =>
        history.push({ campaign: c.title, amount: con.amount, date: con.createdAt, status: con.status })
      );
  });
  history.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({ success: true, count: history.length, history });
});
