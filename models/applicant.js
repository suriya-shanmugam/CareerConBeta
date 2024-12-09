const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true,
  },
  resume: {
    type: String // Base64 encoded file
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  skills: {
    type: [String], // Array of skills
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
  followingApplicants: [{
    type: Schema.Types.ObjectId,
    ref: 'Applicant', // Reference to the Applicant collection
  }],
  professionalExperience: {
    type: Number, // Number of years of professional experience
  },
  professionalSummary: {
    type: String, // Rich text for professional summary (use a package for rich text if needed)
  },
  education: [{
    collegeName: {
      type: String,
      required: true,
    },
    fromYear: {
      type: Number,
      required: true,
    },
    toYear: {
      type: Number,
      required: true,
    }
  }],
  experience: [{
    companyName: {
      type: String,
      required: true,
    },
    fromYear: {
      type: Number,
      required: true,
    },
    toYear: {
      type: Number,
      required: true,
    }
  }],
});

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
