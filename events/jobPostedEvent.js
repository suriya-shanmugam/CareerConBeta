const JOB_POSTED = 'job_posted';

/**
 * Job Posted Event
 * Payload: { jobId, companyId, jobTitle, description }
 */
const jobPostedEvent = (companyId, jobTitle, jobLink) => ({
  eventType: JOB_POSTED,
  payload: {
    companyId,
    jobTitle,
    jobLink
  }
});

// Export the constants and functions
module.exports = {
  jobPostedEvent
};
