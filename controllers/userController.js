const userService = require("../services/userService");

// Controller to handle creating a new user
const createUser = async (req, res) => {
  try {
    const { email, passwordHash, role, firstName, lastName, additionalData } =
      req.body;

    if (!["Applicant", "Recruiter", "Moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await userService.createUser({
      email,
      passwordHash,
      role,
      firstName,
      lastName,
      additionalData,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.message === "User already exists") {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }
};

// Controller to handle fetching all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};

/*

curl -X POST http://localhost:3000/api/v1/users -H "Content-Type: application/json" -d '{
  "email": "recruiter@example.com",
  "passwordHash": "hashedpassword123",
  "role": "Recruiter",
  "firstName": "Jane",
  "lastName": "Smith",
  "additionalData": {
    "companyDetails": {
      "name": "NewAICompany",
      "description": "A leading AItech company",
      "industry": "Technology",
      "location": "San Francisco, CA",
      "website": "https://newAIcorp.com"
    }
  }
}'


curl -X POST http://localhost:3000/api/v1/users -H "Content-Type: application/json" -d '{
  "email": "willian@example.com",
  "passwordHash": "hashedpassword123",
  "role": "Applicant",
  "firstName": "Jane",
  "lastName": "Smith"
  }'



*/

/*
curl http://localhost:5000/api/users

*/
