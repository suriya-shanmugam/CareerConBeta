const userService = require('../services/userService');

// Controller to handle creating a new user
const createUser = async (req, res) => {
  const { email, password, role, firstName, lastName } = req.body;

  try {
    const newUser = await userService.createUser({
      email,
      password,
      role,
      firstName,
      lastName,
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
};

// Controller to handle fetching all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
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