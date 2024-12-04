const blogService = require("../services/blogService");
const { formatResponse } = require("../utils/helper");

const {
  createBlogByApplicant,
  createBlogByCompany,
  getBlogsByApplicant,
  getBlogsByCompany,
  postComment,
  fetchAllComments,
  postLike,
  fetchAllLikes
} = blogService;

/**
 * Controller to handle creating a blog post (Applicant or Company)
 */
const createBlog = async (req, res) => {
  const { title, content, tags, image, authorType, authorId } = req.body;

  // Validate input
  if (!title || !content || !authorType || !authorId) {
    return res
      .status(400)
      .json({
        message: "Title, content, authorType, and authorId are required",
      });
  }

  try {
    let newBlog;

    // Depending on the author type, call the respective service
    if (authorType === "Applicant") {
      newBlog = await createBlogByApplicant({ title, content, tags }, authorId);
    } else if (authorType === "Company") {
      newBlog = await createBlogByCompany({ title, content, tags }, authorId);
    } else {
      return res
        .status(400)
        .json({
          message:
            "Invalid author type. It must be either Applicant or Company.",
        });
    }

    const response = formatResponse(
      "success",
      "NewBlog created successfully",
      newBlog
    );
    // Return the created blog
    return res.status(201).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error creating blog: ${error.message}` });
  }
};

/**
 * Controller to get blogs by applicant or company
 * @param {Object} req - The request object containing authorType and authorId in the query params
 * @param {Object} res - The response object to send back the data or errors
 */
const getBlogs = async (req, res) => {
  const { authorType, authorId } = req.query; // Get authorType and authorId from the query parameters

  // Validate input
  if (!authorType || !authorId) {
    return res
      .status(400)
      .json({ message: "authorType and authorId are required" });
  }

  // Validate that authorType is either 'Applicant' or 'Company'
  if (!["Applicant", "Company"].includes(authorType)) {
    return res
      .status(400)
      .json({
        message:
          'Invalid authorType. It must be either "Applicant" or "Company".',
      });
  }

  try {
    let blogs;

    // Fetch blogs based on the authorType
    if (authorType === "Applicant") {
      blogs = await getBlogsByApplicant(authorId); // Call service to fetch blogs by applicant
    } else if (authorType === "Company") {
      blogs = await getBlogsByCompany(authorId); // Call service to fetch blogs by company
    }

    // If no blogs are found, return a 404 response
    if (blogs.length === 0) {
      return res
        .status(404)
        .json({
          message: `No blogs found for this ${authorType.toLowerCase()}`,
        });
    }

    const response = formatResponse(
      "success",
      "NewBlog created successfully",
      blogs
    );
    // Return the fetched blogs
    return res.status(200).json({ response });
  } catch (error) {
    // Handle any errors that occur during the fetching process
    return res
      .status(500)
      .json({ message: `Error fetching blogs: ${error.message}` });
  }
};

/**
 * Controller to post a comment on a blog
 */
const postCommentHandler = async (req, res) => {
    
    const {blogId} = req.params;
    const {  authorType, authorId, content } = req.body;

  if (!blogId || !authorType || !authorId || !content) {
    return res
      .status(400)
      .json({
        message: "Blog ID, author type, author ID, and content are required.",
      });
  }

  try {
    const newComment = await postComment(blogId, authorType, authorId, content);
    
    const response = formatResponse(
        "success",
        "NewComment posted successfully",
        newComment
      );

    return res
      .status(201)
      .json(response);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error posting comment: ${err.message}` });
  }
};

/**
 * Controller to fetch all comments of a blog
 */
const fetchAllCommentsHandler = async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required." });
  }

  try {
    const comments = await fetchAllComments(blogId);

    const response = formatResponse(
        "success",
        "comments fetched successfully",
        comments
    );
    
    return res.status(200).json( response );
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error fetching comments: ${err.message}` });
  }
};

const postLikeHandler = async (req, res) => {
    const { blogId } = req.params;
    const { authorType, authorId } = req.body;
  
    // Validate the input
    if (!blogId || !authorType || !authorId) {
      return res.status(400).json({
        message: "Blog ID, author type, and author ID are required.",
      });
    }
  
    try {
      // Call the service to post a like
      const newLike = await postLike(blogId, authorType, authorId);
  
      // Format and return the response
      const response = formatResponse(
        "success",
        "Like posted successfully",
        newLike
      );
  
      return res.status(201).json(response);
    } catch (err) {
      return res.status(500).json({ message: `Error posting like: ${err.message}` });
    }
  };
  
  /**
   * Controller to fetch all likes of a blog
   */
  const fetchAllLikesHandler = async (req, res) => {
    const { blogId } = req.params;
  
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required." });
    }
  
    try {
      // Call the service to fetch all likes
      const likes = await fetchAllLikes(blogId);
  
      // Format and return the response
      const response = formatResponse(
        "success",
        "Likes fetched successfully",
        likes
      );
  
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ message: `Error fetching likes: ${err.message}` });
    }
  };


module.exports = {
  createBlog,
  getBlogs,
  postCommentHandler,
  fetchAllCommentsHandler,
  postLikeHandler,
  fetchAllLikesHandler
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


  curl -X POST http://localhost:3000/api/v1/blogs/674fbeb38729995cd59ac9c6/comment   -H "Content-Type: application/json"   -d '{
    "authorType": "Applicant",
    "authorId": "674fbee48729995cd59ac9d3",
    "content": "Thanks again"
  }'

curl -X GET http://localhost:3000/api/v1/blogs/674fbeb38729995cd59ac9c6/comments

curl -X POST http://localhost:3000/api/v1/blogs/674fbeb38729995cd59ac9c6/like   -H "Content-Type: application/json"   -d '{
    "authorType": "Applicant",
    "authorId": "674fbee48729995cd59ac9d3"
  }'
{"status":"success","message":"Like posted successfully","data":{"blogId":"674fbeb38729995cd59ac9c6","authorType":"Applicant","authorId":"674fbee48729995cd59ac9d3","_id":"674fd06d2a80572c5efd53c3","createdAt":"2024-12-04T03:45:49.718Z","__v":0}}


curl -X GET http://localhost:3000/api/v1/blogs/674fbeb38729995cd59ac9c6/likes
{"status":"success","message":"Likes fetched successfully","data":[{"_id":"674fd0d22a80572c5efd53c8","blogId":"674fbeb38729995cd59ac9c6","authorType":"Company","authorId":{"_id":"674fbf688729995cd59aca28","name":"Company1"},"createdAt":"2024-12-04T03:47:30.027Z","__v":0},{"_id":"674fd06d2a80572c5efd53c3","blogId":"674fbeb38729995cd59ac9c6","authorType":"Applicant","authorId":{"_id":"674fbee48729995cd59ac9d3","name":"Mohan  Shanmugam"},"createdAt":"2024-12-04T03:45:49.718Z","__v":0}]}

*/
