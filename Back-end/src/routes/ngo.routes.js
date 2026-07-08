const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const {
  getShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter,
} = require('../controllers/ngo.controller');

router.get('/', getShelters);
router.get('/:id', getShelterById);
router.post('/', protect, allowRoles('NGO'), createShelter);
router.put('/:id', protect, allowRoles('NGO'), updateShelter);
router.delete('/:id', protect, allowRoles('NGO'), deleteShelter);

module.exports = router;
