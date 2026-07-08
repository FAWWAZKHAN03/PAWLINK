const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const {
  getLeaderboard,
  getMyProfile,
  getMissions,
  createMission,
  joinMission,
  completeMission,
} = require('../controllers/volunteer.controller');

router.get('/leaderboard', getLeaderboard);
router.get('/missions', getMissions);
router.get('/me', protect, getMyProfile);
router.post('/missions', protect, allowRoles('Responder', 'NGO'), createMission);
router.put('/missions/:id/join', protect, joinMission);
router.put('/missions/:id/complete', protect, allowRoles('Responder', 'NGO'), completeMission);

module.exports = router;
