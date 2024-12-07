const CredConfig = require('../models/credconfig');

// Service to create a new CredConfig document
const createCredConfig = async (data) => {
  try {
    const { rabbiturl, rabbitusername, rabbitpassword, googleapi } = data;
    
    // Validation (can be extended further)
    if (!rabbiturl || !rabbitusername || !rabbitpassword || !googleapi) {
      throw new Error('All fields are required.');
    }

    const newCredConfig = new CredConfig({ rabbiturl, rabbitusername, rabbitpassword, googleapi });
    await newCredConfig.save();
    return newCredConfig;
  } catch (error) {
    throw new Error(`Error saving credentials config: ${error.message}`);
  }
};

// Service to get the first (and only) CredConfig document
const getCredConfig = async () => {
  try {
    // Fetch the first document from the collection
    const config = await CredConfig.findOne();
    if (!config) {
      throw new Error('Config not found.');
    }
    return config;
  } catch (error) {
    throw new Error(`Error retrieving credentials config: ${error.message}`);
  }
};

module.exports = {
  createCredConfig,
  getCredConfig
};
