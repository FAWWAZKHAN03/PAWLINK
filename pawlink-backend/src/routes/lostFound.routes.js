const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const {
  createReport,
  getAllReports,
  getReportById,
  getMyReports,
  updateReport,
  markAsReunited,
  deleteReport,
} = require('../controllers/lostFound.controller');

router.post('/', protect, createReport);
router.get('/', getAllReports);
router.get('/my', protect, getMyReports);
router.get('/:id', getReportById);
router.put('/:id', protect, updateReport);
router.put('/:id/reunited', protect, markAsReunited);
router.delete('/:id', protect, deleteReport);

module.exports = router;
