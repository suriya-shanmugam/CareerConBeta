const express = require("express");
const { getJobs, createJobs } = require("../../controllers/job/jobController");

const router = express.Router();
router.get("/", getJobs);
router.post("/", createJobs);

module.exports = router;
