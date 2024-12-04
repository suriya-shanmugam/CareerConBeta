const blogService = require('../services/blogService');
const {formatResponse} = require('../utils/helper')

const { createBlogByApplicant, createBlogByCompany, getBlogsByApplicant, getBlogsByCompany } = blogService;

/**
 * Controller to handle creating a blog post (Applicant or Company)
 */
const createBlog = async (req, res) => {
  const { title, content, tags, image, authorType, authorId } = req.body;

  // Validate input
  if (!title || !content || !authorType || !authorId) {
    return res.status(400).json({ message: 'Title, content, authorType, and authorId are required' });
  }

  try {
    let newBlog;

    // Depending on the author type, call the respective service
    if (authorType === 'Applicant') {
      newBlog = await createBlogByApplicant({ title, content, tags }, authorId);
    } else if (authorType === 'Company') {
      newBlog = await createBlogByCompany({ title, content, tags }, authorId);
    } else {
      return res.status(400).json({ message: 'Invalid author type. It must be either Applicant or Company.' });
    }

    const response = formatResponse('success', 'NewBlog created successfully', newBlog)
    // Return the created blog
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ message: `Error creating blog: ${error.message}` });
  }
};


/**
 * Controller to get blogs by applicant or company
 * @param {Object} req - The request object containing authorType and authorId in the query params
 * @param {Object} res - The response object to send back the data or errors
 */
const getBlogs = async (req, res) => {
    const { authorType, authorId } = req.query;  // Get authorType and authorId from the query parameters
  
    // Validate input
    if (!authorType || !authorId) {
      return res.status(400).json({ message: 'authorType and authorId are required' });
    }
  
    // Validate that authorType is either 'Applicant' or 'Company'
    if (!['Applicant', 'Company'].includes(authorType)) {
      return res.status(400).json({ message: 'Invalid authorType. It must be either "Applicant" or "Company".' });
    }
  
    try {
      let blogs;
  
      // Fetch blogs based on the authorType
      if (authorType === 'Applicant') {
        blogs = await getBlogsByApplicant(authorId);  // Call service to fetch blogs by applicant
      } else if (authorType === 'Company') {
        blogs = await getBlogsByCompany(authorId);  // Call service to fetch blogs by company
      }
  
      // If no blogs are found, return a 404 response
      if (blogs.length === 0) {
        return res.status(404).json({ message: `No blogs found for this ${authorType.toLowerCase()}` });
      }
      
      const response = formatResponse('success', 'NewBlog created successfully', blogs)
      // Return the fetched blogs
      return res.status(200).json({ response });
    } catch (error) {
      // Handle any errors that occur during the fetching process
      return res.status(500).json({ message: `Error fetching blogs: ${error.message}` });
    }
  };
  


module.exports = {
  createBlog,
  getBlogs
};


/*

curl -X POST http://localhost:3000/api/v1/blogs/   -H "Content-Type: application/json"   -d '{
    "title": "Your Blog Title",
    "content": "This is the content of your blog. It can be quite long and detailed.",
    "authorType": "Applicant",
    "authorId": "674a3d368f2ad6ef7520f733",
    "tags": ["career", "job", "developer"]
  }'

curl -X GET "http://localhost:3000/api/v1/blogs?authorType=Applicant&authorId=674a3d368f2ad6ef7520f733"


curl -X POST http://localhost:3000/api/v1/blogs/   -H "Content-Type: application/json"   -d '{
    "title": "Company title",
    "content": "It can be quite long and detailed.",
    "authorType": "Company",
    "authorId": "674ec048d11a93e0dba97a4b",
    "tags": ["career", "job", "developer"]
  }'

 curl -X GET "http://localhost:3000/api/v1/blogs?authorType=Company&authorId=674ec048d11a93e0dba97a4b" 




"674a88cd648ccc323960711c"   - Joanna 

curl -X POST http://localhost:3000/api/v1/blogs/   -H "Content-Type: application/json"   -d '{
    "title": "Joanna title",
    "content": "Joanna blog",
    "authorType": "Company",
    "authorId": "674a88cd648ccc323960711c",
    "tags": ["career", "job", "developer"]
  }'


*/