const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const lostFoundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    petName: {
      type: String,
      trim: true,
      default: '',
    },
    animalType: {
      type: String,
      required: [true, 'Animal type is required'],
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      trim: true,
      default: '',
    },
    age: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
      default: '',
    },
    status: {
      type: String,
      enum: ['Lost', 'Found', 'Reunited'],
      default: 'Lost',
    },
    image: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    reward: {
      type: String,
      trim: true,
      default: '',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

lostFoundSchema.index({ status: 1, createdAt: -1 });

toJSONPlugin(lostFoundSchema);

module.exports = mongoose.model('LostFound', lostFoundSchema);
