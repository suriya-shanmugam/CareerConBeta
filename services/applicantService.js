const Applicant = require('../models/applicant');

// Service to create a new applicant
const createApplicant = async (user_id, applicantData) => {
  // Create the new applicant document
  const newApplicant = new Applicant({
    ...applicantData,
    createdAt: new Date(),
    userId : user_id
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



module.exports = {
  createApplicant,
  getAllApplicants,
  followApplicant
};
