const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const {
  createRescue,
  getRescues,
  getRescueById,
  assignRescue,
  updateRescueStatus,
} = require('../controllers/rescue.controller');

router.post('/', createRescue);
router.get('/', getRescues);
router.get('/:id', getRescueById);
router.put('/:id/assign', protect, allowRoles('Responder', 'NGO'), assignRescue);
router.put('/:id/status', protect, allowRoles('Responder', 'NGO'), updateRescueStatus);

module.exports = router;
