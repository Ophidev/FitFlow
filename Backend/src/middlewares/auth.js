const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {

  try {
    console.log(req);
    console.log(req.cookies);
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid Token!");
    }

    //validate the token
    const decodeObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found!!!");
    }

    req.user = user; //attaching the user with the req.user

    next(); // now call the route handler.
  } catch (err) {
    res.status(401).send("ERROR inside userAuth middleware: " + err.message);
  }

};

module.exports = userAuth;
