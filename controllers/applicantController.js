const Applicant = require('../models/applicant');

// Controller to create a new applicant
const createApplicant = async (req, res) => {
  try {
    const { userId, resume, phone, address, skills, appliedJobs, followingCompanies } = req.body;

    // Create a new Applicant document
    const newApplicant = new Applicant({
      userId,
      resume,
      phone,
      address,
      skills,
      appliedJobs,
      followingCompanies,
    });

    // Save to the database
    const savedApplicant = await newApplicant.save();
    res.status(201).json(savedApplicant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating applicant', error: error.message });
  }
};

// Controller to fetch all applicants
const getAllApplicants = async (req, res) => {
  try {
    // Populate `userId`, `appliedJobs`, and `followingCompanies` with referenced data
    const applicants = await Applicant.find()
      .populate('userId', 'email firstName lastName') // Populate User data
      .populate('appliedJobs', 'title location') // Populate Job data
      .populate('followingCompanies', 'name industry'); // Populate Company data

    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error: error.message });
  }
};

module.exports = {
  createApplicant,
  getAllApplicants,
};


/*

curl -X POST http://localhost:3000/api/v1/applicants -H "Content-Type: application/json" -d '{
  "userId": "67411fcec2efaed5e7b4b259",
  "resume": "base64EncodedStringHere",
  "phone": "123-456-7890",
  "address": "123 Main St, City, Country",
  "skills": ["JavaScript", "MongoDB", "Node.js"],
  "appliedJobs": ["6740f9090484489325b72a76"],
  "followingCompanies": ["67412362def542ecb4d14f07"]
}'


curl http://localhost:5000/api/applicants

*/