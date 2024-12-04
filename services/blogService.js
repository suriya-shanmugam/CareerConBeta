const Applicant = require("../models/applicant"); 
const Company = require("../models/company"); 
const Blog = require("../models/blog"); 
const Comment = require("../models/comment"); 
const Like = require('../models/like');  


/*const mapper = function mapDataArray(sourceArray) {
  return sourceArray.map((source) => ({
    _id: source._id, // Keep the same _id
    title: source.title, // Keep the same title
    content: source.content, // Keep the same content
    authorType: source.authorType, // Keep the same authorType
    authorId: {
      _id: source.authorId._id, // Keep the same _id from authorId
      name: source.authorId.userId.firstName, // Extract firstName as 'name'
    },
    tags: source.tags, // Keep the same tags
    likesCount: source.likesCount, // Keep the same likes count
    commentsCount: source.commentsCount, // Keep the same comments count
    createdAt: source.createdAt, // Keep the same createdAt timestamp
    updatedAt: source.updatedAt, // Keep the same updatedAt timestamp
    __v: source.__v, // Keep the same __v version
  }));
}; */

/**
 * Create a blog by Applicant
 * @param {Object} blogData - The data of the blog (title, content, etc.)
 * @param {String} applicantId - The Applicant's ID
 * @returns {Promise} The created blog
 */
const createBlogByApplicant = async (blogData, applicantId) => {
  try {
    // Ensure the applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      throw new Error("Applicant not found");
    }

    // Create new blog post
    const newBlog = new Blog({
      ...blogData,
      authorType: "Applicant",
      authorId: applicantId, // The blog author is the applicant
    });

    // Save the blog
    await newBlog.save();

    return newBlog;
  } catch (error) {
    throw new Error(`Error creating blog by Applicant: ${error.message}`);
  }
};

/**
 * Create a blog by Company
 * @param {Object} blogData - The data of the blog (title, content, etc.)
 * @param {String} companyId - The Company's ID
 * @returns {Promise} The created blog
 */
const createBlogByCompany = async (blogData, companyId) => {
  try {
    // Ensure the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    // Create new blog post
    const newBlog = new Blog({
      ...blogData,
      authorType: "Company",
      authorId: companyId, // The blog author is the company
    });

    // Save the blog
    await newBlog.save();

    return newBlog;
  } catch (error) {
    throw new Error(`Error creating blog by Company: ${error.message}`);
  }
};

/**
 * Fetch blogs written by a specific Applicant and populate the user info
 * @param {ObjectId} applicantId - The ObjectId of the Applicant
 * @returns {Promise} - The blogs written by the applicant with populated user info
 */
const getBlogsByApplicant = async (applicantId) => {
  try {
    const blogs = await Blog.find({
      authorType: "Applicant",
      authorId: applicantId,
    })
    .populate("authorId", "name")
    .sort({ createdAt: -1 }); // Optional: sort by createdAt in descending order

    //const blogswrapper = mapper(blogs);
    //console.log(blogswrapper);
    return blogs;
  } catch (err) {
    throw new Error("Error fetching blogs for applicant: " + err.message);
  }
};

/**
 * Service to fetch blogs for a company
 * @param {String} companyId - The ID of the company whose blogs are to be fetched
 * @returns {Promise<Array>} The list of blogs associated with the company
 */
const getBlogsByCompany = async (companyId) => {
  try {
    // Fetch blogs where the authorType is 'Company' and the authorId matches the provided companyId
    const blogs = await Blog.find({
      authorType: "Company",
      authorId: companyId,
    })
      .populate("authorId", "name") // Populate company info (name, industry, location, website)
      .sort({ createdAt: -1 }); // Optional: sort by createdAt in descending order

    return blogs;
  } catch (err) {
    throw new Error("Error fetching blogs for company: " + err.message);
  }
};

/**
 * Service to fetch blogs from followed companies, followed applicants, and the applicant's own blogs
 * @param {String} applicantId - The ID of the applicant whose followed entities' and own blogs we want to fetch
 * @returns {Promise<Array>} - Combined list of blogs from followed companies, followed applicants, and the applicant's own blogs
 */
