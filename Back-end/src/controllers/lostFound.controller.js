const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const LostPet = require('../models/LostPet');
const FoundPet = require('../models/FoundPet');

/**
 * @route   POST /api/lost-found/lost
 * @access  Public (attaches reportedBy if logged in)
 */
exports.reportLost = asyncHandler(async (req, res) => {
  const { lastSeen, date, owner, phone, type } = req.body;
  if (!lastSeen || !date || !owner || !phone || !type) {
    throw new ApiError('type, lastSeen, date, owner and phone are required', 400);
  }

  const lostPet = await LostPet.create({ ...req.body, reportedBy: req.user ? req.user._id : undefined });
  res.status(201).json({ success: true, message: 'Lost pet report created', lostPet });
});

/**
 * @route   POST /api/lost-found/found
 * @access  Public
 */
exports.reportFound = asyncHandler(async (req, res) => {
  const { foundLocation, date, finder, phone, type } = req.body;
  if (!foundLocation || !date || !finder || !phone || !type) {
    throw new ApiError('type, foundLocation, date, finder and phone are required', 400);
  }

  const foundPet = await FoundPet.create({ ...req.body, reportedBy: req.user ? req.user._id : undefined });
  res.status(201).json({ success: true, message: 'Found pet report created', foundPet });
});

/**
 * @route   GET /api/lost-found/lost
 * @access  Public
 */
exports.getLostPets = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type.toLowerCase();

  const lostPets = await LostPet.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: lostPets.length, lostPets });
});

/**
 * @route   GET /api/lost-found/found
 * @access  Public
 */
exports.getFoundPets = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type.toLowerCase();

  const foundPets = await FoundPet.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: foundPets.length, foundPets });
});

exports.getLostPetById = asyncHandler(async (req, res) => {
  const lostPet = await LostPet.findById(req.params.id);
  if (!lostPet) throw new ApiError('Lost pet report not found', 404);
  res.status(200).json({ success: true, lostPet });
});

exports.getFoundPetById = asyncHandler(async (req, res) => {
  const foundPet = await FoundPet.findById(req.params.id);
  if (!foundPet) throw new ApiError('Found pet report not found', 404);
  res.status(200).json({ success: true, foundPet });
});

/**
 * @route   PUT /api/lost-found/lost/:id/reunited
 * @access  Private
 */
exports.markLostReunited = asyncHandler(async (req, res) => {
  const lostPet = await LostPet.findById(req.params.id);
  if (!lostPet) throw new ApiError('Lost pet report not found', 404);
  lostPet.status = 'Reunited';
  await lostPet.save();
  res.status(200).json({ success: true, message: 'Marked as reunited', lostPet });
});

/**
 * @route   PUT /api/lost-found/found/:id/reunited
 * @access  Private
 */
exports.markFoundReunited = asyncHandler(async (req, res) => {
  const foundPet = await FoundPet.findById(req.params.id);
  if (!foundPet) throw new ApiError('Found pet report not found', 404);
  foundPet.status = 'Reunited';
  await foundPet.save();
  res.status(200).json({ success: true, message: 'Marked as reunited', foundPet });
});
