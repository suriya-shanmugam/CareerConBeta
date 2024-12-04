const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const likeSchema = new Schema({
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Index for fast querying likes by blogId
  likeSchema.index({ blogId: 1 });
  
  const Like = mongoose.model('Like', likeSchema);
  module.exports = Like;
  