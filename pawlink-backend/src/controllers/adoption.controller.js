const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Animal = require('../models/Animal');
const AdoptionRequest = require('../models/AdoptionRequest');

/**
 * @route   GET /api/adoption/animals
 * @desc    List animals available for adoption, with optional filters
 * @access  Public
 */
exports.getAnimals = asyncHandler(async (req, res) => {
  const { type, status, search } = req.query;
  const filter = {};
  if (type) filter.type = type.toLowerCase();
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const animals = await Animal.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: animals.length, animals });
});

/**
 * @route   GET /api/adoption/animals/:id
 * @access  Public
 */
exports.getAnimalById = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id).populate('shelter', 'name address phone');
  if (!animal) throw new ApiError('Animal not found', 404);
  res.status(200).json({ success: true, animal });
});

/**
 * @route   POST /api/adoption/animals
 * @desc    List a new animal for adoption
 * @access  Private (Responder, NGO)
 */
exports.createAnimal = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    throw new ApiError('name and type are required', 400);
  }

  const animal = await Animal.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, message: 'Animal listed successfully', animal });
});

/**
 * @route   PUT /api/adoption/animals/:id
 * @access  Private (Responder, NGO)
 */
exports.updateAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) throw new ApiError('Animal not found', 404);

  Object.assign(animal, req.body);
  await animal.save();

  res.status(200).json({ success: true, message: 'Animal updated', animal });
});

/**
 * @route   DELETE /api/adoption/animals/:id
 * @access  Private (Responder, NGO)
 */
exports.deleteAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndDelete(req.params.id);
  if (!animal) throw new ApiError('Animal not found', 404);
  res.status(200).json({ success: true, message: 'Animal removed' });
});

/**
 * @route   POST /api/adoption/requests
 * @desc    Submit an adoption request for an animal
 * @access  Private
 */
exports.createAdoptionRequest = asyncHandler(async (req, res) => {
  const { animalId, message, contactPhone } = req.body;
  if (!animalId) throw new ApiError('animalId is required', 400);

  const animal = await Animal.findById(animalId);
  if (!animal) throw new ApiError('Animal not found', 404);
  if (animal.status !== 'Available') {
    throw new ApiError('This animal is not currently available for adoption', 400);
  }

  const existing = await AdoptionRequest.findOne({ animal: animalId, applicant: req.user._id });
  if (existing) throw new ApiError('You have already requested to adopt this animal', 409);

  const request = await AdoptionRequest.create({
    animal: animalId,
    applicant: req.user._id,
    message,
    contactPhone,
  });

  animal.status = 'Pending';
  await animal.save();

  res.status(201).json({ success: true, message: 'Adoption request submitted', request });
});

/**
 * @route   GET /api/adoption/requests
 * @desc    Citizens see their own requests; Responders/NGO see all
 * @access  Private
 */
exports.getAdoptionRequests = asyncHandler(async (req, res) => {
  const filter = ['Responder', 'NGO'].includes(req.user.role) ? {} : { applicant: req.user._id };

  const requests = await AdoptionRequest.find(filter)
    .populate('animal', 'name type breed image status')
    .populate('applicant', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: requests.length, requests });
});

/**
 * @route   PUT /api/adoption/requests/:id
 * @desc    Approve or reject an adoption request
 * @access  Private (Responder, NGO)
 */
exports.updateAdoptionRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
    throw new ApiError('Status must be Approved or Rejected', 400);
  }

  const request = await AdoptionRequest.findById(req.params.id).populate('animal');
  if (!request) throw new ApiError('Adoption request not found', 404);

  request.status = status;
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();
  await request.save();

  if (status === 'Approved') {
    request.animal.status = 'Adopted';
    await request.animal.save();

    // Auto-decline any other pending requests for the same animal
    await AdoptionRequest.updateMany(
      { animal: request.animal._id, _id: { $ne: request._id }, status: 'Pending' },
      { status: 'Rejected', reviewedBy: req.user._id, reviewedAt: new Date() }
    );
  } else {
    request.animal.status = 'Available';
    await request.animal.save();
  }

  res.status(200).json({ success: true, message: `Adoption request ${status.toLowerCase()}`, request });
});
