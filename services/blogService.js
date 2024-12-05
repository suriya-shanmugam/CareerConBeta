const Applicant = require("../models/applicant");
const Company = require("../models/company");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const Like = require("../models/like");

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
 * Fetch a single blog written by a specific Applicant and populate the user info
 * @param {ObjectId} applicantId - The ObjectId of the Applicant
 * @param {ObjectId} blogId - The ObjectId of the Blog to fetch
 * @returns {Promise} - The single blog written by the applicant with populated user info
 */
const getBlogByApplicant = async (applicantId, blogId) => {
  try {
    // Use findOne to get a specific blog by the applicant's ID and the blog's ID
    const blog = await Blog.findOne({
      _id: blogId
    })
      .populate("authorId", "name") // Populate the author info (e.g., name)
      .exec();

    const blogObj = blog.toObject();

    // Check if the applicant has liked the blog
    const like = await Like.findOne({
      blogId: blog._id,
      authorType: "Applicant",
      authorId: applicantId,
    });

    // Add the `likedByUser` field
    blogObj.likedByUser = like ? true : false;

    if (!blog) {
      throw new Error("Blog not found for the given applicant.");
    }

    return blogObj;
  } catch (err) {
    throw new Error("Error fetching blog for applicant: " + err.message);
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
/* const getBlogsFromFollowedEntities = async (applicantId) => {
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
  */

/*const getBlogsFromFollowedEntities = async (
  applicantId,
  cursor = null,
  limit = 10
) => {
  try {
    // Step 1: Find the applicant's following companies and applicants
    const applicant = await Applicant.findById(applicantId)
      .populate("followingCompanies") // Populate following companies
      .populate("followingApplicants"); // Populate following applicants

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    // Step 2: Get an array of company IDs and applicant IDs from the applicant's followings
    const followedCompanyIds = Array.isArray(applicant.followingCompanies)
      ? applicant.followingCompanies.map((company) => company._id)
      : [];

    const followedApplicantIds = Array.isArray(applicant.followingApplicants)
      ? applicant.followingApplicants.map((applicant) => applicant._id)
      : [];

    // Step 3: Construct the query filters for pagination (only use the cursor if provided)
    const paginationFilter = cursor
      ? { createdAt: { $lt: new Date(cursor) } }
      : {};

    // Step 4: Fetch blogs for the applicant's own blogs first
    const ownBlogs = await Blog.find({
      authorType: "Applicant",
      authorId: applicantId, // Fetch only the applicant's own blogs
      ...paginationFilter, // Apply pagination filter
    })
      .populate("authorId", "name") // Populate author info
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(limit); // Limit to specified number

    // If own blogs don't breach the limit, continue with the next category
    let blogs = [...ownBlogs];

    // Step 5: If there's still space for more blogs, fetch blogs for followed companies
    if (blogs.length < limit) {
      const remainingLimit = limit - blogs.length;

      const companyBlogs =
        followedCompanyIds.length > 0
          ? await Blog.find({
              authorType: "Company",
              authorId: { $in: followedCompanyIds }, // Fetch blogs from followed companies
              ...paginationFilter, // Apply pagination filter
            })
              .populate("authorId", "name") // Populate company info
              .sort({ createdAt: -1 }) // Sort by most recent
              .limit(remainingLimit) // Limit to remaining blogs to stay under the limit
          : [];

      blogs = [...blogs, ...companyBlogs]; // Add company blogs to the result
    }

    // Step 6: If there's still space for more blogs, fetch blogs for followed applicants
    if (blogs.length < limit) {
      const remainingLimit = limit - blogs.length;

      const applicantBlogs =
        followedApplicantIds.length > 0
          ? await Blog.find({
              authorType: "Applicant",
              authorId: { $in: followedApplicantIds }, // Fetch blogs from followed applicants
              ...paginationFilter, // Apply pagination filter
            })
              .populate("authorId", "name") // Populate applicant info
              .sort({ createdAt: -1 }) // Sort by most recent
              .limit(remainingLimit) // Limit to remaining blogs to stay under the limit
          : [];

      blogs = [...blogs, ...applicantBlogs]; // Add applicant blogs to the result
    }

    // Step 7: Fetch and add the like status for each blog
    const blogsWithLikesStatus = await Promise.all(
      blogs.map(async (blog) => {
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

    // Step 8: Sort the combined blogs by creation date (most recent first)
    blogsWithLikesStatus.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Step 9: Return the blogs with pagination information
    return {
      blogs: blogsWithLikesStatus,
      nextCursor:
        blogsWithLikesStatus.length === limit
          ? blogsWithLikesStatus[blogsWithLikesStatus.length - 1].createdAt
          : null,
    };
  } catch (err) {
    throw new Error(
      "Error fetching blogs from followed entities: " + err.message
    );
  }
};*/

const getBlogsFromFollowedEntities = async (
  applicantId,
  cursor = null,
  limit = 10
) => {
  try {
    // Step 1: Find the applicant's following companies and applicants
    const applicant = await Applicant.findById(applicantId)
      .populate("followingCompanies") // Populate following companies
      .populate("followingApplicants"); // Populate following applicants

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    // Step 2: Get an array of company IDs and applicant IDs from the applicant's followings
    const followedCompanyIds = Array.isArray(applicant.followingCompanies)
      ? applicant.followingCompanies.map((company) => company._id)
      : [];

    const followedApplicantIds = Array.isArray(applicant.followingApplicants)
      ? applicant.followingApplicants.map((applicant) => applicant._id)
      : [];

    // Step 3: Construct the pagination filter based on the cursor for pagination
    const paginationFilter = cursor
      ? { createdAt: { $lt: new Date(cursor) } }
      : {};

    // Helper function to fetch blogs with cursor logic
    const fetchBlogs = async (filter, remainingLimit) => {
      return await Blog.find(filter)
        .populate("authorId", "name") // Populate author info
        .sort({ createdAt: -1 }) // Sort by most recent
        .limit(remainingLimit); // Limit to specified number
    };

    // Step 4: Fetch up to 10 blogs from the applicant's own blogs
    const ownBlogsFilter = {
      authorType: "Applicant",
      authorId: applicantId,
      ...paginationFilter,
    };
    const ownBlogs = await fetchBlogs(ownBlogsFilter, 10);

    // Step 5: Fetch up to 10 blogs from followed companies
    let companyBlogs = [];
    if (followedCompanyIds.length > 0) {
      const companyBlogsFilter = {
        authorType: "Company",
        authorId: { $in: followedCompanyIds },
        ...paginationFilter,
      };
      companyBlogs = await fetchBlogs(companyBlogsFilter, 10);
    }

    // Step 6: Fetch up to 10 blogs from followed applicants
    let applicantBlogs = [];
    if (followedApplicantIds.length > 0) {
      const applicantBlogsFilter = {
        authorType: "Applicant",
        authorId: { $in: followedApplicantIds },
        ...paginationFilter,
      };
      applicantBlogs = await fetchBlogs(applicantBlogsFilter, 10);
    }

    // Step 7: Combine all the blogs from the three sources
    const allBlogs = [...ownBlogs, ...companyBlogs, ...applicantBlogs];

    // Step 8: Sort the combined blogs by `createdAt` (most recent first)
    const sortedBlogs = allBlogs.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Step 9: Apply the limit for pagination (ensure we only return the top 'limit' blogs)
    const paginatedBlogs = sortedBlogs.slice(0, limit);

    // Step 10: Fetch and add the like status for each blog
    const blogsWithLikesStatus = await Promise.all(
      paginatedBlogs.map(async (blog) => {
        const blogObj = blog.toObject();

        // Check if the applicant has liked the blog
        const like = await Like.findOne({
          blogId: blog._id,
          authorType: "Applicant",
          authorId: applicantId,
        });

        // Add the `likedByUser` field
        blogObj.likedByUser = like ? true : false;

        return blogObj; // Return the updated blog object
      })
    );

    // Step 11: Set the next cursor (timestamp of the last blog in the current page)
    const nextCursor =
      blogsWithLikesStatus.length === limit
        ? blogsWithLikesStatus[blogsWithLikesStatus.length - 1].createdAt
        : null;

    return {
      blogs: blogsWithLikesStatus,
      nextCursor,
    };
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
      throw new Error("Blog not found");
    }

    // Step 2: Check if the like already exists
    const existingLike = await Like.findOne({ blogId, authorType, authorId });

    if (existingLike) {
      // If the like already exists, remove it (unlike)
      
      // Step 3: Remove the like from the database using deleteOne
      await Like.deleteOne({ blogId, authorType, authorId });

      // Step 4: Decrement the likesCount for the blog
      blog.likesCount -= 1;
      await blog.save();

      return { message: "You have unliked this blog" };
    } else {
      // If the like doesn't exist, create a new like (like the blog)
      
      // Step 3: Create a new like
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
    }
  } catch (err) {
    throw new Error("Error toggling like: " + err.message);
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
      throw new Error("Blog not found");
    }

    // Step 2: Fetch all likes related to the blog
    const likes = await Like.find({ blogId })
      .populate("authorId", "name") // Populate author info
      .sort({ createdAt: -1 }); // Sort likes by creation date, most recent first

    return likes;
  } catch (err) {
    throw new Error("Error fetching likes: " + err.message);
  }
};

module.exports = {
  createBlogByApplicant,
  createBlogByCompany,
  getBlogsByApplicant,
  getBlogByApplicant,
  getBlogsByCompany,
  getBlogsFromFollowedEntities,
  postComment,
  fetchAllComments,
  postLike,
  fetchAllLikes,
};
