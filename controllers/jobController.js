const Job = require("../models/job");

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('companyId'); // Fetch all jobs
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};


const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId')
      .populate('postedBy');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const createJobs = async (req, res) => {
  const {
    companyId,
    postedBy,
    title,
    description,
    requirements,
    location,
    salary,
    department,
    type,
    status,
  } = req.body;

  const job = new Job({
    companyId,
    postedBy,
    title,
    description,
    requirements,
    location,
    salary,
    department,
    type,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    next(error);
  }
};

const updateJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update job fields if present in the request body
    job.title = req.body.title ?? job.title;
    job.description = req.body.description ?? job.description;
    job.requirements = req.body.requirements ?? job.requirements;
    job.location = req.body.location ?? job.location;
    job.salary = req.body.salary ?? job.salary;
    job.department = req.body.department ?? job.department;
    job.type = req.body.type ?? job.type;
    job.status = req.body.status ?? job.status;
    job.updatedAt = Date.now();

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};






module.exports = {
  getJobs,
  getJobById,
  createJobs,
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


