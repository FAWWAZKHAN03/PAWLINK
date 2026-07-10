const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const LostFound = require('../models/LostFound');

const ALLOWED_UPDATES = [
  'title',
  'petName',
  'animalType',
  'breed',
  'color',
  'gender',
  'age',
  'description',
  'status',
  'image',
  'location',
  'latitude',
  'longitude',
  'contactName',
  'contactPhone',
  'reward',
  'verified',
];

const canManageReport = (user, report) => {
  if (!user || !report) return false;
  if (user.role === 'Admin') return true;
  if (user.role === 'Responder' || user.role === 'NGO') return true;
  return report.reportedBy && report.reportedBy.toString() === user._id.toString();
};

/**
 * @route   POST /api/lost-found
 * @access  Private
 */
exports.createReport = asyncHandler(async (req, res) => {
  const {
    title,
    petName,
    animalType,
    breed,
    color,
    gender,
    age,
    description,
    status,
    image,
    location,
    latitude,
    longitude,
    contactName,
    contactPhone,
    reward,
    verified,
  } = req.body;

  if (!title || !animalType || !description || !location || !contactName || !contactPhone) {
    throw new ApiError('title, animalType, description, location, contactName and contactPhone are required', 400);
  }

  const report = await LostFound.create({
    title,
    petName,
    animalType,
    breed,
    color,
    gender,
    age,
    description,
    status,
    image,
    location,
    latitude,
    longitude,
    contactName,
    contactPhone,
    reward,
    verified,
    reportedBy: req.user ? req.user._id : undefined,
  });

  res.status(201).json({ success: true, message: 'Lost & Found report created', report });
});

/**
 * @route   GET /api/lost-found
 * @access  Public
 */
exports.getAllReports = asyncHandler(async (req, res) => {
  const { status, animalType, search, verified } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (animalType) filter.animalType = animalType;
  if (verified !== undefined) filter.verified = verified === 'true';
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { petName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const reports = await LostFound.find(filter).populate('reportedBy', 'name email phone').sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reports.length, reports });
});

/**
 * @route   GET /api/lost-found/:id
 * @access  Public
 */
exports.getReportById = asyncHandler(async (req, res) => {
  const report = await LostFound.findById(req.params.id).populate('reportedBy', 'name email phone');
  if (!report) throw new ApiError('Lost & Found report not found', 404);

  res.status(200).json({ success: true, report });
});

/**
 * @route   GET /api/lost-found/my
 * @access  Private
 */
exports.getMyReports = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401);
  }

  const reports = await LostFound.find({ reportedBy: req.user._id })
    .populate('reportedBy', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reports.length, reports });
});

/**
 * @route   PUT /api/lost-found/:id
 * @access  Private
 */
exports.updateReport = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401);
  }

  const report = await LostFound.findById(req.params.id);
  if (!report) throw new ApiError('Lost & Found report not found', 404);

  if (!canManageReport(req.user, report)) {
    throw new ApiError('You are not authorized to update this report', 403);
  }

  const updates = {};
  ALLOWED_UPDATES.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  Object.assign(report, updates);
  await report.save();

  res.status(200).json({ success: true, message: 'Lost & Found report updated', report });
});

/**
 * @route   PUT /api/lost-found/:id/reunited
 * @access  Private
 */
exports.markAsReunited = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401);
  }

  const report = await LostFound.findById(req.params.id);
  if (!report) throw new ApiError('Lost & Found report not found', 404);

  if (!canManageReport(req.user, report)) {
    throw new ApiError('You are not authorized to update this report', 403);
  }

  report.status = 'Reunited';
  await report.save();

  res.status(200).json({ success: true, message: 'Lost & Found report marked as reunited', report });
});

/**
 * @route   DELETE /api/lost-found/:id
 * @access  Private
 */
exports.deleteReport = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError('Authentication required', 401);
  }

  const report = await LostFound.findById(req.params.id);
  if (!report) throw new ApiError('Lost & Found report not found', 404);

  if (!canManageReport(req.user, report)) {
    throw new ApiError('You are not authorized to delete this report', 403);
  }

  await report.deleteOne();
  res.status(200).json({ success: true, message: 'Lost & Found report deleted' });
});
