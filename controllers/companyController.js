const Company = require('../models/company');

// Controller to create a new company
const createCompany = async (req, res) => {
  try {
    const { name, description, industry, location, logo } = req.body;

    // Check if the company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Create a new Company document
    const newCompany = new Company({
      name,
      description,
      industry,
      location,
      logo,
    });

    // Save to the database
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: 'Error creating company', error: error.message });
  }
};

// Controller to fetch all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find(); // Fetch all companies
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
};
