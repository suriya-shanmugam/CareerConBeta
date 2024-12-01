const mongoose = require('mongoose');
const Company = require('../models/company');
const Applicant = require('../models/applicant');
const Job = require('../models/job');
const Recruiter = require('../models/recruiter');
const JobService = require("../services/jobService");

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

// Service to fetch company data by ID
const getCompanyById = async (companyId) => {
  

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      throw new Error('Company not found');
    }

    return company;
  } catch (error) {
    throw new Error('Error fetching company: ' + error.message);
  }
};

// Service to create a job for a company based on companyId
const createJob = async (companyId, jobData) => {
  // Check if the company exists
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Error('Company not found');
  }

  // Validate recruiter ID (postedBy)
  console.log(jobData)
  const recruiter = await Recruiter.findById(jobData.postedBy);
  if (!recruiter) {
    throw new Error('Recruiter not found');
  }

  // Prepare job data
  const newJob = {
    companyId,
    postedBy: jobData.postedBy,
    title: jobData.title,
    description: jobData.description,
    requirements: jobData.requirements || [],
    location: jobData.location,
    salary: jobData.salary,
    department: jobData.department,
    type: jobData.type,
    status: 'Active', // Default status
  };

  try {
    // Use jobService to create the job
    return await JobService.createJob(newJob);
  } catch (error) {
    throw new Error('Error creating job: ' + error.message);
  }
};


// Function to get jobs by companyId, with pagination and better error handling
const getJobsByCompanyId = async (companyId, page = 1, pageSize = 10) => {
  try {
    const jobs = await JobService.getJobsByCompanyId(companyId);
    return jobs;
  } catch (error) {
    throw new Error('Error fetching jobs: ' + error.message);
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


// Unfollow a company
const unfollowCompany = async (applicantId, companyId) => {
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
  
    // Check if the applicant is following the company
    if (!applicant.followingCompanies.includes(companyId)) {
      throw new Error('You are not following this company');
    }
  
    // Remove the company from the applicant's followingCompanies array
    applicant.followingCompanies.pull(companyId);
  
    // Optionally, decrement the company’s followers count
    company.followers -= 1;
  
    // Save the updated applicant and company
    await applicant.save();
    await company.save();
  
    return { message: 'Successfully unfollowed the company', applicant };
  } catch (error) {
    throw new Error('Error unfollowing company: ' + error.message);
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
  createJob,
  getCompanyById,
  getJobsByCompanyId,
  getAllCompanies,
  followCompany,
  unfollowCompany,
  createJob
};
