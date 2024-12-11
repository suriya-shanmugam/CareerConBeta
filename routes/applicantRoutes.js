const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController");

const {
  getBlogsFromFollowed
} = require("../controllers/applicantFeedController");

// Route to create a new applicant
router.post("/", applicantController.createApplicant);

// Route to get all applicants
router.get("/", applicantController.getAllApplicants);

// Route to get one applicant
router.get("/:applicantId", applicantController.getApplicant);

// Route to update an existing applicant
router.put("/:applicantId", applicantController.updateApplicant);

// Route to get applicants for a specific applicant (including isFollowing status)
router.get("/:applicantId/allapplicants", applicantController.getApplicantsForApplicant);

// Route to get all companies for a specific applicant (including isFollowing status)
router.get("/:applicantId/companies", applicantController.getCompaniesForApplicant);

// Route to follow an applicant
router.post('/:applicantId/follow/:targetapplicantId', applicantController.followApplicant);

// Route to unfollow an applicant
router.post('/:applicantId/unfollow/:targetapplicantId', applicantController.unfollowApplicant);

// Route to get feed (blogs) based on followed applicants/companies
router.get("/:applicantId/feeds", getBlogsFromFollowed);

/*
// Route to create a new conversation for an applicant
router.post("/:applicantsid/conversations", createConversation);

// Route to get all conversations for an applicant
router.get("/:applicantsid/conversations", getConversations);

// Route to update a specific conversation for an applicant
router.put("/:applicantsid/conversations/:id", updateConversation);

// Route to delete a specific conversation for an applicant
router.delete("/:applicantsid/conversations/:id", deleteConversation);
*/

module.exports = router;
