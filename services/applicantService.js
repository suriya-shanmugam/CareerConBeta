const Applicant = require('../models/applicant');
const Company = require("../models/company");

// Service to create a new applicant
const createApplicant = async (userId, fullname, applicantData) => {
  // Create the new applicant document with additional fields
  const newApplicant = new Applicant({
    ...applicantData,  // This includes the new fields like professionalExperience, professionalSummary, etc.
    createdAt: new Date(),
    userId: userId,
    name: fullname,
  });

  try {
    return await newApplicant.save();
  } catch (error) {
    throw new Error('Error creating applicant: ' + error.message);
  }
};

// Service to update an applicant's details
const updateApplicant = async (applicantId, applicantData) => {
  try {
    // Find the applicant by ID and update with new data
    const updatedApplicant = await Applicant.findByIdAndUpdate(applicantId, applicantData, {
      new: true, // Return the updated document
    });

    if (!updatedApplicant) {
      throw new Error('Applicant not found');
    }

    return updatedApplicant;
  } catch (error) {
    throw new Error('Error updating applicant: ' + error.message);
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

// Service to get an applicant by ID with populated fields
const getApplicantById = async (applicantId) => {
  try {
    return await Applicant.findById(applicantId)
      .populate('userId', 'email firstName lastName') // Populate user data
      .populate('appliedJobs', 'title location') // Populate job data
      .populate('followingCompanies', 'name industry'); // Populate company data
  } catch (error) {
    throw new Error('Error fetching applicant: ' + error.message);
  }
};

// Follow another applicant
const followApplicant = async (applicantId, targetApplicantId) => {
  try {
    // Ensure the applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      throw new Error('Applicant not found');
    }

    // Ensure the target applicant exists
    const targetApplicant = await Applicant.findById(targetApplicantId);
    if (!targetApplicant) {
      throw new Error('Target applicant not found');
    }

    // Check if the applicant is already following the target applicant
    if (applicant.followingApplicants.includes(targetApplicantId)) {
      throw new Error('You are already following this applicant');
    }

    // Add the target applicant to the applicant's followingApplicants array
    applicant.followingApplicants.push(targetApplicantId);

    // Save the updated applicant
    await applicant.save();

    return { message: 'Applicant followed successfully', applicant };
  } catch (error) {
    throw new Error('Error following applicant: ' + error.message);
  }
};

// Unfollow another applicant
const unfollowApplicant = async (applicantId, targetApplicantId) => {
  try {
    // Ensure the applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      throw new Error('Applicant not found');
    }

    // Ensure the target applicant exists
    const targetApplicant = await Applicant.findById(targetApplicantId);
    if (!targetApplicant) {
      throw new Error('Target applicant not found');
    }

    // Check if the applicant is following the target applicant
    const index = applicant.followingApplicants.indexOf(targetApplicantId);
    if (index === -1) {
      throw new Error('You are not following this applicant');
    }

    // Remove the target applicant from the followingApplicants array
    applicant.followingApplicants.splice(index, 1);

    // Save the updated applicant
    await applicant.save();

    return { message: 'Applicant unfollowed successfully', applicant };
  } catch (error) {
    throw new Error('Error unfollowing applicant: ' + error.message);
  }
};

// Service to get applicants for a specific applicant (following status included)
const getApplicantsForApplicant = async (applicantId) => {
  try {
    // Fetch the applicant's following applicants
    const applicant = await Applicant.findById(applicantId).populate('followingApplicants');
    
    // Fetch all applicants from the database
    const applicants = await Applicant.find().populate('userId', '-passwordHash');

    // Add `isFollowing` to each applicant based on the followingApplicants list
    const applicantsWithFollowingStatus = applicants.map(app => {
      const isFollowing = applicant.followingApplicants.some(followedApplicant => followedApplicant._id.toString() === app._id.toString());
      return {
        ...app.toObject(),
        isFollowing, // Add isFollowing flag
      };
    });

    return applicantsWithFollowingStatus;
  } catch (error) {
    throw new Error('Error fetching applicants for applicant: ' + error.message);
  }
};

// Service to get companies for a specific applicant (following status included)
const getCompaniesForApplicant = async (applicantId) => {
  try {
    // Fetch the applicant's following companies
    const applicant = await Applicant.findById(applicantId).populate('followingCompanies');
    
    // Fetch all companies from the database
    const companies = await Company.find();

    // Add `isFollowing` to each company based on the applicant's followingCompanies
    const companiesWithFollowingStatus = companies.map(company => {
      const isFollowing = applicant.followingCompanies.some(followedCompany => followedCompany._id.toString() === company._id.toString());
      return {
        ...company.toObject(),
        isFollowing, // Add isFollowing flag
      };
    });

    return companiesWithFollowingStatus;
  } catch (error) {
    throw new Error('Error fetching companies for applicant: ' + error.message);
  }
};

module.exports = {
  createApplicant,
  updateApplicant,
  getAllApplicants,
  getApplicantById,
  getCompaniesForApplicant,
  getApplicantsForApplicant,
  followApplicant,
  unfollowApplicant
};
