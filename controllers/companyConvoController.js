const conversationService = require('../services/conversationService');
const { formatResponse } = require('../utils/helper');

// Controller: Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { title, content } = req.body;
    //console.log(req.params  )
    const { companyid } = req.params;
    
    const conversationData = {
      title,
      content,
      createdBy: 'Company', // assuming the creator is always an 'Applicant' for this example
      userRef : companyid,
    };


    const conversation = await conversationService.createConversation(conversationData);
    const response = formatResponse('success', 'Conversation created successfully', conversation);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Get all conversations for companies
const getConversations = async (req, res) => {
  try {
    
    const { companyid } = req.params; // Get companyid from the route parameter
    const filters = { userRef: companyid }; // Filter conversations by companyid
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


/*
curl -X GET http://localhost:3000/api/v1/companies/67412362def542ecb4d14f07/conversations -H "Content-Type: application/json"

*/



/*

curl -X POST http://localhost:3000/api/v1/companies/67412362def542ecb4d14f07/conversations -H "Content-Type: application/json" -d '{
    "title": "New Product Launch",
    "content": "We are excited to announce our new product release. Stay tuned for updates!",
    "createdBy": "Company",
    "userRef": "67412e8f6d1f27a291c13626" 
  }'

*/