const Applicant = require('../models/applicant');

// Service to create a new applicant
const createApplicant = async (applicantData) => {
  // Create the new applicant document
  const newApplicant = new Applicant({
    ...applicantData,
    createdAt: new Date(),
  });

  try {
    return await newApplicant.save();
  } catch (error) {
    throw new Error('Error creating applicant: ' + error.message);
  }
};

// Service to get all applicants with populated fields
const getAllApplicants = async () => {
  try {
    return await Applicant.find()
      .populate('userId', 'email firstName lastName') // Populate user data
      .populate('appliedJobs', 'title location') // Populate job data
      .populate('followingCompanies', 'name industry'); // Populate company data
  } catch (error) {
    throw new Error('Error fetching applicants: ' + error.message);
  }
};

module.exports = {
  createApplicant,
  getAllApplicants,
};
