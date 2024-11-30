// controllers/auth.controller.js
const userService = require("../services/userService");
const Recruiter = require("../models/recruiter"); // Recruiter model
const Company = require("../models/company"); // Company model

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in the user and get user details and token
    const { user, token } = await userService.signInUser(email, password);

    // Prepare the basic user info
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // If the user is a Recruiter, fetch their company details
    if (user.role === 'Recruiter') {
      // Fetch the recruiter details, including their associated company
      const recruiter = await Recruiter.findOne({ userId: user._id }).populate('companyId');
      if (!recruiter || !recruiter.companyId) {
        throw new Error('Recruiter does not have an associated company.');
      }

      // Add company details to the response
      const company = recruiter.companyId; // Already populated
      userResponse.companyId = company._id;
      userResponse.companyName = company.name;
      userResponse.companyDescription = company.description;
      userResponse.companyIndustry = company.industry;
      userResponse.companyLocation = company.location;
      userResponse.companyWebsite = company.website;
    }

    // Send the response with user data, token, and company details (if applicable)
    res.status(200).json({
      user: userResponse,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  signIn,
};


/*
curl -X POST http://localhost:3000/api/v1/auth/signin   -H "Content-Type: application/json"   -d '{
    "email": "suriya@example.com",                                                                                     
    "password": "hashedpassword123"
  }'

*/  
