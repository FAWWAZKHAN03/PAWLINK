const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    type: {
      type: String,
      enum: ['Shelter', 'Veterinary', 'NGO Shelter', 'Specialist'],
      default: 'Shelter',
    },
    address: { type: String, required: [true, 'Address is required'], trim: true },
    phone: { type: String, trim: true, default: '' },
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    capacity: { type: String, trim: true, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    verifiedNGO: { type: Boolean, default: false },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

toJSONPlugin(shelterSchema);

module.exports = mongoose.model('Shelter', shelterSchema);
