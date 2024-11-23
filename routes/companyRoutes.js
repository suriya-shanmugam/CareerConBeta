const express = require('express');
const { createCompany, getAllCompanies } = require('../controllers/companyController');

const router = express.Router();

// Route to create a new company
router.post('/', createCompany);

// Route to fetch all companies
router.get('/', getAllCompanies);

module.exports = router;
