const express = require('express');
const router = express.Router();
const {
    getConversations,
    updateConversation,
    deleteConversation,
    addLike,
    removeLike,
    addComment,
    removeComment
  } = require('../controllers/convoController');

// Route to get all conversations for an applicant
router.get('/conversations', getConversations);

// Route to update a specific conversation
router.put('/:id', updateConversation);

// Route to delete a specific conversation
router.delete('/:id', deleteConversation);

// Route to add a like to a conversation
router.post('/:id/like', addLike);

// Route to remove a like from a conversation
router.delete('/:id/like', removeLike);

// Route to add a comment to a conversation
router.post('/:id/comment', addComment);

// Route to remove a comment from a conversation
router.delete(':id/comment/:commentId', removeComment);

module.exports = router;
  