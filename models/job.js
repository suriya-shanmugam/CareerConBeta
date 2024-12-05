// models/Job.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Job schema
const jobSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
  location: { type: String, required: true },
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  department: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  applicationsCount: { type: Number, default: 0 },
  jobLink: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value);
      },
      message: 'Invalid URL format',
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create the Job model
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
