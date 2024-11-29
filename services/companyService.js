const Company = require('../models/company');

// Service to create a new company
const createCompany = async (companyData) => {
  // Check if the company already exists
  
  // Company name is unique
  const existingCompany = await Company.findOne({ name: companyData.name });
  if (existingCompany) {
    throw new Error('Company already exists');
  }

  // Create and save the new company
  const newCompany = new Company({
    ...companyData,
    createdAt: new Date(),
  });

  try {
    return await newCompany.save();
  } catch (error) {
    throw new Error('Error creating company: ' + error.message);
  }
};

// Service to get all companies
const getAllCompanies = async () => {
  try {
    return await Company.find(); // Fetch all companies
  } catch (error) {
    throw new Error('Error fetching companies: ' + error.message);
  }
};

module.exports = {
  createCompany,
  getAllCompanies
};
