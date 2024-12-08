const Applicant = require('../models/applicant');
const Company = require("../models/company"); // Assuming Company model is imported

//const Applicant = require("../models/Applicant"); 

// Service to create a new applicant
const createApplicant = async (user_id,fullname,applicantData) => {
  // Create the new applicant document
  const newApplicant = new Applicant({
    ...applicantData,
    createdAt: new Date(),
    userId : user_id,
    name : fullname
  });

  try {
    return await newApplicant.save();
  } catch (error) {
    console.log('Error creating applicant: ' + error.message);
    throw new Error('Error creating applicant: ' + error.message);
  }
};

// Service to get all applicants with populated fields
const getAllApplicants = async () => {
  try {
    const response = await Applicant.find()
      .populate('userId', 'email firstName lastName') // Populate user data
      .populate('appliedJobs', 'title location') // Populate job data
      .populate('followingCompanies', 'name industry'); // Populate company data
    console.log(response);
    return response;
  } catch (error) {
    console.log('Error fetching applicants: ' + error.message);
    throw new Error('Error fetching applicants: ' + error.message);
  }
};

const getApplicantById = async (applicantId) => {
  try {
    return await Applicant.findOne({ _id: applicantId }) // Filter by applicant's ID
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


const getApplicantsForApplicant = async (applicantId) => {
  try {
    // Fetch the applicant's following applicants
    const applicant = await Applicant.findById(applicantId).populate('followingApplicants');
    
    // Fetch all applicants from the database
    const applicants = await Applicant.find().populate('userId');
    console.log('Applicant: ' + applicant);
    console.log('Applicants: ' + applicants);
    // Add `isFollowing` to each applicant based on the followingApplicants list
    const applicantsWithFollowingStatus = applicants.map(app => {
      let isFollowing;
      if(applicant.followingApplicants.length > 0){ 
        isFollowing = applicant.followingApplicants.some(followedApplicant => followedApplicant._id.toString() === app._id.toString());
      }
      return {
        ...app.toObject(),
        isFollowing, // Add isFollowing flag
      };
    });

    return applicantsWithFollowingStatus;
  } catch (error) {
    console.log('Error fetching applicants for applicant: ' + error.message); 
    throw new Error('Error fetching applicants for applicant: ' + error.message);
  }
};



// Service to get companies for a specific applicant
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
  getAllApplicants,
  getApplicantById,
  getCompaniesForApplicant,
  getApplicantsForApplicant,
  followApplicant,
  unfollowApplicant
};
