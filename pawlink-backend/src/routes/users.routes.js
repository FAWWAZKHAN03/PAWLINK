const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  deleteAvatar,
} = require('../controllers/user.controller');
const protect = require('../middleware/auth.middleware');
const { uploadAvatar: uploadAvatarMiddleware } = require('../middleware/upload.middleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.delete('/avatar', protect, deleteAvatar);

module.exports = router;
