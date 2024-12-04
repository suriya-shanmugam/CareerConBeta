const jwt = require("jsonwebtoken");

const User = require("../models/user");

const applicantService = require("../services/applicantService");
const companyService = require("../services/companyService");
const recruiterService = require("../services/recruiterService");

// Service to create a new user
const createUser = async (userData) => {
  const { email, passwordHash, role, firstName, lastName, additionalData } =
    userData;

  // Create the base user
  const user = await User.create({
    email,
    passwordHash,
    role,
    firstName,
    lastName,
  });
  const fullname = firstName+" "+lastName;
  if (role === "Applicant") {
    await applicantService.createApplicant(user._id,fullname,additionalData);
  } else if (role === "Recruiter") {
    
    const { companyDetails } = additionalData;

    // Recruiter-specific validations
    if (!companyDetails || !companyDetails.name || !companyDetails.industry || !companyDetails.location || !companyDetails.website) {
      throw new Error('Missing required company details: name, industry, location, or website.');
    }

    // Create or fetch the company
    const company = await companyService.createCompany(companyDetails);
    await recruiterService.createRecruiter({
      userId: user._id,
      companyId: company._id,
    });
  }

  return user;
};

// Service to fetch all users
const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

// Service to sign in user (generate JWT)
const signInUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Check if password matches
  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid credentials');
  }

  console.log("matched");
  // Generate JWT token
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  return { user, token };
};

module.exports = {
  createUser,
  getAllUsers,
  signInUser
};


