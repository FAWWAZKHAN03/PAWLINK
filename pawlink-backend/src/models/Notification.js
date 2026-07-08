const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['adoption', 'rescue', 'donation', 'volunteer', 'chat', 'system'],
      default: 'system',
    },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    body: { type: String, trim: true, default: '' },
    link: { type: String, trim: true, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

toJSONPlugin(notificationSchema);

module.exports = mongoose.model('Notification', notificationSchema);
