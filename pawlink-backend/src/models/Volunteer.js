const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const volunteerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, default: 0, min: 0 },
    rescues: { type: Number, default: 0, min: 0 },
    hours: { type: Number, default: 0, min: 0 },
    missionsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },
  { timestamps: true }
);

toJSONPlugin(volunteerSchema);

module.exports = mongoose.model('Volunteer', volunteerSchema);
