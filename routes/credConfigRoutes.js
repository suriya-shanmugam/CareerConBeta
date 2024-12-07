const express = require('express');
const credConfigController = require('../controllers/credConfigController');

const router = express.Router();

// POST endpoint to create a new CredConfig
router.post('/', credConfigController.createCredConfig);

// GET endpoint to get the first (and only) CredConfig
//router.get('/', credConfigController.getCredConfig); // Changed to just '/'

// Export routes
module.exports = router;
