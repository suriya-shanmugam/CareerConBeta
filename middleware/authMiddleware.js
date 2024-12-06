const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const protect = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
    //console.log(req)
    if (!token) {
      
      throw Error({ message: "No token, authorization denied" })
      /*return res
        .status(401)
        .json({ message: "No token, authorization denied" });*/
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    //next();
  } catch (error) {
    throw Error({ message: "Invalid token" })
    //return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protect };

// const { auth } = require("express-oauth2-jwt-bearer");
// const dotenv = require("dotenv");

// dotenv.config();

// const protect = auth({
//   issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
//   audience: process.env.AUTH0_AUDIENCE,
// });

// module.exports = {
//   protect,
// };
