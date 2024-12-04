const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Blog schema for blog posts
const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
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
  tags: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
});

// Index for efficient querying of blog posts by author
blogSchema.index({ authorType: 1, authorId: 1 });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
