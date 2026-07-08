const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const medicalRecordSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian' },
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    dewormed: { type: Boolean, default: false },
    diagnosis: { type: String, trim: true, default: '' },
    prescription: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    visitDate: { type: Date, default: Date.now },
    nextCheckup: { type: Date },
  },
  { timestamps: true }
);

medicalRecordSchema.index({ animal: 1 });

toJSONPlugin(medicalRecordSchema);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
