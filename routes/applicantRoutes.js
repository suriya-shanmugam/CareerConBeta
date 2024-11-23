const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');

// Route to create a new applicant
router.post('/', applicantController.createApplicant);

// Route to get all applicants
router.get('/', applicantController.getAllApplicants);

module.exports = router;
