const jobService = require('../services/jobService');
const {formatResponse} = require('../utils/helper');
const Applicant = require('../models/applicant');

// Controller to handle getting all jobs
const getJobs = async (req, res) => {
  try {
    const filters = req.query.companyId ? { companyId: req.query.companyId } : {};
    const jobs = await jobService.getJobs(filters);
    const response = formatResponse('success', 'Jobs fetched successfully', jobs)
    res.status(200).json(response);
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

// Controller to handle getting jobs by user with pagination
const getJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cursor, limit = 10 } = req.query;

    // Get applicant and their followed companies
    const applicant = await Applicant.findOne({ userId }).select('followingCompanies');
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Define batch size for companies and jobs
    const companyBatchSize = 50;
    const jobBatchSize = 10;
    let totalJobsFetched = 0;
    let currentCursor = cursor || '';
    let jobs = [];
    let hasMore = true;

    // Split the followed companies into chunks of 50
    const companyChunks = chunkArray(applicant.followingCompanies, companyBatchSize);

    // Loop through the company chunks and fetch jobs in batches
    for (let i = 0; i < companyChunks.length && hasMore && totalJobsFetched < limit; i++) {
      const companiesBatch = companyChunks[i];

      // Fetch jobs for the current batch of companies
      let batchCursor = currentCursor;
      while (totalJobsFetched < limit && hasMore) {
        const result = await jobService.getJobsByCompanies(
          companiesBatch,
          batchCursor,
          jobBatchSize
        );

        // Append the jobs to the total list
        jobs = [...jobs, ...result.jobs];
        totalJobsFetched += result.jobs.length;

        // Update the cursor and hasMore flag
        batchCursor = result.nextCursor;
        hasMore = result.hasMore;

        // Break if we have enough jobs
        if (totalJobsFetched >= limit) {
          break;
        }
      }

      // Update the main cursor after processing the batch
      currentCursor = batchCursor;
    }

    // Prepare response with jobs and cursor information
    const response = formatResponse('success', 'Jobs fetched successfully', {
      jobs,
      nextCursor: currentCursor,
      hasMore
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to split an array into chunks of a given size
function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}






/* const getJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cursor, limit = 20 } = req.query;

    // Get applicant and their followed companies
    const applicant = await Applicant.findOne({ userId }).select('followingCompanies');
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Define batch size (50)
    const batchSize = 20;
    let totalJobsFetched = 0;
    let currentCursor = cursor || '';
    let jobs = [];
    let hasMore = true;
    //let nextCursor = '';

    // Loop through the following companies and fetch jobs in batches until limit is reached
    while (totalJobsFetched < limit && hasMore) {
      // Get jobs from the service with pagination
      const result = await jobService.getJobsByCompanies(
        applicant.followingCompanies,
        currentCursor,
        batchSize
      );

      // Add fetched jobs to the total list
      jobs = [...jobs, ...result.jobs];
      totalJobsFetched += result.jobs.length;

      // Update the cursor and hasMore flag
      currentCursor = result.nextCursor;
      hasMore = result.hasMore;

      // If we have fetched enough jobs, stop fetching
      if (totalJobsFetched >= limit || !hasMore) {
        break;
      }
    }

    // Prepare response with jobs and cursor information
    const response = formatResponse('success', 'Jobs fetched successfully', {
      jobs,
      nextCursor: currentCursor,
      hasMore
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */





/*const getJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cursor, limit = 10 } = req.query;

    // Get applicant and their followed companies
    const applicant = await Applicant.findOne({ userId }).select('followingCompanies');
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }



    // Get jobs from the service with pagination
    const result = await jobService.getJobsByCompanies(
      applicant.followingCompanies,
      cursor,
      parseInt(limit)
    );

    const response = formatResponse('success', 'Jobs fetched successfully', {
      jobs: result.jobs,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore
    });
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

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
  getJobsByUser,
  createJob,
  updateJobById
};