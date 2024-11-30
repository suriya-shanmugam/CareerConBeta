const companyService = require('../services/companyService');
const {formatResponse} = require('../utils/helper')

// Controller to handle creating a new company
const createCompany = async (req, res) => {
  const { name, description, industry, location, logo, website } = req.body;

  try {
    const newCompany = await companyService.createCompany({ name, description, industry, location, logo , website});
    res.status(201).json(newCompany);
  } catch (error) {
    if (error.message === 'Company already exists') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating company', error: error.message });
    }
  }
};

// Controller to handle fetching all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    const response = formatResponse('success', 'Companies fetched successfully', companies)
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};

const followCompany = async (req, res) => {
  const { applicantId } = req.body;
  console.log(applicantId)
  const { companyid } = req.params;
  if (!applicantId || !companyid) {
    return res
      .status(400)
      .json({ message: "Applicant ID and Company ID are required" });
  }

  try {
    const result = await companyService.followCompany(applicantId, companyid);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  followCompany
};


/*
curl -X POST http://your-api-url.com/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Innovators Inc.",
    "description": "A leading company in tech innovation.",
    "industry": "Technology",
    "location": "San Francisco, CA",
    "followers": 1200,
    "createdAt": "2024-11-25T00:00:00Z",
    "website": "https://techinnovators.com"
  }'


  curl -X POST http://localhost:3000/api/v1/companies/674a396e7b81924dd4e177b9/follow   -H "Content-Type: application/json"   -d '{
        "applicantId": "674a3d368f2ad6ef7520f733"
      }'


*/