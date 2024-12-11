/*
const { createClient } = require('@redis/client');

require('dotenv').config(); // Load environment variables from .env file
// Initialize Redis client using environment variables
const redisClient = createClient({
    url: `${process.env.REDIS_HOST || 'redis://localhost'}:${process.env.REDIS_PORT || 6379}`, // Use Redis host and port from env
    password: process.env.REDIS_PASSWORD || undefined, // Optional: Use Redis password if set in env
  });

// Redis service to push a blog to the company key
const pushBlogToRedis = async (companyId, blogData) => {
  try {
    const blogKey = `company:${companyId}:blogs`;
    
    // Convert blog data to JSON string for storing in Redis
    const blogJSON = JSON.stringify(blogData);

    // Use Redis LPUSH (push to the left of the list)
    redisClient.lpush(blogKey, blogJSON, (err, res) => {
      if (err) {
        console.error("Error pushing blog to Redis:", err);
      } else {
        console.log(`Blog successfully pushed to company:${companyId}:blogs`);
      }
    });
  } catch (error) {
    console.error(`Error in pushBlogToRedis: ${error.message}`);
  }
};

// Fetch all blogs for a company from Redis
const fetchAllBlogsOfCompany = async (companyId) => {
  try {
    const blogKey = `company:${companyId}:blogs`;

    // Use Redis LRANGE to fetch all blogs
    redisClient.lrange(blogKey, 0, -1, (err, result) => {
      if (err) {
        console.error("Error fetching blogs from Redis:", err);
        return [];
      }
      
      // Parse each blog JSON string into an object
      const blogs = result.map(blog => JSON.parse(blog));
      console.log(`Fetched ${blogs.length} blogs for company ${companyId}`);
      return blogs;
    });
  } catch (error) {
    console.error(`Error in fetchAllBlogsOfCompany: ${error.message}`);
    return [];
  }
};



module.exports = {
  pushBlogToRedis,
  fetchAllBlogsOfCompany
};
*/