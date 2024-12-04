const Applicant = require("../models/applicant"); // assuming the Applicant model is imported this way
const Company = require("../models/company"); // assuming the Company model is imported this way
const Blog = require("../models/blog"); // assuming the Blog model is imported this way

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
      .populate("authorId", "firstName") // Populate user info (only firstName, lastName, and email)
      .sort({ createdAt: -1 }); // Optional: sort by createdAt in descending order

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
        .populate('followingCompanies')  // Populate following companies
        .populate('followingApplicants');  // Populate following applicants
  
      // Step 2: Get an array of company IDs and applicant IDs from the applicant's followings
      const followedCompanyIds = applicant.followingCompanies.map(company => company._id);
      const followedApplicantIds = applicant.followingApplicants.map(applicant => applicant._id);
  
      // Step 3: Fetch blogs for the applicant's own blogs
      const ownBlogs = await Blog.find({
        authorType: 'Applicant',
        authorId: applicantId  // Fetch only the applicant's own blogs
      })
        .populate('authorId', 'firstName')  // Populate applicant info
        .sort({ createdAt: -1 });  // Sort by most recent
  
      // Step 4: Fetch blogs for followed companies
      const companyBlogs = await Blog.find({
        authorType: 'Company',
        authorId: { $in: followedCompanyIds }  // Fetch blogs from followed companies
      })
        .populate('authorId', 'name')  // Populate company info
        .sort({ createdAt: -1 });  // Sort by most recent
  
      // Step 5: Fetch blogs for followed applicants
      const applicantBlogs = await Blog.find({
        authorType: 'Applicant',
        authorId: { $in: followedApplicantIds }  // Fetch blogs from followed applicants
      })
        .populate('authorId', 'firstName')  // Populate applicant info
        .sort({ createdAt: -1 });  // Sort by most recent
  
      // Step 6: Combine the blogs from own blogs, followed companies, and followed applicants
      const allBlogs = [...ownBlogs, ...companyBlogs, ...applicantBlogs];
  
      // Step 7: Sort combined blogs by creation date (most recent first)
      allBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      return allBlogs;
    } catch (err) {
      throw new Error('Error fetching blogs from followed entities: ' + err.message);
    }
  };

module.exports = {
  createBlogByApplicant,
  createBlogByCompany,
  getBlogsByApplicant,
  getBlogsByCompany,
  getBlogsFromFollowedEntities,
};
