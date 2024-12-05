const Job = require('../models/job');
const mongoose = require('mongoose');
const Company = require('../models/company');
const Recruiter = require('../models/recruiter');


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


// Service to create a job for a company based on companyId
const createJobToCompany = async (companyId, jobData) => {
  // Check if the company exists
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Error('Company not found');
  }

  // Validate recruiter ID (postedBy)
  console.log(jobData)
  const recruiter = await Recruiter.findById(jobData.postedBy);
  if (!recruiter) {
    throw new Error('Recruiter not found');
  }

  // Prepare job data
  const newJob = {
    companyId,
    postedBy: jobData.postedBy,
    title: jobData.title,
    description: jobData.description,
    requirements: jobData.requirements || [],
    location: jobData.location,
    salary: jobData.salary,
    department: jobData.department,
    type: jobData.type,
    status: 'Active', // Default status
    jobLink : jobData.jobLink
  };

  try {
    // Use jobService to create the job
    return await createJob(newJob);
  } catch (error) {
    throw new Error('Error creating job: ' + error.message);
  }
};

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

const getJobsByCompanyId = async (companyId) => {
  try {
    // Validate the companyId (ensure it's a valid ObjectId)
    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      throw new Error('Invalid company ID.');
    }

    // Query the Job model to find jobs posted by the given companyId
    const jobs = await Job.find({ companyId })
      .populate('companyId', 'name location industry') // Optionally populate company details
      .populate('postedBy', 'name email') // Optionally populate recruiter details
      .sort({ createdAt: -1 }); // Optional: Sort jobs by creation date (newest first)

    return jobs;
  } catch (error) {
    console.error('Error fetching jobs by company ID:', error.message);
    throw error; // You can handle this error in your route/controller
  }
};

module.exports = {
  getJobs,
  getJobById,
  getJobsByCompanies,
  getJobsByCompanyId,
  createJob,
  createJobToCompany,
  updateJobById
};