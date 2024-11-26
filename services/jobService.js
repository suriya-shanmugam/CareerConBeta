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

// Service to get jobs by companies with cursor-based pagination
const getJobsByCompanies = async (companies, cursor = null, limit = 10) => {
  try {
    
    console.log(limit)
    /*
    // Split companies into chunks of 50
    const companyChunks = [];
    for (let i = 0; i < companies.length; i += 50) {
      companyChunks.push(companies.slice(i, i + 50));
    }*/

    // Build query
    let query = { companyId: { $in: companies } };
    if (cursor) {
      query.createdAt = { $lt: cursor };
    }

    // Fetch one extra item to determine if there are more results
    const jobs = await Job.find(query)
      .populate('companyId')
      .populate('postedBy')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    // Check if there are more results
    const hasMore = jobs.length > limit;
    const results = hasMore ? jobs.slice(0, -1) : jobs;

    // Get the next cursor
    const nextCursor = hasMore ? results[results.length - 1].createdAt : null;

    return {
      jobs: results,
      nextCursor,
      hasMore,
      //currentChunk: 0,
      //totalChunks: companyChunks.length
    };
  } catch (error) {
    throw new Error('Error fetching jobs by companies: ' + error.message);
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
  getJobsByCompanies,
  createJob,
  updateJobById
};