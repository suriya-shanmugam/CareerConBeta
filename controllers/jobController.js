const jobService = require('../services/jobService');

// Controller to handle getting all jobs
const getJobs = async (req, res) => {
  try {
    const filters = req.query.companyId ? { companyId: req.query.companyId } : {};
    const jobs = await jobService.getJobs(filters);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to handle getting a job by ID
const getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json(job);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller to handle creating a job
const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = await jobService.createJob(jobData);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to handle updating a job
const updateJobById = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedJob = await jobService.updateJobById(req.params.id, updateData);
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJobById
};


/*

curl -X POST http://localhost:3000/api/v1/jobs \
-H "Content-Type: application/json" \
-d '{
  "companyId": "67412362def542ecb4d14f07",
  "postedBy": "67412f011f4c0f5067ddbe20",
  "title": "Software Engineer",
  "description": "Job description here",
  "requirements": ["Node.js", "MongoDB", "Express"],
  "location": "San Francisco, CA",
  "salary": {
    "min": 70000,
    "max": 120000,
    "currency": "USD"
  },
  "department": "Engineering",
  "type": "Full-time",
  "status": "Active"
}' 

*/

/*

curl -X GET http://localhost:5000/api/v1/jobs

curl -X GET http://localhost:5000/api/v1/jobs/{jobid}


*/

/*

curl -X PUT http://localhost:3000/api/v1/jobs/674183d1edd912c8d39d21d2 -H "Content-Type: application/json" -d '{
  "description": "Looking for experienced software engineer"
}'


*/


