const companyService = require('../services/companyService');
const jobService = require("../services/jobService");
//const rabbitMQService = require('../services/rabbitmqService');

const { jobPostedEvent } = require('../events/jobPostedEvent');
const { companyFollowedEvent } = require('../events/companyFollowedEvent');


const {formatResponse} = require('../utils/helper')
const {publishEvent} = require('../utils/rabbitmqService')

// Controller to handle creating a new company
const createCompany = async (req, res) => {
  const { name, description, industry, location, logo, website } = req.body;

  try {
    const newCompany = await companyService.createCompany({ name, description, industry, location, logo , website});
    res.status(201).json(newCompany);
  } catch (error) {
    if (error.message === 'Company already exists') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating company', error: error.message });
    }
  }
};

// Controller to handle creating a job for a company
const createJob = async (req, res) => {
  const companyid = req.params.companyid; // Get the company ID from the URL
  const jobData = req.body; // Get the job data from the request body

  try {
    
    //const newJob = await companyService.createJob(companyid, jobData);
    //console.log(newJob);
    
    
    const newJob = await jobService.createJobToCompany(companyid, jobData);
    console.log(newJob);
    
    
    /*const jobTitle = newJob.title;
    const linkURL =  "https://zoho.com";
    const company = newJob.title;
    await rabbitMQService.publishJob({ company, jobTitle, linkURL});*/

    const response = formatResponse('success', 'job created successfully', newJob)
    const jobEvent = jobPostedEvent(companyid, newJob.title,newJob.jobLink);
    publishEvent(jobEvent);

    res.status(201).json(response);
  } catch (error) {
    if (error.message === 'Company not found' || error.message === 'Recruiter not found') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating job', error: error.message });
    }
  }
};

// Controller to handle fetching all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    const response = formatResponse('success', 'Companies fetched successfully', companies);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};



// Controller to handle fetching a company by ID
const getCompanyById = async (req, res) => {
  const companyId = req.params.companyid; // Get the company ID from the request parameters

  try {
    const company = await companyService.getCompanyById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error: error.message });
  }
};

const followCompany = async (req, res) => {
  const { applicantId } = req.body;
  console.log(applicantId)
  const { companyid } = req.params;
  if (!applicantId || !companyid) {
    return res
      .status(400)
      .json({ message: "Applicant ID and Company ID are required" });
  }

  try {
    const result = await companyService.followCompany(applicantId, companyid);
    const followEvent = companyFollowedEvent(companyid,applicantId );
    publishEvent(followEvent);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyJobs = async (req, res) => {
  const { companyId } = req.params;

  try {
    const jobs = await companyService.getJobsByCompanyId(companyId);
    const response = formatResponse('success', 'Jobs fetched successfully', jobs)
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controller to handle unfollowing a company
const unfollowCompany = async (req, res) => {
  //console.log(req);
  const { applicantId } = req.body;
  const { companyid } = req.params;

  if (!applicantId || !companyid) {
    return res.status(400).json({ message: "Applicant ID and Company ID are required" });
  }

  try {
    const result = await companyService.unfollowCompany(applicantId, companyid);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  createCompany,
  createJob,
  getCompanyById,
  getAllCompanies,
  getCompanyJobs,
  followCompany,
  unfollowCompany
};


/*
curl -X POST http://your-api-url.com/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Innovators Inc.",
    "description": "A leading company in tech innovation.",
    "industry": "Technology",
    "location": "San Francisco, CA",
    "followers": 1200,
    "createdAt": "2024-11-25T00:00:00Z",
    "website": "https://techinnovators.com"
  }'


  curl -X POST http://localhost:3000/api/v1/companies/674a396e7b81924dd4e177b9/follow   -H "Content-Type: application/json"   -d '{
        "applicantId": "674a3d368f2ad6ef7520f733"
      }'


   curl -X POST http://localhost:3000/api/v1/companies/674a9c0fef55673986ccabd2/jobs   -H "Content-Type: application/json"   -d '{
    "postedBy": "674a9c0fef55673986ccabd4",
    "title": "Software Engineer",
    "description": "Develop and maintain web applications.",
    "requirements": ["JavaScript"],
    "location": "New York",
    "salary": {
      "min": 80000,
      "max": 120000,
      "currency": "USD"
    },
    "department": "Engineering",
    "type": "Full-time"
  }'


  curl -X POST http://localhost:3000/api/v1/companies/674fed8225cb88c2581e0a3b/job      -H "Content-Type: application/json"      -d '{
           
           "postedBy": "674fed8225cb88c2581e0a3d",
           "title": "Software Engineer",
           "description": "IT Specialist Skills and Qualifications:

    Technical understanding
    Process improvement
    Data processing
    Reporting research results
    Networking knowledge
    Presenting technical information
    Written communication
    Operating systems
    Reporting skills
    Client relationships
    Documentation skills",
           "requirements": ["JavaScript", "React", "Node.js"],
           "location": "San Francisco",
           "salary": { "min": 100000, "max": 130000, "currency": "USD" },
           "department": "Engineering",
           "type": "Full-time",
           "jobLink": "https://example.com/apply"
         }'
{"status":"success","message":"job created successfully","data":{"companyId":"674fed8225cb88c2581e0a3b","postedBy":"674fed8225cb88c2581e0a3d","title":"Software Engineer","description":"Join our team to build cutting-edge software!","requirements":["JavaScript","React","Node.js"],"location":"San Francisco","salary":{"min":100000,"max":130000,"currency":"USD"},"department":"Engineering","type":"Full-time","status":"Active","applicationsCount":0,"createdAt":"2024-12-04T21:17:56.862Z","updatedAt":"2024-12-04T21:17:56.862Z","_id":"6750c704a0ea61444ed95c19","__v":0}}
   

*/