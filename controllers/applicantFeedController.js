const {formatResponse} = require('../utils/helper')
const { getBlogsFromFollowedEntities } = require('../services/blogService'); // Import the service

//const { getConversationsByApplicant } = require('../services/conversationService');

/*
// Controller function to handle fetching conversations for a specific applicant
const getApplicantFeeds = async (req, res) => {
  
    const { applicantsid } = req.params; // Extract applicantId from the route parameter
  
  try {
    // Step 1: Fetch conversations for the given applicant
    const conversations = await getConversationsByApplicant(applicantsid);
    
    // Step 2: Respond with the conversations
    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    // Step 3: Handle errors and send an error response
    return res.status(500).json({
      success: false,
      message: 'Error fetching applicant feeds: ' + error.message,
    });
  }
}; */


/**
 * Controller to get blogs from followed companies and applicants of an applicant
 * @param {Object} req - The request object containing the applicantId in the query params
 * @param {Object} res - The response object to send the data or errors
 */
/*const getBlogsFromFollowed = async (req, res) => {
  const { applicantId } = req.params; // Get the applicantId from the query parameters

  if (!applicantId) {
    return res.status(400).json({ message: 'applicantId is required' });
  }

  try {
    const blogs = await getBlogsFromFollowedEntities(applicantId);  // Fetch blogs for the applicant
    const response = formatResponse('success', 'blogs fetched successfully', blogs)
    // If no blogs are found, return a message indicating so
    
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: `Error fetching blogs: ${err.message}` });
  }
};*/


const getBlogsFromFollowed = async (req, res) => {
  const { applicantId } = req.params; // Get the applicantId from the query parameters
  const { cursor, limit } = req.query; // Get the cursor and limit from the query parameters (limit is optional)

  // Validate the applicantId
  if (!applicantId) {
    return res.status(400).json({ message: 'applicantId is required' });
  }

  // Set default values for limit and cursor if not provided
  const paginationLimit = parseInt(limit) || 10; // Default limit to 10 if not specified
  const paginationCursor = cursor || null; // Default cursor to null if not specified

  try {
    // Fetch blogs with cursor-based pagination
    const { blogs, nextCursor } = await getBlogsFromFollowedEntities(applicantId, paginationCursor, paginationLimit);

    // Prepare the response format
    const response = formatResponse('success', 'Blogs fetched successfully', {
      blogs,
      nextCursor, // Return the nextCursor to facilitate pagination on the front end
    });

    // If no blogs are found, return a message indicating so
    if (blogs.length === 0) {
      return res.status(200).json({ message: 'No blogs found' });
    }

    // Return the blogs along with the nextCursor for pagination
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: `Error fetching blogs: ${err.message}` });
  }
};



module.exports = {
  getBlogsFromFollowed,
};
