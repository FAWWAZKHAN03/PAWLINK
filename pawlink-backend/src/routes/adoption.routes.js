const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  createAdoptionRequest,
  getAdoptionRequests,
  updateAdoptionRequest,
} = require('../controllers/adoption.controller');

router.get('/animals', getAnimals);
router.get('/animals/:id', getAnimalById);
router.post('/animals', protect, allowRoles('Responder', 'NGO'), createAnimal);
router.put('/animals/:id', protect, allowRoles('Responder', 'NGO'), updateAnimal);
router.delete('/animals/:id', protect, allowRoles('Responder', 'NGO'), deleteAnimal);

router.post('/requests', protect, createAdoptionRequest);
router.get('/requests', protect, getAdoptionRequests);
router.put('/requests/:id', protect, allowRoles('Responder', 'NGO'), updateAdoptionRequest);

module.exports = router;
