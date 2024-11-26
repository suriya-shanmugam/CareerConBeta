const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

// Define the Job Schema (as per your given schema)
const jobSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    }
  },
  department: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active',
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Job = mongoose.model('Job', jobSchema);

// Utility function to generate random data
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomJob = (companyIds) => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Design'];
  const jobTitles = ['Software Engineer', 'Product Manager', 'Sales Representative', 'Marketing Specialist', 'HR Manager', 'Graphic Designer'];
  const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Sydney', 'Toronto'];
  const currencies = ['USD', 'EUR', 'GBP', 'AUD'];
  const recruiterIds = ['6111b3b876ed0c1d38c98f15', '6111b3b876ed0c1d38c98f16'];  // Example recruiter IDs

  return {
    companyId: getRandomElement(companyIds),
    postedBy: getRandomElement(recruiterIds),
    title: getRandomElement(jobTitles),
    description: 'This is a job description for the ' + getRandomElement(jobTitles) + '.',
    requirements: ['Experience in relevant field', 'Excellent communication skills', 'Bachelor\'s degree'],
    location: getRandomElement(locations),
    salary: {
      min: Math.floor(Math.random() * 30000) + 50000, // Random salary range between 50k and 80k
      max: Math.floor(Math.random() * 30000) + 80000,
      currency: getRandomElement(currencies),
    },
    department: getRandomElement(departments),
    type: getRandomElement(['Full-time', 'Part-time', 'Contract']),
    status: getRandomElement(['Active', 'Closed']),
    applicationsCount: Math.floor(Math.random() * 100),
  };
};

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/careerconDbBeta', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Define companyIds
  const companyIds = [
    new Types.ObjectId('67412362def542ecb4d14f07'),  // Ensure to use `new Types.ObjectId` for proper ObjectId instantiation
    new Types.ObjectId('67418bc7c9c3fd8d1d406a2d')
  ];

  // Generate and insert 20 jobs
  for (let i = 0; i < 20; i++) {
    const randomJob = generateRandomJob(companyIds);
    await Job.create(randomJob);
  }

  console.log('20 random jobs have been added.');
  mongoose.disconnect();
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});
