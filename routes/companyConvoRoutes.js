const express = require("express");
const router = express.Router();
const companyConversationController = require('../controllers/companyConvoController');

// Route to create a new conversation
router.post('/', companyConversationController.createConversation);

// Route to get all conversations for companies
router.get('/', companyConversationController.getConversations);

// Route to update a conversation by ID
router.put('/:id', companyConversationController.updateConversation);

// Route to delete a conversation by ID
router.delete('/:id', companyConversationController.deleteConversation);

module.exports = router;
