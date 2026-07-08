const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

/**
 * @route   GET /api/chat
 * @access  Private
 */
exports.getMyChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'name avatar role')
    .sort({ lastMessageAt: -1 });

  res.status(200).json({ success: true, count: chats.length, chats });
});

/**
 * @route   POST /api/chat
 * @desc    Start (or fetch existing) 1:1 conversation with another user
 * @access  Private
 */
exports.startChat = asyncHandler(async (req, res) => {
  const { participantId, context } = req.body;
  if (!participantId) throw new ApiError('participantId is required', 400);

  let chat = await Chat.findOne({
    participants: { $all: [req.user._id, participantId], $size: 2 },
  });

  if (!chat) {
    chat = await Chat.create({ participants: [req.user._id, participantId], context });
  }

  res.status(200).json({ success: true, chat });
});

/**
 * @route   GET /api/chat/:chatId/messages
 * @access  Private
 */
exports.getMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) throw new ApiError('Chat not found', 404);
  if (!chat.participants.some((p) => p.toString() === req.user._id.toString())) {
    throw new ApiError('You are not part of this conversation', 403);
  }

  const messages = await Message.find({ chat: req.params.chatId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, count: messages.length, messages });
});

/**
 * @route   POST /api/chat/:chatId/messages
 * @access  Private
 */
exports.sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) throw new ApiError('Message text is required', 400);

  const chat = await Chat.findById(req.params.chatId);
  if (!chat) throw new ApiError('Chat not found', 404);
  if (!chat.participants.some((p) => p.toString() === req.user._id.toString())) {
    throw new ApiError('You are not part of this conversation', 403);
  }

  const message = await Message.create({ chat: chat._id, sender: req.user._id, text, readBy: [req.user._id] });

  chat.lastMessage = text;
  chat.lastMessageAt = new Date();
  await chat.save();

  res.status(201).json({ success: true, message });
});
