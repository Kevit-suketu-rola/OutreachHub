const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

// SignUp
const signup = async (req, res) => {
  const { name, password, contactInfo } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      password: hashedPassword,
      contactInfo: contactInfo,
    });
    await user.save();
  } catch (err) {
    console.log(err);

    return res
      .status(400)
      .json({ message: "email already exists", error: err });
  }

  res.json({ message: "User registered!" });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ "contactInfo.email": email });
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }

  isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "login successful", token });
};

module.exports = { login, signup };
