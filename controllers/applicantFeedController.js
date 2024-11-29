const { getConversationsByApplicant } = require('../services/conversationService');

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
};

module.exports = {
  getApplicantFeeds,
};
