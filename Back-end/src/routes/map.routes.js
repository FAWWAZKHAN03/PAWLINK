const express = require('express');
const router = express.Router();
const { getMapPoints } = require('../controllers/map.controller');

router.get('/', getMapPoints);

module.exports = router;
