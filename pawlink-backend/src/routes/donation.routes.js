const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  contribute,
  getMyDonations,
} = require('../controllers/donation.controller');

router.get('/', getCampaigns);
router.get('/history/mine', protect, getMyDonations);
router.get('/:id', getCampaignById);
router.post('/', protect, allowRoles('NGO'), createCampaign);
router.post('/:id/contribute', contribute);

module.exports = router;
