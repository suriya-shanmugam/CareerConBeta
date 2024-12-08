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
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    let userId = user._id;  // Default to user._id in case neither Applicant nor Recruiter

    // Handle different roles (Applicant vs Recruiter)
    if (user.role === 'Recruiter') {
      // Check if the recruiter already has a record, or create a new one
      let recruiter = await Recruiter.findOne({ userId: user._id }).populate('companyId');
      
      if (!recruiter) {
        // Create a new recruiter record if it doesn't exist
        recruiter = new Recruiter({
          userId: user._id,
          companyId: req.body.companyId, // You should pass the companyId in the request body
        });
        await recruiter.save();
      }

      // Set the recruiterId (use the Recruiter's ID in the response)
      userId = recruiter._id;

      // Add company details to the response
      if (recruiter && recruiter.companyId) {
        const company = recruiter.companyId; // Already populated
        userResponse.companyId = company._id;
        userResponse.companyName = company.name;
        userResponse.companyDescription = company.description;
        userResponse.companyIndustry = company.industry;
        userResponse.companyLocation = company.location;
        userResponse.companyWebsite = company.website;
      }

    } else if (user.role === 'Applicant') {
      // Check if the applicant already has a record, or create a new one
      let applicant = await Applicant.findOne({ userId: user._id });

      if (!applicant) {
        // Create a new applicant record if it doesn't exist
        applicant = new Applicant({
          userId: user._id,
        });
        await applicant.save();
      }

      // Set the applicantId (use the Applicant's ID in the response)
      userId = applicant._id;

      // Add applicant details if needed
      userResponse.resume = applicant.resume;
      userResponse.phone = applicant.phone;
      userResponse.skills = applicant.skills;
    }

    // Add the ID (applicantId or recruiterId) to the response
    userResponse.id = userId;

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
