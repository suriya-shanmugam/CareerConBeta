require('dotenv').config();

const express = require("express");
const cors = require('cors');
const connectDB = require("./configs/db");

const { protect } = require("./middleware/authMiddleware");
const authRoutes = require('./routes/authRoutes'); // Auth routes
const jobRoutes = require("./routes/jobRoutes");
const companyRoutes = require('./routes/companyRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const blogRoutes = require('./routes/blogRoutes');


//const companyConvoRoutes = require("./routes/companyConvoRoutes");
//const applicantConvoRoutes = require('./routes/applicantConvoRoutes');
//const convoRoutes = require('./routes/convoRoutes');
//const recruiterRoutes = require('./routes/recruiterRoutes');
const userRoutes = require('./routes/userRoutes');


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

//app.use('/api/v1/recruiters', recruiterRoutes);

//app.use('/api/v1/conversations', convoRoutes);

app.use('/api/v1/blogs', blogRoutes);

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



