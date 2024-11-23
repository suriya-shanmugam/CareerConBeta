// models/Recruiter.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Recruiter schema
const recruiterSchema = new Schema({
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User collection
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',  // Assuming you have a Company collection
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create the Recruiter model
const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;
