const Company = require('../models/company');
const Applicant = require('../models/applicant');

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


// Follow a company
const followCompany = async (applicantId, companyId) => {
  try {
    // Ensure the applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      throw new Error('Applicant not found');
    }

    // Ensure the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Check if the applicant is already following the company
    if (applicant.followingCompanies.includes(companyId)) {
      throw new Error('You are already following this company');
    }

    // Add the company to the applicant's followingCompanies array
    applicant.followingCompanies.push(companyId);

    // Optionally, increment the company’s followers count
    company.followers += 1;

    // Save the updated applicant and company
    await applicant.save();
    await company.save();

    return { message: 'Company followed successfully', applicant };
  } catch (error) {
    throw new Error('Error following company: ' + error.message);
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
  getAllCompanies,
  followCompany
};
