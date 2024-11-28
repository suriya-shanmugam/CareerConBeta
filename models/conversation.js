const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for comments
const CommentSchema = new Schema({
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Sub-schema for likes
const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// Main Conversation schema
const ConversationSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: {
    type: String,
    enum: ['Applicant', 'Company'],
    required: true,
  },
  userRef: {
    type: Schema.Types.ObjectId,
    refPath: 'createdBy',
    required: true,
  },
  likes: [LikeSchema],
  comments: [CommentSchema],
});

// Indexing for improved query performance
ConversationSchema.index({ createdAt: -1 });

// Model creation
const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
