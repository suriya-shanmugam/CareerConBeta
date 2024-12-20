const Conversation = require('../models/conversation');
const Applicant = require('../models/applicant');

// Service to create a new conversation
const createConversation = async (conversationData) => {
  try {
    const conversation = new Conversation({
      ...conversationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await conversation.save();
  } catch (error) {
    throw new Error('Error creating conversation: ' + error.message);
  }
};

// Service to get all conversations with optional filters
const getAllConversations = async (filters) => {
  try {
    return await Conversation.find(filters).populate('userRef');
  } catch (error) {
    throw new Error('Error fetching conversations: ' + error.message);
  }
};

// Service to get conversations for an applicant based on followed companies
const getConversationsByApplicant = async (applicantId) => {
  
  try {
    // Step 1: Find the applicant by their ID
    const applicant = await Applicant.findById(applicantId).populate('followingCompanies');
    
    if (!applicant) {
      throw new Error('Applicant not found');
    }

    // Step 2: Get the list of company IDs the applicant follows
    const followedCompanyIds = applicant.followingCompanies.map(company => company._id);

    // Step 3: Retrieve conversations where the createdByType is 'Company' and userRef matches a followed company
    const conversations = await Conversation.find({
      createdBy: 'Company',
      userRef: { $in: followedCompanyIds }
    }).populate('userRef');  // Optionally populate company details

    return conversations;
  } catch (error) {
    throw new Error('Error fetching conversations: ' + error.message);
  }
};


// Service to update a conversation by ID
const updateConversationById = async (conversationId, updateData) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        conversation[key] = updateData[key];
      }
    });

    conversation.updatedAt = Date.now();
    return await conversation.save();
  } catch (error) {
    throw new Error('Error updating conversation: ' + error.message);
  }
};

// Service to delete a conversation by ID
const deleteConversationById = async (conversationId) => {
  try {
    const result = await Conversation.findByIdAndDelete(conversationId);
    if (!result) {
      throw new Error('Conversation not found');
    }
    return result;
  } catch (error) {
    throw new Error('Error deleting conversation: ' + error.message);
  }
};

// Service to add a like to a conversation
const updateLikes = async (conversationId, userId, createdByType) => {
  try {
    console.log(conversationId);
    console.log(userId);
    console.log(createdByType);
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if the user has already liked the conversation
    const existingLike = conversation.likes.find(
      (like) => like.userRef.toString() === userId.toString() && like.createdByType === createdByType
    );
    if (existingLike) {
      throw new Error('User has already liked this conversation');
    }

    // Add the like
    conversation.likes.push({ userRef: userId, createdByType, createdAt: new Date() });
    return await conversation.save();
  } catch (error) {
    throw new Error('Error adding like: ' + error.message);
  }
};

// Service to remove a like from a conversation
const removeLike = async (conversationId, userId, createdByType) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Find the index of the like to remove
    const likeIndex = conversation.likes.findIndex(
      (like) => like.userRef.toString() === userId.toString() && like.createdByType === createdByType
    );
    if (likeIndex === -1) {
      throw new Error('Like not found');
    }

    // Remove the like
    conversation.likes.splice(likeIndex, 1);
    return await conversation.save();
  } catch (error) {
    throw new Error('Error removing like: ' + error.message);
  }
};

// Service to add a comment to a conversation
const updateComments = async (conversationId, userId, createdByType, content) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Add the comment
    conversation.comments.push({
      userRef: userId,
      createdByType,
      content,
      createdAt: new Date(),
    });

    return await conversation.save();
  } catch (error) {
    throw new Error('Error adding comment: ' + error.message);
  }
};

// Service to remove a comment from a conversation
const removeComment = async (conversationId, commentId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Find the index of the comment to remove
    const commentIndex = conversation.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    // Remove the comment
    conversation.comments.splice(commentIndex, 1);
    return await conversation.save();
  } catch (error) {
    throw new Error('Error removing comment: ' + error.message);
  }
};

// Service to fetch all comments for a conversation
const fetchAllComments = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation.comments;
  } catch (error) {
    throw new Error('Error fetching comments: ' + error.message);
  }
};

// Service to fetch the count of likes for a conversation
const fetchLikesCount = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation.likes.length;
  } catch (error) {
    throw new Error('Error fetching likes count: ' + error.message);
  }
};

// Service to fetch the count of comments for a conversation
const fetchCommentsCount = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation.comments.length;
  } catch (error) {
    throw new Error('Error fetching comments count: ' + error.message);
  }
};


module.exports = {
  createConversation,
  getAllConversations,
  updateConversationById,
  deleteConversationById,
  updateLikes,
  removeLike,
  updateComments,
  removeComment,
  fetchAllComments,
  fetchLikesCount,
  fetchCommentsCount,
  getConversationsByApplicant
};
