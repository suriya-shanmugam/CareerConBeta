// /utils/helper.js
const formatResponse = (status, message, data = null) => {
    return {
      status,
      message,
      data,
    };
  };
  
  const isValidObjectId = (id) => {
    // Check if ObjectId is valid
    const ObjectId = require('mongoose').Types.ObjectId;
    return ObjectId.isValid(id);
  };
  
  module.exports = {
    formatResponse,
    isValidObjectId,
  };
  