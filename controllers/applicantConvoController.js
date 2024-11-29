const conversationService = require('../services/conversationService');
const { formatResponse } = require('../utils/helper');

// Controller: Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { title, content } = req.body;
    //console.log(req.params  )
    const { applicantsid } = req.params;
    
    const conversationData = {
      title,
      content,
      createdBy: 'Applicant', // assuming the creator is always an 'Applicant' for this example
      userRef : applicantsid,
    };

    console.log(conversationData)
    const conversation = await conversationService.createConversation(conversationData);
    const response = formatResponse('success', 'Conversation created successfully', conversation);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Get all conversations for an applicant
const getConversations = async (req, res) => {
  try {
    const { applicantsid } = req.params; // Get companyid from the route parameter
    const filters = { userRef: applicantsid }; // Filter conversations by companyid
    const conversations = await conversationService.getAllConversations(filters);
    const response = formatResponse('success', 'Conversations fetched successfully', conversations);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Update a specific conversation
const updateConversation = async (req, res) => {
  try {
    const conversation = await conversationService.updateConversationById(req.params.id, req.body);
    const response = formatResponse('success', 'Conversation updated successfully', conversation);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller: Delete a specific conversation
const deleteConversation = async (req, res) => {
  try {
    await conversationService.deleteConversationById(req.params.id);
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/*
// Controller: Add a like to a conversation
const addLike = async (req, res) => {
  try {
    const { userId, createdByType } = req.body; // Expecting userId and createdByType in the request body
    const conversationId = req.params.id;
    
    if (!userId || !createdByType) {
      return res.status(400).json({ message: 'User ID and createdByType are required' });
    }

    const conversation = await conversationService.updateLikes(conversationId, userId, createdByType);
    const response = formatResponse('success', 'Like added successfully', conversation);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Remove a like from a conversation
const removeLike = async (req, res) => {
  try {
    const { userId, createdByType } = req.body; // Expecting userId and createdByType in the request body
    const conversationId = req.params.id;

    if (!userId || !createdByType) {
      return res.status(400).json({ message: 'User ID and createdByType are required' });
    }

    const conversation = await conversationService.removeLike(conversationId, userId, createdByType);
    const response = formatResponse('success', 'Like removed successfully', conversation);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Add a comment to a conversation
const addComment = async (req, res) => {
  try {
    const { userId, createdByType, content } = req.body; // Expecting userName and content in the request body
    const conversationId = req.params.id;

    if (!userId || !content) {
      return res.status(400).json({ message: 'User name and comment content are required' });
    }
    const conversation = await conversationService.updateComments(conversationId, userId, createdByType, content);
    //const conversation = await conversationService.updateComments(conversationId, userName, content);
    const response = formatResponse('success', 'Comment added successfully', conversation);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Remove a comment from a conversation
const removeComment = async (req, res) => {
  try {
    const { commentId } = req.params; // Expecting commentId as a route parameter
    const conversationId = req.params.id;

    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }

    const conversation = await conversationService.removeComment(conversationId, commentId);
    const response = formatResponse('success', 'Comment removed successfully', conversation);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/
module.exports = {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
};
/*

curl -X POST http://localhost:3000/api/v1/applicants/67411fcec2efaed5e7b4b259/conversations -H "Content-Type: application/json" -d '{
  "title": "New User",
  "content": "We are excited to announce our new product release. Stay tuned for updates!",
  "createdBy": "Applicant"
   
}'



curl -X GET http://localhost:3000/api/v1/applicants/674125ee12e57863fb60620e/conversations -H "Content-Type: application/json"



*/