const COMPANY_CREATED = 'company_created';

/**
 * Job Posted Event
 * Payload: { jobId, companyId, jobTitle, description }
 */
const companyCreatedEvent = (companyId, companyName) => ({
  eventType: COMPANY_CREATED,
  payload: {
    companyId,
    companyName
  }
});

// Export the constants and functions
export default {
  companyCreatedEvent
};
