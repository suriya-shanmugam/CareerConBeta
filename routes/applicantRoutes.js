const express = require('express');
const { createApplicant, getAllApplicants } = require('../controllers/applicantController');

const router = express.Router();

// Route to create a new applicant
router.post('/', createApplicant);

// Route to fetch all applicants
router.get('/', getAllApplicants);

module.exports = router;
