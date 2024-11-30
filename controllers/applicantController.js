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
  
  const { targetApplicantId } = req.body;
  const { applicantId } = req.params;
  if (!applicantId || !targetApplicantId) {
    return res
      .status(400)
      .json({ message: "Applicant ID and Target Applicant ID are required" });
  }

  try {
    const result = await applicantService.followApplicant(
      applicantId,
      targetApplicantId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApplicant,
  getAllApplicants,
  followApplicant
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
