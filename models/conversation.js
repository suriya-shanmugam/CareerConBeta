const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for comments
const CommentSchema = new Schema({
  userRef: { // Reference to either Applicant or Company
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'createdByType' // Dynamic reference based on 'createdByType'
  },
  createdByType: { // This will be either 'Applicant' or 'Company'
    type: String,
    enum: ['Applicant', 'Company'],
    required: true
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const LikeSchema = new Schema({
  userRef: { // Reference to either Applicant or Company
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'createdByType' // Dynamic reference based on 'createdByType'
  },
  createdByType: { // This will be either 'Applicant' or 'Company'
    type: String,
    enum: ['Applicant', 'Company'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});


const ConversationSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { // Creator of the conversation - either Applicant or Company
    type: String,
    enum: ['Applicant', 'Company'],
    required: true
  },
  userRef: {
    type: Schema.Types.ObjectId,
    refPath: 'createdBy', // Dynamic reference to either Applicant or Company
    required: true
  },
  likes: [LikeSchema],
  comments: [CommentSchema],
});

// Indexing for improved query performance
ConversationSchema.index({ createdAt: -1 });

// Model creation
const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
