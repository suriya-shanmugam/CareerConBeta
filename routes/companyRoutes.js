const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');



// Route to create a new company
router.post('/', companyController.createCompany);

// Route to get all companies
router.get('/', companyController.getAllCompanies);

module.exports = router;
