const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

const companyConversationController = require('../controllers/companyConvoController');



// Route to create a new company
router.post('/', companyController.createCompany);

// Route to get all companies
router.get('/', companyController.getAllCompanies);

router.get('/:companyid', companyController.getCompanyById);

router.post('/:companyid/jobs', companyController.createJob);

router.get('/:companyId/jobs', companyController.getCompanyJobs);

// Route to get follow company
router.post('/:companyid/follow', companyController.followCompany);

router.post('/:companyid/unfollow', companyController.unfollowCompany);


// Route to create a new conversation
router.post('/:companyid/conversations/', companyConversationController.createConversation);

// Route to get all conversations for companies
router.get('/:companyid/conversations/', companyConversationController.getConversations);

// Route to update a conversation by ID
router.put('/:companyid/conversations/:id', companyConversationController.updateConversation);

// Route to delete a conversation by ID
router.delete('/:companyid/conversations/:id', companyConversationController.deleteConversation);


module.exports = router;
