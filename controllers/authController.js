const userService = require("../services/userService");
const Recruiter = require("../models/recruiter"); // Recruiter model
const Applicant = require("../models/applicant"); // Applicant model
const Company = require("../models/company"); // Company model

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in the user and get user details and token
    const { user, token } = await userService.signInUser(email, password);

    // Prepare the basic user info
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

    // Send the response with user data, token, and additional details (if applicable)
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
