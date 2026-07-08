const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Shelter = require('../models/Shelter');

/**
 * @route   GET /api/ngo
 * @desc    List shelters, vet clinics and NGOs (used for map + directory pages)
 * @access  Public
 */
exports.getShelters = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = {};
  if (type) filter.type = type;

  const shelters = await Shelter.find(filter).sort({ rating: -1 });
  res.status(200).json({ success: true, count: shelters.length, shelters });
});

exports.getShelterById = asyncHandler(async (req, res) => {
  const shelter = await Shelter.findById(req.params.id);
  if (!shelter) throw new ApiError('Shelter/NGO not found', 404);
  res.status(200).json({ success: true, shelter });
});

/**
 * @route   POST /api/ngo
 * @access  Private (NGO)
 */
exports.createShelter = asyncHandler(async (req, res) => {
  const { name, address, coords } = req.body;
  if (!name || !address || !coords || coords.lat === undefined || coords.lng === undefined) {
    throw new ApiError('name, address and coords {lat, lng} are required', 400);
  }

  const shelter = await Shelter.create({ ...req.body, managedBy: req.user._id });
  res.status(201).json({ success: true, message: 'Shelter/NGO registered', shelter });
});

exports.updateShelter = asyncHandler(async (req, res) => {
  const shelter = await Shelter.findById(req.params.id);
  if (!shelter) throw new ApiError('Shelter/NGO not found', 404);

  Object.assign(shelter, req.body);
  await shelter.save();

  res.status(200).json({ success: true, message: 'Shelter/NGO updated', shelter });
});

exports.deleteShelter = asyncHandler(async (req, res) => {
  const shelter = await Shelter.findByIdAndDelete(req.params.id);
  if (!shelter) throw new ApiError('Shelter/NGO not found', 404);
  res.status(200).json({ success: true, message: 'Shelter/NGO removed' });
});
