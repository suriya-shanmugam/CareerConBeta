const jobService = require("../services/jobService");
const applicantService = require("../services/applicantService");
const jobRedisService = require("../services/jobRedisService");

const { formatResponse } = require("../utils/helper");
const Applicant = require("../models/applicant");

// Controller to handle getting all jobs
const getJobs = async (req, res) => {
  try {
    const filters = req.query.companyId
      ? { companyId: req.query.companyId }
      : {};
    const jobs = await jobService.getJobs(filters);
    const response = formatResponse(
      "success",
      "Jobs fetched successfully",
      jobs
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to handle getting a job by ID
const getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json(job);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller to handle getting jobs by user with pagination

const getJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cursor, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit, 10);

    // Step 1: Fetch cached jobs from Redis
    let cachedJobs = await jobRedisService.getAllJobs(userId);
    const cursorTimestamp = cursor ? new Date(cursor) : null;

    // Filter cached jobs based on the cursor timestamp
    if (cursorTimestamp) {
      cachedJobs = cachedJobs.filter(
        (job) => new Date(job.createdAt) > cursorTimestamp
      );
    }

    const cachedJobCount = cachedJobs ? cachedJobs.length : 0;

    console.log("Cachedjob count-", cachedJobCount);

    // If Redis contains sufficient jobs, return from Redis
    if (cachedJobs && cachedJobCount >= parsedLimit) {
      const jobsToReturn = cachedJobs.slice(0, parsedLimit);
      const lastJob = jobsToReturn[jobsToReturn.length - 1];
      const newCursor = lastJob ? lastJob.createdAt : null;

      const response = formatResponse("success", "Jobs fetched from cache", {
        jobs: jobsToReturn,
        nextCursor: newCursor,
        hasMore: cachedJobCount > parsedLimit,
      });

      return res.status(200).json(response);
    }

    // Step 2: If Redis does not have sufficient jobs, fetch from MongoDB
    const applicant = await Applicant.findOne({ userId }).select(
      "followingCompanies"
    );
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Calculate the remaining jobs to fetch from the database
    const jobsToFetchFromDb = parsedLimit - cachedJobCount;
    let totalJobsFetched = cachedJobCount;
    let jobs = cachedJobs || [];
    let currentCursor = cursor || "";
    let hasMore = true;

    const companyBatchSize = 50;
    const jobBatchSize = Math.min(jobsToFetchFromDb, 10); // Adjust batch size to remaining jobs needed
    const companyChunks = chunkArray(
      applicant.followingCompanies,
      companyBatchSize
    );

    for (
      let i = 0;
      i < companyChunks.length && hasMore && totalJobsFetched < parsedLimit;
      i++
    ) {
      const companiesBatch = companyChunks[i];
      let batchCursor = currentCursor;

      while (totalJobsFetched < parsedLimit && hasMore) {
        const remainingLimit = parsedLimit - totalJobsFetched; // Dynamically calculate remaining limit
        const result = await jobService.getJobsByCompanies(
          companiesBatch,
          batchCursor,
          Math.min(remainingLimit, jobBatchSize)
        );

        jobs = [...jobs, ...result.jobs];
        totalJobsFetched += result.jobs.length;

        // Update cursor and hasMore flag
        batchCursor = result.nextCursor;
        hasMore = result.hasMore;

        // Stop fetching if we reach the remaining limit
        if (totalJobsFetched >= parsedLimit) break;
      }

      currentCursor = batchCursor;
    }

    // Step 3: Cache newly fetched jobs from MongoDB in Redis
    /*if (jobs.length > cachedJobCount) {
      const newJobs = jobs.slice(cachedJobCount); // Only store the newly fetched jobs
      await jobRedisService.appendJobs(userId, newJobs); // Append new jobs to Redis
    }*/

    //jobRedisService.storeJobs(userId, jobs)

    const response = formatResponse("success", "Jobs fetched successfully", {
      jobs: jobs.slice(0, parsedLimit),
      nextCursor: currentCursor,
      hasMore,
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const analyzejob = async (req, res) => {
  const applicantId = req.query.applicantId;
  const { jobId } = req.params;

  //console.log(applicantId);
  //console.log(jobId);

  const applicant = await applicantService.getApplicantById(applicantId);
  const skills = applicant.skills;
  //console.log(skills);

  const job = await jobService.getJobById(jobId);
  const requirements = job.description;
  //console.log(requirements);


  const query = `
  Generate the hardskill, softskill and my skill based on this info
  <JOB Description> 
  ${requirements} 
  
  </<JOB Description> 
  
  <Myskill>
  "Python, Documentation, OS"
  </Myskill>
  
  
  `
  
  //console.log(query);

  const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

  

  const genAI = new GoogleGenerativeAI("");

  const schema = {
    description: "List of skills with categories and matches",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        HardSkills: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
          description: "List of hard skills (e.g., technical skills, tools)",
          nullable: false,
        },
        SoftSkills: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
          description: "List of soft skills (e.g., communication, leadership)",
          nullable: false,
        },
        MatchedSkills: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
          description: "List of skills that match both hard and soft skills",
          nullable: false,
        },
      },
      required: ["HardSkills", "SoftSkills", "MatchedSkills"],
    },
  };
  
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
  
  const result = await model.generateContent(query);
  console.log(result.response.text());
  const jsonresponse = result.response.text()
  
  const response = formatResponse(
    "success",
    "Skills fetched successfully",
    jsonresponse
  ); 
  res.status(200).json(response);
};

// Helper function to split an array into chunks
function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

// Helper function to split an array into chunks of a given size
function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

// Controller to handle creating a job
const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = await jobService.createJob(jobData);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to handle updating a job
const updateJobById = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedJob = await jobService.updateJobById(
      req.params.id,
      updateData
    );
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  getJobsByUser,
  createJob,
  updateJobById,
  analyzejob,
};

/*

curl -X GET http://localhost:3000/api/v1/jobs -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzRhM2QzNjhmMmFkNmVmNzUyMGY3MzEiLCJyb2xlIjoiQXBwbGljYW50IiwiaWF0IjoxNzMyOTM1NDEzLCJleHAiOjE3MzI5MzkwMTN9.ww41PpHEn6DaXCAP8oXLdEueQH8lZihIFlRYP4Z1lLo"

curl -X GET "http://localhost:3000/api/v1/jobs/6750ed6ab21d8bdb59c1cef6/analyze?applicantId=674fbe5bc400d9b08e229f97"
{"status":"success","message":"skills fetched successfully","data":"[{\"HardSkills\": [\"Technical understanding\", \"Process improvement\", \"Data processing\", \"Reporting research results\", \"Networking knowledge\", \"Operating systems\", \"Reporting skills\", \"Documentation skills\"], \"MatchedSkills\": [\"Operating systems\", \"Documentation skills\"], \"SoftSkills\": [\"Presenting technical information\", \"Written communication\", \"Client relationships\"]}]"}


*/
