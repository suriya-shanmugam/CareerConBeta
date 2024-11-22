const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./configs/db");
const jobRoutes = require("./routes/job/jobRoutes");

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/jobs", jobRoutes);


app.listen(PORT, () => {
  console.log(`Connected on port ${PORT}.....`);
});
