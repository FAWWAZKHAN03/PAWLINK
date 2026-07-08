const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const medicalHistorySchema = new mongoose.Schema(
  {
    vaccinated: { type: String, trim: true, default: 'Unknown' },
    neutered: { type: String, trim: true, default: 'Unknown' },
    dewormed: { type: String, trim: true, default: 'Unknown' },
    lastCheckup: { type: Date },
  },
  { _id: false }
);

const animalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      required: [true, 'Animal type is required'],
      enum: ['dog', 'cat', 'bird', 'other'],
      lowercase: true,
    },
    breed: { type: String, trim: true, default: 'Mixed / Unknown' },
    age: { type: String, trim: true, default: 'Unknown' },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large'],
      default: 'Medium',
    },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted', 'Saved'],
      default: 'Available',
    },
    character: [{ type: String, trim: true }],
    story: { type: String, trim: true, maxlength: 2000, default: '' },
    medicalHistory: { type: medicalHistorySchema, default: () => ({}) },
    // Shelter/NGO currently housing the animal
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' },
    // User (Responder/NGO) who listed the animal
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

animalSchema.index({ type: 1, status: 1 });

toJSONPlugin(animalSchema);

module.exports = mongoose.model('Animal', animalSchema);
