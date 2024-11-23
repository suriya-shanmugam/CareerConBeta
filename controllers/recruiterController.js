// controllers/recruiterController.js
const Recruiter = require('../models/recruiter');

// Fetch all recruiters
exports.getAllRecruiters = async (req, res, next) => {
  try {
    const recruiters = await Recruiter.find()
      .populate('userId')    // Populate user details if needed
      .populate('companyId');  // Populate company details if needed
    res.status(200).json(recruiters);
  } catch (error) {
    next(error);  // Forward error to the error handler middleware
  }
};

// Fetch a recruiter by ID
exports.getRecruiterById = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id)
      .populate('userId')
      .populate('companyId');
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    res.status(200).json(recruiter);
  } catch (error) {
    next(error);
  }
};

// Create a new recruiter
exports.createRecruiter = async (req, res, next) => {
  const { userId, companyId } = req.body;

  const recruiter = new Recruiter({
    userId,
    companyId,
    createdAt: new Date(),
  });

  try {
    const newRecruiter = await recruiter.save();
    res.status(201).json(newRecruiter);
  } catch (error) {
    next(error);
  }
};
