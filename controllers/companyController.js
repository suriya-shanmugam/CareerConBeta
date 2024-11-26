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

module.exports = {
  createCompany,
  getAllCompanies
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


*/