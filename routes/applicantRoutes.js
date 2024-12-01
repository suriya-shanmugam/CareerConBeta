const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController");

const {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
} = require("../controllers/applicantConvoController");

const {
  getApplicantFeeds
} = require("../controllers/applicantFeedController");

// Route to create a new applicant
router.post("/", applicantController.createApplicant);

// Route to get all applicants
router.get("/", applicantController.getAllApplicants);


// Route to get applicants for a specific applicant (including isFollowing status)
router.get("/:applicantId/allapplicants", applicantController.getApplicantsForApplicant);
// Route to get all jobs details with user info
router.get("/:applicantId/companies", applicantController.getCompaniesForApplicant);

// Route to follow  applicant
router.post('/:applicantId/follow/:targetapplicantId', applicantController.followApplicant);
// Route to unfollow an applicant
router.post('/:applicantId/unfollow/:targetapplicantId', applicantController.unfollowApplicant);

// Route to create a new conversation
router.post("/:applicantsid/conversations", createConversation);

// Route to get all conversations for an applicant
router.get("/:applicantsid/conversations", getConversations);

// Route to get feed conversations for an applicant -following based
router.get("/:applicantsid/feeds", getApplicantFeeds);

// Route to update a specific conversation
router.put("/:applicantsid/conversations/:id", updateConversation);

// Route to delete a specific conversation
router.delete("/:applicantsid/conversations/:id", deleteConversation);

module.exports = router;
