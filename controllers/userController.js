const Recruiter = require("../models/recruiter");
const Applicant = require("../models/applicant");
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const { companyCreatedEvent } = require('../events/companyCreatedEvent');
const {publishEvent} = require('../utils/rabbitmqService')


// Controller to handle creating a new user
const createUser = async (req, res) => {
  try {
    const { email, role, firstName, lastName, additionalData } =
      req.body;

    if (!["Applicant", "Recruiter", "Moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await userService.createUser({
      email,
      role,
      firstName,
      lastName,
      additionalData,
    });

    // Prepare the basic user info
    /*const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };*/

    const userResponse = {
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    // If the user is a Recruiter, fetch their company details
    if (
      role === "Recruiter" &&
      additionalData &&
      additionalData.companyDetails
    ) {
      const recruiter = await Recruiter.findOne({ userId: user._id }).populate(
        "companyId"
      );
      if (!recruiter || !recruiter.companyId) {
        throw new Error("Recruiter does not have an associated company.");
      }
      userResponse.id = recruiter._id;
      const company = recruiter.companyId; // Already populated
      userResponse.companyId = company._id;
      userResponse.companyName = company.name;
      userResponse.companyDescription = company.description;
      userResponse.companyIndustry = company.industry;
      userResponse.companyLocation = company.location;
      userResponse.companyWebsite = company.website;
      
      const companyEvent = companyCreatedEvent(company._id,company.name);
      publishEvent(companyEvent);
    }else if (role === "Applicant") {
      const applicant = await Applicant.findOne({ userId: user._id });
      userResponse.id = applicant._id;
    }

    

    // Send the response with user data and token
    res.status(201).json({
      user: userResponse,
    });
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

// Controller to handle fetching a user by ID
const getUserByEmail = async (req, res) => {
  console.log('req.params.id',req.params.id);
  try {
    const email = req.params.id;
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(200).json({ userExists: false });
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.status(200).json({ userExists: true, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
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
