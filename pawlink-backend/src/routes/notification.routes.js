const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { getMyNotifications, markAsRead, markAllAsRead } = require('../controllers/notification.controller');

router.use(protect);
router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

module.exports = router;
