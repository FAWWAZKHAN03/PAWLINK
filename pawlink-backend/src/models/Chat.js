const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    // Optional context, e.g. "Rescue #123" or "Adoption inquiry - Milo"
    context: { type: String, trim: true, default: '' },
    lastMessage: { type: String, trim: true, default: '' },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

toJSONPlugin(chatSchema);

module.exports = mongoose.model('Chat', chatSchema);
