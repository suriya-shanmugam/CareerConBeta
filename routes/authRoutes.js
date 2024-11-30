// routes/auth.routes.js
const express = require("express");
const { signIn } = require("../controllers/authController");
const router = express.Router();

// POST: Sign in user
router.post("/signin", signIn);

module.exports = router;
