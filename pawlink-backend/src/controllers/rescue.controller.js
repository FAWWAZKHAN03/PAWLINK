const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const RescueRequest = require('../models/RescueRequest');

const VALID_STATUSES = ['Reported', 'Verified', 'Dispatched', 'On-Site', 'Rescued', 'Vet-Care', 'Completed'];

/**
 * @route   POST /api/rescues
 * @desc    Report an animal in distress (works for guests and logged-in users)
 * @access  Public
 */
exports.createRescue = asyncHandler(async (req, res) => {
  const { reporter, reporterPhone, petType, location, coords, emergencyLevel, description, image } = req.body;

  if (!reporter || !reporterPhone || !petType || !location) {
    throw new ApiError('reporter, reporterPhone, petType and location are required', 400);
  }

  const rescue = await RescueRequest.create({
    reporter,
    reporterPhone,
    petType,
    location,
    coords,
    emergencyLevel,
    description,
    image,
    reportedBy: req.user ? req.user._id : undefined,
    timeline: [{ status: 'Reported', desc: 'Report filed via PawLink App.' }],
  });

  res.status(201).json({ success: true, message: 'Rescue request submitted', rescue });
});

/**
 * @route   GET /api/rescues
 * @access  Public
 */
exports.getRescues = asyncHandler(async (req, res) => {
  const { status, emergencyLevel } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (emergencyLevel) filter.emergencyLevel = emergencyLevel;

  const rescues = await RescueRequest.find(filter)
    .populate('assignedVolunteer', 'name phone avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: rescues.length, rescues });
});

// Route compatibility alias for routes using the older handler name.
exports.getAllRescues = exports.getRescues;

/**
 * @route   GET /api/rescues/my
 * @access  Private
 */
exports.getMyRescues = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401);
  }

  const rescues = await RescueRequest.find({ reportedBy: req.user._id })
    .populate('assignedVolunteer', 'name phone avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: rescues.length, rescues });
});

/**
 * @route   GET /api/rescues/:id
 * @access  Public
 */
exports.getRescueById = asyncHandler(async (req, res) => {
  const rescue = await RescueRequest.findById(req.params.id).populate('assignedVolunteer', 'name phone avatar');
  if (!rescue) throw new ApiError('Rescue request not found', 404);
  res.status(200).json({ success: true, rescue });
});

/**
 * @route   PUT /api/rescues/:id/assign
 * @desc    Dispatch a responder to a rescue
 * @access  Private (Responder, NGO)
 */
exports.assignRescue = asyncHandler(async (req, res) => {
  const { volunteerId } = req.body;

  const rescue = await RescueRequest.findById(req.params.id);
  if (!rescue) throw new ApiError('Rescue request not found', 404);

  rescue.assignedVolunteer = volunteerId || req.user._id;
  rescue.status = 'Dispatched';
  rescue.timeline.push({ status: 'Dispatched', desc: 'Responder assigned and en route.' });
  await rescue.save();

  res.status(200).json({ success: true, message: 'Rescue dispatched', rescue });
});

// Route compatibility aliases for alternate action names
exports.acceptRescue = exports.assignRescue;

exports.completeRescue = asyncHandler(async (req, res) => {
  const rescue = await RescueRequest.findById(req.params.id);
  if (!rescue) throw new ApiError('Rescue request not found', 404);

  rescue.status = 'Completed';
  rescue.timeline.push({ status: 'Completed', desc: 'Rescue completed and closed.' });
  await rescue.save();

  res.status(200).json({ success: true, message: 'Rescue completed', rescue });
});

exports.deleteRescue = asyncHandler(async (req, res) => {
  const rescue = await RescueRequest.findById(req.params.id);
  if (!rescue) throw new ApiError('Rescue request not found', 404);

  await rescue.deleteOne();
  res.status(200).json({ success: true, message: 'Rescue request deleted' });
});

/**
 * @route   PUT /api/rescues/:id/status
 * @desc    Update rescue status and append a timeline entry
 * @access  Private (Responder, NGO)
 */
exports.updateRescueStatus = asyncHandler(async (req, res) => {
  const { status, desc } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
  }

  const rescue = await RescueRequest.findById(req.params.id);
  if (!rescue) throw new ApiError('Rescue request not found', 404);

  rescue.status = status;
  rescue.timeline.push({ status, desc: desc || '' });
  await rescue.save();

  res.status(200).json({ success: true, message: 'Rescue status updated', rescue });
});
