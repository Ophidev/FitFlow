const express = require("express");
const { validateSignupData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 + 3600000), // cookie will expires in 8 hours.
    });

    const savedUser = await user.save();

    res.json({ message: "user data successfully saved!", data: savedUser });
    
  } catch (error) {
    res.status(400).send("Error signup : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //checking weather email is present in DB or not
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials!");
    }

    //comparing the password now
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (isPasswordValid) {
      const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 + 3600000),
      });

      res.send(user);
    } else {
      throw new Error("Credential not found!");
    }
  } catch (error) {
    res.status(400).send("ERROR login : " + error.message);
  }
});


authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout successfully!");
});
module.exports = authRouter;
