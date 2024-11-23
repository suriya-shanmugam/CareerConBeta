const Job = require('../models/job');

// Service to get all jobs with optional filtering by companyId
const getJobs = async (filters) => {
  try {
    return await Job.find(filters).populate('companyId');
  } catch (error) {
    throw new Error('Error fetching jobs: ' + error.message);
  }
};

// Service to get a job by its ID
const getJobById = async (jobId) => {
  try {
    const job = await Job.findById(jobId).populate('companyId').populate('postedBy');
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Service to create a new job
const createJob = async (jobData) => {
  const job = new Job({
    ...jobData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    return await job.save();
  } catch (error) {
    throw new Error('Error creating job: ' + error.message);
  }
};

// Service to update a job by its ID
const updateJobById = async (jobId, updateData) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Update fields dynamically
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        job[key] = updateData[key];
      }
    });
    job.updatedAt = Date.now();

    return await job.save();
  } catch (error) {
    throw new Error('Error updating job: ' + error.message);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJobById
};
