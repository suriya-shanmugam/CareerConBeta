// /services/recruiterService.js
const Recruiter = require('../models/recruiter');
const { formatResponse } = require('../utils/helper');

class RecruiterService {
  // Create a new recruiter
  async createRecruiter(recruiterData) {
    try {
      //const newRecruiter = new Recruiter(recruiterData);
      
      const newRecruiter = new Recruiter({
        ...recruiterData,
        createdAt: new Date(),
      });
      await newRecruiter.save();
      return formatResponse('success', 'Recruiter created successfully', newRecruiter);
    } catch (error) {
      throw new Error('Error creating recruiter: ' + error.message);
    }
  }

  // Fetch recruiters based on criteria
  async getRecruiters(query) {
    try {
      const recruiters = await Recruiter.find(query).populate('userId companyId');
      return formatResponse('success', 'Recruiters fetched successfully', recruiters);
    } catch (error) {
      throw new Error('Error fetching recruiters: ' + error.message);
    }
  }
}

module.exports = new RecruiterService();
