const mongoose = require('mongoose');
const { Schema } = mongoose;

// Applicant Schema definition
const applicantSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true,
  },
  resume: {
    type: String, // Base64 encoded file
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{3}-\d{3}-\d{4}$/, 'Please use a valid phone number format: XXX-XXX-XXXX']
  },
  address: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // Array of skills
    required: true,
  },
  appliedJobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job collection
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followingCompanies: [{
    type: Schema.Types.ObjectId,
    ref: 'Company', // Reference to the Company collection
  }],
});

module.exports = mongoose.model('Applicant', applicantSchema);
