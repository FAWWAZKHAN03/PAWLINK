const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const {
  createRescue,
  getAllRescues,
  getRescueById,
  getMyRescues,
  acceptRescue,
  completeRescue,
  deleteRescue,
} = require('../controllers/rescue.controller');

router.post('/', createRescue);
router.get('/get', getAllRescues);
router.get('/my', protect, getMyRescues);
router.get('/:id', getRescueById);
router.put('/:id/accept', protect, acceptRescue);
router.put('/:id/complete', protect, completeRescue);
router.delete('/:id', protect, deleteRescue);

module.exports = router;
