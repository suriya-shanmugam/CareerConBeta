const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
 
} = require('../controllers/applicantConvoController');

// Route to create a new conversation
router.post('/:applicantsid/conversations', createConversation);

// Route to get all conversations for an applicant
router.get('/:applicantsid/conversations', getConversations);

// Route to update a specific conversation
router.put('/:applicantsid/conversations/:id', updateConversation);

// Route to delete a specific conversation
router.delete('/:applicantsid/conversations/:id', deleteConversation);

/*
// Route to add a like to a conversation
router.post('/:applicantsid/conversations/:id/like', addLike);

// Route to remove a like from a conversation
router.delete('/:applicantsid/conversations/:id/like', removeLike);

// Route to add a comment to a conversation
router.post('/:applicantsid/conversations/:id/comment', addComment);

// Route to remove a comment from a conversation
router.delete('/:applicantsid/conversations/:id/comment/:commentId', removeComment); */

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