const credConfigService = require('../services/credConfigService');

// Controller for creating a new CredConfig
const createCredConfig = async (req, res) => {
  try {
    const { rabbiturl, rabbitusername, rabbitpassword, googleapi } = req.body;

    const newCredConfig = await credConfigService.createCredConfig({ rabbiturl, rabbitusername, rabbitpassword, googleapi });

    res.status(201).json({
      message: 'Credentials configuration saved successfully.',
      data: newCredConfig
    });
  } catch (error) {
    console.error('Error in createCredConfig controller:', error);
    res.status(500).json({
      message: 'Error saving credentials config.',
      error: error.message
    });
  }
};

// Controller for getting the first CredConfig (only one entry in the DB)
const getCredConfig = async (req, res) => {
  try {
    const config = await credConfigService.getCredConfig();

    res.json(config);
  } catch (error) {
    console.error('Error in getCredConfig controller:', error);
    res.status(500).json({
      message: 'Error retrieving credentials config.',
      error: error.message
    });
  }
};

module.exports = {
  createCredConfig,
  getCredConfig
};
