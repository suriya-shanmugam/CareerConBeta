const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    authorType: {
      type: String,
      enum: ['Applicant', 'Company'],
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      refPath: 'authorType',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Index for fast querying comments by blogId
  commentSchema.index({ blogId: 1 });
  
  const Comment = mongoose.model('Comment', commentSchema);
  module.exports = Comment;
  