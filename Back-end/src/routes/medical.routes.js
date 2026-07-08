const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const {
  createRecord,
  getRecordsForAnimal,
  getRecordById,
  updateRecord,
} = require('../controllers/medical.controller');

router.post('/', protect, allowRoles('Responder', 'NGO'), createRecord);
router.get('/animal/:animalId', getRecordsForAnimal);
router.get('/:id', getRecordById);
router.put('/:id', protect, allowRoles('Responder', 'NGO'), updateRecord);

module.exports = router;
