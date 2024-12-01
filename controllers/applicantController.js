const applicantService = require("../services/applicantService");

// Controller to handle creating a new applicant
const createApplicant = async (req, res) => {
  const {
    userId,
    resume,
    phone,
    address,
    skills,
    appliedJobs,
    followingCompanies,
  } = req.body;

  try {
    const newApplicant = await applicantService.createApplicant({
      userId,
      resume,
      phone,
      address,
      skills,
      appliedJobs,
      followingCompanies,
    });
    res.status(201).json(newApplicant);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating applicant", error: error.message });
  }
};

// Controller to handle fetching all applicants
const getAllApplicants = async (req, res) => {
  try {
    const applicants = await applicantService.getAllApplicants();
    res.status(200).json(applicants);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching applicants", error: error.message });
  }
};



const followApplicant = async (req, res) => {
  
  const { targetapplicantId } = req.params;
  const { applicantId } = req.params;
  if (!applicantId || !targetapplicantId) {
    return res
      .status(400)
      .json({ message: "Applicant ID and Target Applicant ID are required" });
  }

  try {
    const result = await applicantService.followApplicant(
      applicantId,
      targetapplicantId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to unfollow another applicant
const unfollowApplicant = async (req, res) => {
  const { targetapplicantId } = req.params;
  const { applicantId } = req.params;
  if (!applicantId || !targetapplicantId) {
    return res
      .status(400)
      .json({ message: "Applicant ID and Target Applicant ID are required" });
  }

  try {
    const result = await applicantService.unfollowApplicant(
      applicantId,
      targetapplicantId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller to get applicants for a specific applicant
const getApplicantsForApplicant = async (req, res) => {
  const { applicantId } = req.params;

  try {
    const applicants = await applicantService.getApplicantsForApplicant(applicantId);
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants", error: error.message });
  }
};


// Controller to get companies for a specific applicant
const getCompaniesForApplicant = async (req, res) => {
  const { applicantId } = req.params;

  try {
    const companies = await applicantService.getCompaniesForApplicant(applicantId);
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error: error.message });
  }
};

module.exports = {
  createApplicant,
  getAllApplicants,
  getCompaniesForApplicant,
  getApplicantsForApplicant,
  followApplicant,
  unfollowApplicant
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
