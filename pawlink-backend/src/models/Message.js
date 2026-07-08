const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: [true, 'Message text is required'], trim: true, maxlength: 2000 },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: 1 });

toJSONPlugin(messageSchema);

module.exports = mongoose.model('Message', messageSchema);
