const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Service to create a new user
const createUser = async (userData) => {
  const { email, password, role, firstName, lastName } = userData;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    email,
    passwordHash,
    role,
    firstName,
    lastName,
  });

  try {
    return await newUser.save();
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

// Service to fetch all users
const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
};
