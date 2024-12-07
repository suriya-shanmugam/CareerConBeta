const { createClient } = require("@redis/client");
require("dotenv").config(); // Load environment variables from .env file

// Initialize Redis client using environment variables
const redisClient = createClient({
  url: `${process.env.REDIS_HOST || "redis://localhost"}:${
    process.env.REDIS_PORT || 6379
  }`, // Use Redis host and port from env
  password: process.env.REDIS_PASSWORD || undefined, // Optional: Use Redis password if set in env
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis.");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

// Redis service to handle blog and job-related operations
const redisService = {
  // Blog-related methods
  async pushBlogToRedis(companyId, blogData) {
    try {
      const blogKey = `company:${companyId}:blogs`;

      // Convert blog data to JSON string for storing in Redis
      const blogJSON = JSON.stringify(blogData);

      // Use Redis LPUSH (push to the left of the list)
      await redisClient.lPush(blogKey, blogJSON);
      console.log(`Blog successfully pushed to company:${companyId}:blogs`);
    } catch (error) {
      console.error(`Error in pushBlogToRedis: ${error.message}`);
      throw error;
    }
  },

  async fetchAllBlogsOfCompany(companyId) {
    try {
      const blogKey = `company:${companyId}:blogs`;

      // Use Redis LRANGE to fetch all blogs
      const result = await redisClient.lRange(blogKey, 0, -1);

      // Parse each blog JSON string into an object
      const blogs = result.map((blog) => JSON.parse(blog));
      console.log(`Fetched ${blogs.length} blogs for company ${companyId}`);
      return blogs;
    } catch (error) {
      console.error(`Error in fetchAllBlogsOfCompany: ${error.message}`);
      return [];
    }
  },

  // Fetch 10 blogs for a company where each blog is less than the given cursor
  // Fetch 10 blogs for multiple companies where each blog is less than the given cursor
  // Fetch 10 blogs for multiple companies where each blog is less than the given cursor
  /*async fetchBlogsLessThanCursorForMultipleCompanies(companyIds, cursor, limit = 10) {
  try {
    const results = {};

    // If cursor is null, set it to the current timestamp (current time in milliseconds)
    const actualCursor = cursor === null ? Date.now() : cursor;

    // Loop through each company ID
    for (const companyId of companyIds) {
      const blogKey = `company:${companyId}:blogs`;

      // Use Redis LRANGE to fetch a range of blogs for the current company
      const blogsData = await redisClient.lRange(blogKey, 0, -1); // Fetch all blogs (you can adjust this if needed)

      // Parse the blogs and filter by cursor (assumed to be a timestamp or similar field)
      const blogs = blogsData
        .map(blog => JSON.parse(blog)) // Parse each blog into an object
        .filter(blog => blog.timestamp < actualCursor) // Filter blogs that have a timestamp less than the actual cursor value
        .slice(0, limit); // Limit to the first 10 blogs

      if (blogs.length > 0) {
        results[companyId] = blogs; // Add the fetched blogs to the result for the current company
      }
    }

    console.log(`Fetched blogs for ${Object.keys(results).length} companies.`);
    return results; // Return the result grouped by companyId
  } catch (error) {
    console.error(`Error in fetchBlogsLessThanCursorForMultipleCompanies: ${error.message}`);
    return {};
  }
},*/
async fetchBlogsLessThanCursorForMultipleCompanies(companyIds, cursor, limit = 10) {
  try {
    const results = {};

    // If cursor is null, set it to the current timestamp
    const actualCursor = cursor === null ? new Date() : new Date(cursor); // Ensure cursor is a Date object

    // Loop through each company ID
    for (const companyId of companyIds) {
      const blogKey = `company:${companyId}:blogs`;

      // Use Redis LRANGE to fetch all blogs for the current company
      const blogsData = await redisClient.lRange(blogKey, 0, -1); // Fetch all blogs (you can adjust this if needed)

      // Parse the blogs and filter by cursor (using createdAt)
      const blogs = blogsData
        .map(blog => JSON.parse(blog)) // Parse each blog into an object
        .filter(blog => new Date(blog.createdAt) < actualCursor) // Convert createdAt to Date and filter by cursor
        .slice(0, limit); // Limit to the first 10 blogs

      if (blogs.length > 0) {
        results[companyId] = blogs; // Add the fetched blogs to the result for the current company
      }
    }

    console.log(`Fetched blogs for ${Object.keys(results).length} companies.`);
    return results; // Return the result grouped by companyId
  } catch (error) {
    console.error(`Error in fetchBlogsLessThanCursorForMultipleCompanies: ${error.message}`);
    return {};
  }
}
,

  // Job-related methods
  async storeJobs(userId, jobs) {
    try {
      const jobList = jobs.map((job) => JSON.stringify(job)); // Convert jobs to JSON strings
      await redisClient.lPush(`jobs:${userId}`, jobList); // Store jobs in Redis list
      console.log(`Successfully stored ${jobs.length} jobs for user ${userId}`);
    } catch (error) {
      console.error("Error storing jobs:", error);
      throw error;
    }
  },

  async appendJob(userId, job) {
    try {
      const jobString = JSON.stringify(job); // Convert job object to JSON string
      await redisClient.rPush(`jobs:${userId}`, jobString); // Append job to Redis list
      console.log(`Successfully appended a job for user ${userId}`);
    } catch (error) {
      console.error("Error appending job:", error);
      throw error;
    }
  },

  async getAllJobs(userId) {
    try {
      const jobs = await redisClient.lRange(`jobs:${userId}`, 0, -1); // Retrieve all jobs in the list
      return jobs.map((job) => JSON.parse(job)); // Deserialize JSON strings back to objects
    } catch (error) {
      console.error("Error reading jobs:", error);
      throw error;
    }
  },

  async deleteJobs(userId) {
    try {
      await redisClient.del(`jobs:${userId}`); // Delete all jobs for the user
      console.log(`Successfully deleted all jobs for user ${userId}`);
    } catch (error) {
      console.error("Error deleting jobs:", error);
      throw error;
    }
  },
};

module.exports = redisService;
