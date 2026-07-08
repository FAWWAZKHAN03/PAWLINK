const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Mission title is required'], trim: true },
    date: { type: Date, required: [true, 'Mission date is required'] },
    location: { type: String, trim: true, default: '' },
    volunteersNeeded: { type: Number, required: true, min: 1 },
    points: { type: Number, default: 0, min: 0 },
    signups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['Active', 'Urgent', 'Filled', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

eventSchema.virtual('volunteersSigned').get(function volunteersSignedCount() {
  return this.signups.length;
});

toJSONPlugin(eventSchema);

module.exports = mongoose.model('Event', eventSchema);
