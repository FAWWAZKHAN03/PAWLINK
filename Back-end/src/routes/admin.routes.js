const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');
const { getDashboardStats, getUsers } = require('../controllers/admin.controller');

router.use(protect, allowRoles('NGO'));
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);

module.exports = router;
