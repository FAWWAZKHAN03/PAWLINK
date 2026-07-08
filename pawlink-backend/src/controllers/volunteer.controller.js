const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Volunteer = require('../models/Volunteer');
const Event = require('../models/Event');

/**
 * @route   GET /api/volunteers/leaderboard
 * @access  Public
 */
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await Volunteer.find()
    .populate('user', 'name avatar')
    .sort({ points: -1 })
    .limit(20);

  res.status(200).json({ success: true, leaderboard });
});

/**
 * @route   GET /api/volunteers/me
 * @desc    Get (or lazily create) the logged-in user's volunteer profile
 * @access  Private
 */
exports.getMyProfile = asyncHandler(async (req, res) => {
  let profile = await Volunteer.findOne({ user: req.user._id }).populate('missionsJoined');
  if (!profile) {
    profile = await Volunteer.create({ user: req.user._id });
  }
  res.status(200).json({ success: true, profile });
});

/**
 * @route   GET /api/volunteers/missions
 * @access  Public
 */
exports.getMissions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const missions = await Event.find(filter).sort({ date: 1 });
  res.status(200).json({ success: true, count: missions.length, missions });
});

/**
 * @route   POST /api/volunteers/missions
 * @access  Private (Responder, NGO)
 */
exports.createMission = asyncHandler(async (req, res) => {
  const { title, date, volunteersNeeded } = req.body;
  if (!title || !date || !volunteersNeeded) {
    throw new ApiError('title, date and volunteersNeeded are required', 400);
  }

  const mission = await Event.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Mission created', mission });
});

/**
 * @route   PUT /api/volunteers/missions/:id/join
 * @access  Private
 */
exports.joinMission = asyncHandler(async (req, res) => {
  const mission = await Event.findById(req.params.id);
  if (!mission) throw new ApiError('Mission not found', 404);

  if (mission.signups.some((id) => id.toString() === req.user._id.toString())) {
    throw new ApiError('You have already signed up for this mission', 409);
  }
  if (mission.signups.length >= mission.volunteersNeeded) {
    throw new ApiError('This mission is already fully staffed', 400);
  }

  mission.signups.push(req.user._id);
  if (mission.signups.length >= mission.volunteersNeeded) mission.status = 'Filled';
  await mission.save();

  let profile = await Volunteer.findOne({ user: req.user._id });
  if (!profile) profile = await Volunteer.create({ user: req.user._id });
  profile.missionsJoined.addToSet(mission._id);
  await profile.save();

  res.status(200).json({ success: true, message: 'You have joined this mission', mission });
});

/**
 * @route   PUT /api/volunteers/missions/:id/complete
 * @desc    Mark a mission completed and award points/hours to all signed-up volunteers
 * @access  Private (Responder, NGO)
 */
exports.completeMission = asyncHandler(async (req, res) => {
  const mission = await Event.findById(req.params.id);
  if (!mission) throw new ApiError('Mission not found', 404);

  mission.status = 'Completed';
  await mission.save();

  await Volunteer.updateMany(
    { user: { $in: mission.signups } },
    { $inc: { points: mission.points, rescues: 1, hours: 4 } }
  );

  res.status(200).json({ success: true, message: 'Mission marked completed and points awarded', mission });
});
