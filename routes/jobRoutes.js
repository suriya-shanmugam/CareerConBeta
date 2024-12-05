const express = require("express");
const router = express.Router();
const jobController = require('../controllers/jobController');

// Route to get all jobs
router.get('/', jobController.getJobs);

// Route to get a job by ID
router.get('/:id', jobController.getJobById);

// Route to get a job by ID
router.get('/:jobId/analyze', jobController.analyzejob);

// Route to get jobs for user with pagination
router.get('/user/:userId', jobController.getJobsByUser);

// Route to create a new job
router.post('/', jobController.createJob);

// Route to update a job by ID
router.put('/:id', jobController.updateJobById);

module.exports = router;