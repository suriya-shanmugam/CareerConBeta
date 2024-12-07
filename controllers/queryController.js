const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

const credConfigService = require('../services/credConfigService');

// Initialize model as null initially
let model = null;

// Set up the Google Generative AI Model
const setupGenerativeAIModel = async () => {
  try {
    // Get the Google API key asynchronously
    const googleApiKey = await credConfigService.getGoogleApi();

    // Log the API key to ensure it's correct
    console.log('Google API Key:', googleApiKey);

    // Initialize the model with the Google API key
    model = new ChatGoogleGenerativeAI({
      model: "gemini-pro",
      maxOutputTokens: 2048,
      apiKey: googleApiKey, // Use the retrieved API key here
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });

    console.log('Generative AI Model setup successfully.');

  } catch (error) {
    console.error('Error setting up Generative AI Model:', error.message);
  }
};

// Controller function to generate a response from the AI model
async function generateResponse(query) {
  if (!model) {
    throw new Error("Model is not initialized yet. Please set it up first.");
  }

  try {
    const response = await model.invoke([
      ["human", query]
    ]);
    return response.content; // Return the AI-generated content
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response");
  }
}

// Controller function to handle the /query endpoint
async function handleQuery(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Make sure the model is initialized before making a query
    if (!model) {
      await setupGenerativeAIModel(); // Initialize model if not done already
    }

    // Generate AI response
    const aiResponse = await generateResponse(query);
    return res.json({ response: aiResponse });

  } catch (error) {
    console.error("Error during query handling:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Export the controller function
module.exports = { handleQuery, setupGenerativeAIModel };
