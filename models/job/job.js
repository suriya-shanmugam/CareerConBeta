const mongoose = require("mongoose");

// Job Schema definition
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postedBy: {
    type: Number, // Assuming userId is a long/integer
    required: true,
  },
  payScaleStart: {
    type: Number,
    required: true,
  },
  payScaleEnd: {
    type: Number,
    required: true,
  },
  payScaleUnit: {
    type: String,
    enum: ["USD", "EUR", "INR", "GBP", "JPY"], // Example currencies
    required: true,
  },
});

module.exports = mongoose.model("job", jobSchema);
