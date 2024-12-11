// /controllers/clearDataController.js
const User = require("../models/user");
const Applicant = require('../models/applicant');
const Recruiter = require('../models/recruiter');

const Company = require('../models/company');
const Job = require('../models/job');

const Blog = require('../models/blog');
const Like = require("../models/like");
const Comment = require('../models/comment');

// Controller to clear all collections
const clearAllData = async (req, res) => {
  try {
    // Delete all documents from each collection
    await User.deleteMany({});
    await Applicant.deleteMany({});
    await Recruiter.deleteMany({});

    await Company.deleteMany({});

    await Blog.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});

    res.status(200).json({ message: 'All collections cleared successfully' });
  } catch (error) {
    console.error('Error clearing collections:', error);
    res.status(500).json({ error: 'Failed to clear collections' });
  }
};

module.exports = { clearAllData };

/*
curl -X DELETE http://localhost:5000/api/v1/clear-all-data
*/