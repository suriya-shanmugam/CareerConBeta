// /routes/clearDataRoutes.js
const express = require('express');
const { clearAllData } = require('../controllers/clearDataController');

const router = express.Router();

// Route to clear all data from collections
router.delete('/clear-all-data', clearAllData);

module.exports = router;
