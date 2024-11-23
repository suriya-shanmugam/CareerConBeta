// /controllers/recruiterController.js
const recruiterService = require("../services/recruiterService");
const logger = require("../configs/logger");

// Controller to handle creating a recruiter
const createRecruiter = async (req, res) => {
  try {
    const recruiterData = req.body;
    const response = await recruiterService.createRecruiter(recruiterData);
    res.status(201).json(response);
  } catch (error) {
    logger.error("Error creating recruiter: " + error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Controller to fetch recruiters
const getRecruiters = async (req, res) => {
  try {
    const query = req.query; // You can add filters if needed
    const response = await recruiterService.getRecruiters(query);
    res.status(200).json(response);
  } catch (error) {
    logger.error("Error fetching recruiters: " + error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createRecruiter,
  getRecruiters,
};
