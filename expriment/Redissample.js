const Redis = require('ioredis');
const { jobService } = require('./jobService');
const { Applicant } = require('./models/Applicant');
const { Job } = require('./models/Job');

// Initialize Redis client
const redis = new Redis({
  host: 'localhost', // Your Redis server host
  port: 6379,        // Your Redis server port
  db: 0              // Database index
});

// Helper function to fetch jobs from Redis based on companyId and userId
async function getJobsFromRedis(userId, companies, limit) {
  let jobs = [];
  
  for (let companyId of companies) {
    const cacheKey = `company:${companyId}:${userId}`;
    const cachedJobs = await redis.get(cacheKey);
    if (cachedJobs) {
      const allJobs = JSON.parse(cachedJobs);
      // Filter jobs that are created after the cursor timestamp
      jobs.push(...allJobs);
    }
  }

  return jobs.slice(0, limit); // Limit the number of jobs based on the provided limit
}

// Helper function to store jobs in Redis
async function storeJobsInRedis(userId, companyId, jobs) {
  const cacheKey = `company:${companyId}:${userId}`;
  const cachedJobs = await redis.get(cacheKey);

  let allJobs = [];
  if (cachedJobs) {
    allJobs = JSON.parse(cachedJobs); // Get existing jobs from cache
  }

  // Append new jobs to the cached jobs list
  allJobs.push(...jobs);

  // Store the updated list of jobs in Redis with a cache expiry (1 hour)
  await redis.set(cacheKey, JSON.stringify(allJobs), 'EX', 3600); // Cache for 1 hour
}

const getJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cursor, limit = 100 } = req.query;

    // Get applicant and their followed companies
    const applicant = await Applicant.findOne({ userId }).select('followingCompanies');
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Define batch size for companies and jobs
    const companyBatchSize = 50;
    const jobBatchSize = 50;
    let totalJobsFetched = 0;
    let currentCursor = cursor || new Date(0).toISOString(); // default to 1970 if no cursor provided
    let jobs = [];
    let hasMore = true;

    // Split the followed companies into chunks of 50
    const companyChunks = chunkArray(applicant.followingCompanies, companyBatchSize);

    // Loop through the company chunks and fetch jobs in batches
    for (let i = 0; i < companyChunks.length && hasMore && totalJobsFetched < limit; i++) {
      const companiesBatch = companyChunks[i];

      // Fetch jobs from Redis first
      const cachedJobs = await getJobsFromRedis(userId, companiesBatch, limit - totalJobsFetched);
      jobs = [...jobs, ...cachedJobs];
      totalJobsFetched += cachedJobs.length;

      // If there are still jobs to fetch, query MongoDB
      if (totalJobsFetched < limit) {
        let remainingCompanies = companiesBatch.filter(companyId => {
          // Filter companies that need to be fetched from MongoDB (those not in cache)
          return !cachedJobs.some(job => job.companyId === companyId);
        });

        // Fetch remaining jobs from MongoDB
        let batchCursor = currentCursor;
        while (remainingCompanies.length > 0 && totalJobsFetched < limit && hasMore) {
          const result = await jobService.getJobsByCompanies(
            remainingCompanies,
            batchCursor,
            jobBatchSize
          );

          // Append the jobs to the list
          jobs = [...jobs, ...result.jobs];
          totalJobsFetched += result.jobs.length;

          // Update the cursor and hasMore flag
          batchCursor = result.nextCursor || batchCursor; // Use the next cursor from MongoDB response
          hasMore = result.hasMore;

          // Cache the jobs from MongoDB in Redis with the current cursor (timestamp)
          for (let job of result.jobs) {
            await storeJobsInRedis(userId, job.companyId, [job]);
          }

          // Break if we have enough jobs
          if (totalJobsFetched >= limit) {
            break;
          }

          remainingCompanies = remainingCompanies.filter(companyId => {
            // Remove companies that are fully fetched
            return !result.jobs.some(job => job.companyId === companyId);
          });
        }
      }

      // Update the main cursor after processing the batch
      currentCursor = jobs.length > 0 ? jobs[jobs.length - 1].createdAt : currentCursor; // Use the last job's createdAt as the new cursor
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
