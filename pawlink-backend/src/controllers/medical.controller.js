const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const MedicalRecord = require('../models/MedicalRecord');

/**
 * @route   POST /api/medical
 * @access  Private (Responder, NGO)
 */
exports.createRecord = asyncHandler(async (req, res) => {
  const { animal } = req.body;
  if (!animal) throw new ApiError('animal (animal id) is required', 400);

  const record = await MedicalRecord.create(req.body);
  res.status(201).json({ success: true, message: 'Medical record created', record });
});

/**
 * @route   GET /api/medical/animal/:animalId
 * @access  Public
 */
exports.getRecordsForAnimal = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find({ animal: req.params.animalId })
    .populate('veterinarian', 'name specialty phone')
    .sort({ visitDate: -1 });

  res.status(200).json({ success: true, count: records.length, records });
});

exports.getRecordById = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id).populate('veterinarian', 'name specialty phone');
  if (!record) throw new ApiError('Medical record not found', 404);
  res.status(200).json({ success: true, record });
});

/**
 * @route   PUT /api/medical/:id
 * @access  Private (Responder, NGO)
 */
exports.updateRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);
  if (!record) throw new ApiError('Medical record not found', 404);

  Object.assign(record, req.body);
  await record.save();

  res.status(200).json({ success: true, message: 'Medical record updated', record });
});
