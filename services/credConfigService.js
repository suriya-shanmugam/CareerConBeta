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

// Service to get the rabbiturl from the CredConfig document
const getRabbitUrl = async () => {
  try {
    const config = await getCredConfig(); // Fetch the configuration document
    return config.rabbiturl; // Return the rabbiturl field
  } catch (error) {
    throw new Error(`Error retrieving rabbiturl: ${error.message}`);
  }
};

// Service to get the rabbitusername from the CredConfig document
const getRabbitUsername = async () => {
  try {
    const config = await getCredConfig(); // Fetch the configuration document
    return config.rabbitusername; // Return the rabbitusername field
  } catch (error) {
    throw new Error(`Error retrieving rabbitusername: ${error.message}`);
  }
};

// Service to get the rabbitpassword from the CredConfig document
const getRabbitPassword = async () => {
  try {
    const config = await getCredConfig(); // Fetch the configuration document
    return config.rabbitpassword; // Return the rabbitpassword field
  } catch (error) {
    throw new Error(`Error retrieving rabbitpassword: ${error.message}`);
  }
};

// Service to get the googleapi from the CredConfig document
const getGoogleApi = async () => {
  try {
    const config = await getCredConfig(); // Fetch the configuration document
    return config.googleapi; // Return the googleapi field
  } catch (error) {
    throw new Error(`Error retrieving googleapi: ${error.message}`);
  }
};

module.exports = {
  createCredConfig,
  getCredConfig,
  getRabbitUrl,
  getRabbitUsername,
  getRabbitPassword,
  getGoogleApi,
};
