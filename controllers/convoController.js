const conversationService = require('../services/conversationService');
const { formatResponse } = require('../utils/helper');
// Controller: Get all conversations for an applicant
const getConversations = async (req, res) => {
    try {
      
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
  
  module.exports = {
    getConversations,
    updateConversation,
    deleteConversation,
    addLike,
    removeLike,
    addComment,
    removeComment
  };

