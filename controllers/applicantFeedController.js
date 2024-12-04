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
const getBlogsFromFollowed = async (req, res) => {
  const { applicantId } = req.params; // Get the applicantId from the query parameters

  if (!applicantId) {
    return res.status(400).json({ message: 'applicantId is required' });
  }

  try {
    const blogs = await getBlogsFromFollowedEntities(applicantId);  // Fetch blogs for the applicant
    const response = formatResponse('success', 'blogs fetched successfully', blogs)
    // If no blogs are found, return a message indicating so
    if (blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found for followed companies or applicants.' });
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: `Error fetching blogs: ${err.message}` });
  }
};


module.exports = {
  getBlogsFromFollowed,
};
