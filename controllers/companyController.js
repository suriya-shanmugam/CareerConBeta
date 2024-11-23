const companyService = require('../services/companyService');

// Controller to handle creating a new company
const createCompany = async (req, res) => {
  const { name, description, industry, location, logo } = req.body;

  try {
    const newCompany = await companyService.createCompany({ name, description, industry, location, logo });
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
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies
};


/*
curl -X POST http://localhost:3000/api/v1/jobs -H "Content-Type: application/json" -d '{
  "companyId": "67418bc7c9c3fd8d1d406a2d",
  "postedBy": "67412f011f4c0f5067ddbe20",
  "title": "Product manager",
  "description": "Job description here",
  "requirements": ["Node.js", "MongoDB", "Express"],
  "location": "Tenkasi, India",
  "salary": {
    "min": 70000,
    "max": 120000,
    "currency": "INR"
  },
  "department": "Engineering",
  "type": "Full-time",
  "status": "Active"
}'

*/