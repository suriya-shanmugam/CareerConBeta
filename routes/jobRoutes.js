const express = require("express");
const { getJobs, getJobById, updateJobById, createJobs } = require("../controllers/jobController");

const router = express.Router();
router.get("/", getJobs);
router.get('/:id', getJobById);
router.post("/", createJobs);
router.put('/:id', updateJobById);


module.exports = router;
