require('dotenv').config();

const express = require("express");
const cors = require('cors');
const connectDB = require("./configs/db");

const { protect } = require("./middleware/authMiddleware");

const authRoutes = require('./routes/authRoutes'); // Auth routes

const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
//const companyConvoRoutes = require("./routes/companyConvoRoutes");
//const applicantConvoRoutes = require('./routes/applicantConvoRoutes');

const convoRoutes = require('./routes/convoRoutes');
const { error } = require('winston');

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

console.log(process.env.PORT)


const corsOptions = {
  origin: 'http://localhost:3001',
};
app.use(cors(corsOptions));

// Sample middleware function for logging and authentication
app.use((req, res, next) => {
  

  console.log(`${req.method} ${req.url}`);
  //protect(req, res);
  next();

});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Authentication route
app.use('/api/v1/auth', authRoutes);

app.use("/api/v1/jobs", jobRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/applicants', applicantRoutes);

app.use('/api/v1/recruiters', recruiterRoutes);

app.use('/api/v1/conversations', convoRoutes);


//app.use("/api/v1/companies", companyConvoRoutes);
//app.use('/api/v1/applicants', applicantConvoRoutes);


//app.use('/api/v1/applicants/:id/feeds', applicantConvoRoutes);



app.use((err, req, res, next) => {
  //console.error(err.message)
  console.error(err)
  res.status(500).send('Something went wrong!');
});


app.listen(PORT, () => {
  console.log(`Connected on port ${PORT}.....`);
});



/*

curl -X GET http://localhost:3000/api/v1/jobs -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzRhM2QzNjhmMmFkNmVmNzUyMGY3MzEiLCJyb2xlIjoiQXBwbGljYW50IiwiaWF0IjoxNzMyOTM1NDEzLCJleHAiOjE3MzI5MzkwMTN9.ww41PpHEn6DaXCAP8oXLdEueQH8lZihIFlRYP4Z1lLo"

*/