const applicantService = require("../services/applicantService");
const { formatResponse } = require('../utils/helper');

// Controller to handle creating a new applicant
const createApplicant = async (req, res) => {
  const {
    userId,
    phone,
    address,
    skills,
    appliedJobs,
    followingCompanies,
    professionalExperience,
    professionalSummary,
    education,
    experience,
  } = req.body;

  try {
    const newApplicant = await applicantService.createApplicant({
      userId,
      phone,
      address,
      skills,
      appliedJobs,
      followingCompanies,
      professionalExperience,
      professionalSummary,
      education,
      experience,
    });
    const response = formatResponse('success', 'Applicant created successfully', newApplicant);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error creating applicant", error: error.message });
  }
};

// Controller to handle updating an applicant
const updateApplicant = async (req, res) => {
  const { applicantId } = req.params;
  const {
    resume,
    phone,
    address,
    skills,
    appliedJobs,
    followingCompanies,
    professionalExperience,
    professionalSummary,
    education,
    experience,
  } = req.body;

  try {
    const updatedApplicant = await applicantService.updateApplicant(applicantId, {
      resume,
      phone,
      address,
      skills,
      appliedJobs,
      followingCompanies,
      professionalExperience,
      professionalSummary,
      education,
      experience,
    });
    const response = formatResponse('success', 'Applicant updated successfully', updatedApplicant);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error updating applicant", error: error.message });
  }
};

// Controller to handle fetching all applicants
const getAllApplicants = async (req, res) => {
  try {
    const applicants = await applicantService.getAllApplicants();
    const response = formatResponse('success', 'Applicants fetched successfully', applicants);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants", error: error.message });
  }
};

// Controller to handle fetching an applicant by ID
const getApplicant = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const applicant = await applicantService.getApplicantById(applicantId);
    const response = formatResponse('success', 'Applicant fetched successfully', applicant);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicant", error: error.message });
  }
};

// Controller to follow another applicant
const followApplicant = async (req, res) => {
  const { targetapplicantId, applicantId } = req.params;
  
  if (!applicantId || !targetapplicantId) {
    return res.status(400).json({ message: "Applicant ID and Target Applicant ID are required" });
  }

  try {
    const result = await applicantService.followApplicant(applicantId, targetapplicantId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to unfollow another applicant
const unfollowApplicant = async (req, res) => {
  const { targetapplicantId, applicantId } = req.params;
  
  if (!applicantId || !targetapplicantId) {
    return res.status(400).json({ message: "Applicant ID and Target Applicant ID are required" });
  }

  try {
    const result = await applicantService.unfollowApplicant(applicantId, targetapplicantId);
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
    const response = formatResponse('success', 'Applicants fetched successfully', applicants);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants", error: error.message });
  }
};

// Controller to get companies for a specific applicant
const getCompaniesForApplicant = async (req, res) => {
  const { applicantId } = req.params;

  try {
    const companies = await applicantService.getCompaniesForApplicant(applicantId);
    const response = formatResponse('success', 'Companies fetched successfully', companies);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error: error.message });
  }
};

module.exports = {
  createApplicant,
  updateApplicant,
  getAllApplicants,
  getApplicant,
  getCompaniesForApplicant,
  getApplicantsForApplicant,
  followApplicant,
  unfollowApplicant
};



/*
curl -X PUT http://localhost:5000/api/v1/applicants/67548164672f56594753594c   -H "Content-Type: application/json"   -d '{
    "phone": "987-654-3210",
    "address": "456 New St",
    "skills": ["JavaScript", "Node.js", "React", "GraphQL"],
    "professionalExperience": 6, 
    "professionalSummary": "Senior software developer with extensive experience in full-stack development.",
    "education": [
      {
        "collegeName": "XYZ University",
        "fromYear": 2010,
        "toYear": 2014
      },
      {
        "collegeName": "ABC University",
        "fromYear": 2014,
        "toYear": 2016
      }
    ],
    "experience": [
      {
        "companyName": "ABC Corp",
        "fromYear": 2015,
        "toYear": 2020
      },
      {
        "companyName": "XYZ Ltd",
        "fromYear": 2020,
        "toYear": 2024
      }
    ]
  }'
{"status":"success","message":"Applicant updated successfully","data":{"_id":"67548164672f56594753594c","name":"2willian dec7","userId":"67548164672f56594753594a","skills":["JavaScript","Node.js","React","GraphQL"],"appliedJobs":[],"createdAt":"2024-12-07T17:09:56.993Z","followingCompanies":[],"followingApplicants":[],"education":[{"collegeName":"XYZ University","fromYear":2010,"toYear":2014,"_id":"675482c4a861cb32228b9034"},{"collegeName":"ABC University","fromYear":2014,"toYear":2016,"_id":"675482c4a861cb32228b9035"}],"experience":[{"companyName":"ABC Corp","fromYear":2015,"toYear":2020,"_id":"675482c4a861cb32228b9036"},{"companyName":"XYZ Ltd","fromYear":2020,"toYear":2024,"_id":"675482c4a861cb32228b9037"}],"__v":0,"address":"456 New St","phone":"987-654-3210","professionalExperience":6,"professionalSummary":"Senior software developer with extensive experience in full-stack development."}}

curl -X GET http://localhost:5000/api/v1/applicants/67548164672f56594753594c  
{"status":"success","message":"Applicant fetched successfully","data":{"_id":"67548164672f56594753594c","name":"2willian dec7","userId":{"_id":"67548164672f56594753594a","email":"2dec7willian@example.com","firstName":"2willian","lastName":"dec7"},"skills":["JavaScript","Node.js","React","GraphQL"],"appliedJobs":[],"createdAt":"2024-12-07T17:09:56.993Z","followingCompanies":[],"followingApplicants":[],"education":[{"collegeName":"XYZ University","fromYear":2010,"toYear":2014,"_id":"675482c4a861cb32228b9034"},{"collegeName":"ABC University","fromYear":2014,"toYear":2016,"_id":"675482c4a861cb32228b9035"}],"experience":[{"companyName":"ABC Corp","fromYear":2015,"toYear":2020,"_id":"675482c4a861cb32228b9036"},{"companyName":"XYZ Ltd","fromYear":2020,"toYear":2024,"_id":"675482c4a861cb32228b9037"}],"__v":0,"address":"456 New St","phone":"987-654-3210","professionalExperience":6,"professionalSummary":"Senior software developer with extensive experience in full-stack development."}}



*/