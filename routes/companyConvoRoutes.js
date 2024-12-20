const express = require("express");
const router = express.Router();
const companyConversationController = require('../controllers/companyConvoController');

// Route to create a new conversation
router.post('/:companyid/conversations/', companyConversationController.createConversation);

// Route to get all conversations for companies
router.get('/:companyid/conversations/', companyConversationController.getConversations);

// Route to update a conversation by ID
router.put('/:companyid/conversations/:id', companyConversationController.updateConversation);

// Route to delete a conversation by ID
router.delete('/:companyid/conversations/:id', companyConversationController.deleteConversation);

module.exports = router;
