// routes/recruiterRoutes.js
const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');

// Routes for recruiter operations
router.get('/', recruiterController.getAllRecruiters);
router.get('/:id', recruiterController.getRecruiterById);
router.post('/', recruiterController.createRecruiter);

module.exports = router;
