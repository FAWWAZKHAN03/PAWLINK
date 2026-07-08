const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const foundPetSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: 'Unknown' },
    type: {
      type: String,
      required: [true, 'Animal type is required'],
      enum: ['dog', 'cat', 'bird', 'other'],
      lowercase: true,
    },
    breed: { type: String, trim: true, default: 'Unknown' },
    foundLocation: { type: String, required: [true, 'Found location is required'], trim: true },
    date: { type: Date, required: [true, 'Date is required'] },
    finder: { type: String, required: [true, 'Finder name is required'], trim: true },
    phone: { type: String, required: [true, 'Contact phone is required'], trim: true },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    image: { type: String, default: '' },
    status: { type: String, enum: ['Found', 'Reunited'], default: 'Found' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

foundPetSchema.index({ type: 1, status: 1 });

toJSONPlugin(foundPetSchema);

module.exports = mongoose.model('FoundPet', foundPetSchema);
