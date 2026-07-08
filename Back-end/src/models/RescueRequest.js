const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const timelineEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    desc: { type: String, trim: true, default: '' },
    time: { type: Date, default: Date.now },
  },
  { _id: false }
);

const rescueRequestSchema = new mongoose.Schema(
  {
    reporter: { type: String, required: [true, 'Reporter name is required'], trim: true },
    reporterPhone: { type: String, required: [true, 'Reporter phone is required'], trim: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    petType: { type: String, required: [true, 'Pet type is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    coords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    emergencyLevel: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Reported', 'Verified', 'Dispatched', 'On-Site', 'Rescued', 'Vet-Care', 'Completed'],
      default: 'Reported',
    },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    image: { type: String, default: '' },
    assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeline: [timelineEntrySchema],
  },
  { timestamps: true }
);

rescueRequestSchema.index({ status: 1, emergencyLevel: 1 });

toJSONPlugin(rescueRequestSchema);

module.exports = mongoose.model('RescueRequest', rescueRequestSchema);
