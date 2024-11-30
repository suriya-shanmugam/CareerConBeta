const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema definition
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Applicant', 'Recruiter', 'Moderator'],
    required: true,
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

// Define the matchPassword method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next(); // If password is not modified, proceed to the next middleware
  }

  // Hash the password before saving it to the database
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
