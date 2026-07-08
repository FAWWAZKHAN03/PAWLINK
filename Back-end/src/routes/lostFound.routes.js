const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const {
  reportLost,
  reportFound,
  getLostPets,
  getFoundPets,
  getLostPetById,
  getFoundPetById,
  markLostReunited,
  markFoundReunited,
} = require('../controllers/lostFound.controller');

router.post('/lost', reportLost);
router.post('/found', reportFound);
router.get('/lost', getLostPets);
router.get('/found', getFoundPets);
router.get('/lost/:id', getLostPetById);
router.get('/found/:id', getFoundPetById);
router.put('/lost/:id/reunited', protect, markLostReunited);
router.put('/found/:id/reunited', protect, markFoundReunited);

module.exports = router;
