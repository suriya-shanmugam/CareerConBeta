const express = require("express");
const cors = require('cors');
const connectDB = require("./configs/db");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const companyConvoRoutes = require("./routes/companyConvoRoutes");
const applicantConvoRoutes = require('./routes/applicantConvoRoutes');

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:3001',
};
app.use(cors(corsOptions));

// Sample middleware function for logging and authentication
app.use((req, res, next) => {
  
  console.log(`${req.method} ${req.url}`);
  next();

});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/jobs", jobRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/applicants', applicantRoutes);
app.use('/api/v1/recruiters', recruiterRoutes);

app.use("/api/v1/companies/:id/conversations", companyConvoRoutes);
app.use('/api/v1/applicants/:id/conversations', applicantConvoRoutes);


app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('Something went wrong!');
});


app.listen(PORT, () => {
  console.log(`Connected on port ${PORT}.....`);
});
