const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
} = require('../controllers/applicantConvoController');

// Route to create a new conversation
router.post('/', createConversation);

// Route to get all conversations for an applicant
router.get('/', getConversations);

// Route to update a specific conversation
router.put('/:id', updateConversation);

// Route to delete a specific conversation
router.delete('/:id', deleteConversation);

module.exports = router;

/*
curl -X POST http://localhost:3000/api/v1/applicants/67411fcec2efaed5e7b4b259/conversations -H "Content-Type: application/json" -d '{
  "title": "New User",
  "content": "We are excited to announce our new product release. Stay tuned for updates!",
  "createdBy": "Applicant",
  "userRef": "67411fcec2efaed5e7b4b259" 
}'


curl -X GET http://localhost:3000/api/v1/applicants/67411fcec2efaed5e7b4b259/conversations -H "Content-Type: application/json"

*/