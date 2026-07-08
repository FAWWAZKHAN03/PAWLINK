const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const lostPetSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: 'Unknown' },
    type: {
      type: String,
      required: [true, 'Animal type is required'],
      enum: ['dog', 'cat', 'bird', 'other'],
      lowercase: true,
    },
    breed: { type: String, trim: true, default: 'Unknown' },
    lastSeen: { type: String, required: [true, 'Last seen location is required'], trim: true },
    date: { type: Date, required: [true, 'Date is required'] },
    owner: { type: String, required: [true, 'Owner name is required'], trim: true },
    phone: { type: String, required: [true, 'Contact phone is required'], trim: true },
    reward: { type: String, trim: true, default: 'None' },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    image: { type: String, default: '' },
    status: { type: String, enum: ['Lost', 'Reunited'], default: 'Lost' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

lostPetSchema.index({ type: 1, status: 1 });

toJSONPlugin(lostPetSchema);

module.exports = mongoose.model('LostPet', lostPetSchema);
