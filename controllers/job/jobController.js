const Job = require("../../models/job/job");

const getJobs = async (req, res) => {
  
    try {
    const jobs = await Job.find(); // Fetch all jobs
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

const createJobs = async (req, res) => {
  try {
    console.log(req.body);
    const {
      title,
      location,
      description,
      postedBy,
      payScaleStart,
      payScaleEnd,
      payScaleUnit,
    } = req.body;

    // Create a new Job document
    const newJob = new Job({
      title,
      location,
      description,
      postedBy,
      payScaleStart,
      payScaleEnd,
      payScaleUnit,
    });

    // Save to the database
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating job", error: error.message });
  }
};

module.exports = {
  getJobs,
  createJobs,
};

/*
curl -X POST http://localhost:5000/api/v1/jobs -H "Content-Type: application/json" -d '{
  "title": "Software Developer",
  "location": "San Francisco",
  "description": "<p>Looking for a skilled developer with experience in Node.js</p>",
  "postedBy": 1234567890,
  "payScaleStart": 60000,
  "payScaleEnd": 100000,
  "payScaleUnit": "USD"
}'

*/


/*

curl -X GET http://localhost:5000/api/v1/jobs


*/
