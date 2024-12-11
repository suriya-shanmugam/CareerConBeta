/*
const { createClient } = require('@redis/client');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Redis client using environment variables
const redisClient = createClient({
  url: `${process.env.REDIS_HOST || 'redis://localhost'}:${process.env.REDIS_PORT || 6379}`, // Use Redis host and port from env
  password: process.env.REDIS_PASSWORD || undefined, // Optional: Use Redis password if set in env
});

redisClient.connect()
  .then(() => {
    console.log('Connected to Redis.');
  })
  .catch(err => {
    console.error('Failed to connect to Redis:', err);
  });

// Service to handle job-related operations in Redis
const jobRedisService = {
  // Store a list of jobs for a specific user
  async storeJobs(userId, jobs) {
    try {
      const jobList = jobs.map(job => JSON.stringify(job)); // Convert jobs to JSON strings
      await redisClient.lPush(`jobs:${userId}`, jobList); // Store jobs in Redis list
      console.log(`Successfully stored ${jobs.length} jobs for user ${userId}`);
    } catch (error) {
      console.error('Error storing jobs:', error);
      throw error;
    }
  },

  // Append a single job to the list for a specific user
  async appendJob(userId, job) {
    try {
      const jobString = JSON.stringify(job); // Convert job object to JSON string
      await redisClient.rPush(`jobs:${userId}`, jobString); // Append job to Redis list
      console.log(`Successfully appended a job for user ${userId}`);
    } catch (error) {
      console.error('Error appending job:', error);
      throw error;
    }
  },

  // Fetch all jobs for a specific user
  async getAllJobs(userId) {
    try {
      const jobs = await redisClient.lRange(`jobs:${userId}`, 0, -1); // Retrieve all jobs in the list
      return jobs.map(job => JSON.parse(job)); // Deserialize JSON strings back to objects
    } catch (error) {
      console.error('Error reading jobs:', error);
      throw error;
    }
  },

  // Delete all jobs for a specific user
  async deleteJobs(userId) {
    try {
      await redisClient.del(`jobs:${userId}`); // Delete all jobs for the user
      console.log(`Successfully deleted all jobs for user ${userId}`);
    } catch (error) {
      console.error('Error deleting jobs:', error);
      throw error;
    }
  },
};

module.exports = jobRedisService;
*/