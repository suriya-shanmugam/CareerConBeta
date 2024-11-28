const conversationService = require('../services/conversationService');
const { formatResponse } = require('../utils/helper');

// Controller: Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { title, content, userRef } = req.body;
    const conversationData = {
      title,
      content,
      createdBy: 'Applicant',
      userRef,
    };

    const conversation = await conversationService.createConversation(conversationData);
    const response = formatResponse('success', 'Conversation created successfully', conversation);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Get all conversations for applicants
const getConversations = async (req, res) => {
  try {
    const filters = { createdBy: 'Applicant' };
    const conversations = await conversationService.getAllConversations(filters);
    const response = formatResponse('success', 'Conversations fetched successfully', conversations);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Update a conversation
const updateConversation = async (req, res) => {
  try {
    const conversation = await conversationService.updateConversationById(req.params.id, req.body);
    const response = formatResponse('success', 'Conversation updated successfully', conversation);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller: Delete a conversation
const deleteConversation = async (req, res) => {
  try {
    await conversationService.deleteConversationById(req.params.id);
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
};
