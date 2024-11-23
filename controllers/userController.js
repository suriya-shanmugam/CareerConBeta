const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Controller to create a new user
const createUser = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new User document
    const newUser = new User({
      email,
      passwordHash,
      role,
      firstName,
      lastName,
    });

    // Save to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Controller to fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};


/*

curl -X POST http://localhost:5000/api/users -H "Content-Type: application/json" -d '{
  "email": "john.doe@example.com",
  "password": "strongpassword",
  "role": "Applicant",
  "firstName": "John",
  "lastName": "Doe"
}'


*/


/*
curl http://localhost:5000/api/users

*/