const getBlogsFromFollowedEntities = async (applicantId) => {
    try {
      // Step 1: Find the applicant's following companies and applicants
      const applicant = await Applicant.findById(applicantId)
        .populate("followingCompanies") // Populate following companies
        .populate("followingApplicants"); // Populate following applicants
  
      // Check if applicant is null or undefined
      if (!applicant) {
        throw new Error("Applicant not found");
      }
  
      // Step 2: Get an array of company IDs and applicant IDs from the applicant's followings
      const followedCompanyIds = Array.isArray(applicant.followingCompanies) 
        ? applicant.followingCompanies.map((company) => company._id)
        : []; // Ensure it's an array, fallback to an empty array if not
  
      const followedApplicantIds = Array.isArray(applicant.followingApplicants) 
        ? applicant.followingApplicants.map((applicant) => applicant._id)
        : []; // Ensure it's an array, fallback to an empty array if not
  
      // Step 3: Fetch blogs for the applicant's own blogs
      const ownBlogs = await Blog.find({
        authorType: "Applicant",
        authorId: applicantId, // Fetch only the applicant's own blogs
      })
      .populate("authorId", "name") // Populate company info (name, industry, location, website)
      .sort({ createdAt: -1 }); // Optional: sort by createdAt in descending order
  
      // Step 4: Fetch blogs for followed companies
      const companyBlogs = followedCompanyIds.length > 0 
        ? await Blog.find({
            authorType: "Company",
            authorId: { $in: followedCompanyIds }, // Fetch blogs from followed companies
          })
          .populate("authorId", "name") // Populate company info
          .sort({ createdAt: -1 }) // Sort by most recent
        : []; // If no followed companies, return an empty array
  
      // Step 5: Fetch blogs for followed applicants
      const applicantBlogs = followedApplicantIds.length > 0 
        ? await Blog.find({
            authorType: "Applicant",
            authorId: { $in: followedApplicantIds }, // Fetch blogs from followed applicants
          })
          .populate("authorId", "name") // Populate company info (name, industry, location, website)
          .sort({ createdAt: -1 }) // Optional: sort by createdAt in descending order
        : []; // If no followed applicants, return an empty array
  
      // Step 6: Combine the blogs from own blogs, followed companies, and followed applicants
      let allBlogs = [
        ...ownBlogs,
        ...companyBlogs,
        ...applicantBlogs,
      ];
      
      const blogsWithLikesStatus = await Promise.all(
        allBlogs.map(async (blog) => {
          // Convert the blog to a plain JavaScript object
          const blogObj = blog.toObject(); 
  
          // Check if the applicant has liked the blog
          const like = await Like.findOne({
            blogId: blog._id,
            authorType: blog.authorType,
            authorId: applicantId,
          });
  
          // Add the `likedByUser` field
          blogObj.likedByUser = like ? true : false;
  
          return blogObj; // Return the updated blog object
        })
      );

      //console.log(blogsWithLikesStatus);

      // Step 7: Sort combined blogs by creation date (most recent first)
      blogsWithLikesStatus.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      return blogsWithLikesStatus;
    } catch (err) {
      throw new Error(
        "Error fetching blogs from followed entities: " + err.message
      );
    }
  };
  

/**
 * Service to post a comment on a blog
 * @param {String} blogId - The ID of the blog to comment on
 * @param {String} authorType - The type of the author (either 'Applicant' or 'Company')
 * @param {String} authorId - The ID of the author (applicant or company)
 * @param {String} content - The content of the comment
 * @returns {Promise<Object>} - The newly created comment
 */

const postComment = async (blogId, authorType, authorId, content) => {
  try {
    // Step 1: Validate that the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Step 2: Create the new comment
    const newComment = new Comment({
      blogId,
      authorType,
      authorId,
      content,
    });

    // Step 3: Save the comment to the database
    await newComment.save();

    // Step 4: Increment the commentsCount for the blog
    blog.commentsCount += 1;
    await blog.save();

    return newComment;
  } catch (err) {
    throw new Error("Error posting comment: " + err.message);
  }
};

/**
 * Service to fetch all comments of a blog
 * @param {String} blogId - The ID of the blog whose comments we want to fetch
 * @returns {Promise<Array>} - The list of comments for the blog
 */
const fetchAllComments = async (blogId) => {
  try {
    // Step 1: Validate that the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Step 2: Fetch all comments related to the blog
    const comments = await Comment.find({ blogId })
      .populate("authorId", "name") // Populate author info
      .sort({ createdAt: -1 }); // Sort comments by creation date, most recent first

    return comments;
  } catch (err) {
    throw new Error("Error fetching comments: " + err.message);
  }
};

/**
 * Service to post a like on a blog
 * @param {String} blogId - The ID of the blog to like
 * @param {String} authorType - The type of the author (either 'Applicant' or 'Company')
 * @param {String} authorId - The ID of the author (applicant or company)
 * @returns {Promise<Object>} - The newly created like
 */
const postLike = async (blogId, authorType, authorId) => {
    try {
      // Step 1: Validate that the blog exists
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error('Blog not found');
      }
  
      // Step 2: Check if the like already exists
      const existingLike = await Like.findOne({ blogId, authorType, authorId });
      if (existingLike) {
        throw new Error('You have already liked this blog');
      }
  
      // Step 3: Create the new like
      const newLike = new Like({
        blogId,
        authorType,
        authorId,
      });
  
      // Step 4: Save the like to the database
      await newLike.save();
  
      // Step 5: Increment the likesCount for the blog
      blog.likesCount += 1;
      await blog.save();
  
      return newLike;
    } catch (err) {
      throw new Error('Error posting like: ' + err.message);
    }
  };
  
  /**
   * Service to fetch all likes of a blog
   * @param {String} blogId - The ID of the blog whose likes we want to fetch
   * @returns {Promise<Array>} - The list of likes for the blog
   */
  const fetchAllLikes = async (blogId) => {
    try {
      // Step 1: Validate that the blog exists
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error('Blog not found');
      }
  
      // Step 2: Fetch all likes related to the blog
      const likes = await Like.find({ blogId })
        .populate('authorId', 'name')  // Populate author info
        .sort({ createdAt: -1 });  // Sort likes by creation date, most recent first
  
      return likes;
    } catch (err) {
      throw new Error('Error fetching likes: ' + err.message);
    }
  };


module.exports = {
  createBlogByApplicant,
  createBlogByCompany,
  getBlogsByApplicant,
  getBlogsByCompany,
  getBlogsFromFollowedEntities,
  postComment,
  fetchAllComments,
  postLike,
  fetchAllLikes
};
