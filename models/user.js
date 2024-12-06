const mongoose = require('mongoose');
const Applicant = require('./applicant');
const Recruiter = require('./recruiter');

// User Schema definition
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  role: {
    type: String,
    enum: ['Applicant', 'Recruiter', 'Moderator'],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


userSchema.pre('remove', async function (next) {
  await Applicant.deleteMany({ userId: this._id });
  await Recruiter.deleteMany({ userId: this._id });
  next();
});

module.exports = mongoose.model('User', userSchema);