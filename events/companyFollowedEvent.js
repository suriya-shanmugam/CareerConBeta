const COMPANY_FOLLOWED = 'company_followed';

/**
 * Job Posted Event
 * Payload: { jobId, companyId, jobTitle, description }
 */
const companyFollowedEvent = (companyId, userId) => ({
  eventType: COMPANY_FOLLOWED,
  payload: {
    companyId,
    userId
  }
});

// Export the constants and functions
export default {
    companyFollowedEvent
};
