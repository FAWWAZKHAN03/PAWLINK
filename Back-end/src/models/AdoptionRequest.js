const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const adoptionRequestSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    contactPhone: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Withdrawn'],
      default: 'Pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

// One applicant can only have a single active request per animal
adoptionRequestSchema.index({ animal: 1, applicant: 1 }, { unique: true });

toJSONPlugin(adoptionRequestSchema);

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
