const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { getMyChats, startChat, getMessages, sendMessage } = require('../controllers/chat.controller');

router.use(protect);
router.get('/', getMyChats);
router.post('/', startChat);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
