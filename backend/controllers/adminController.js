const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { default: mongoose } = require("mongoose");

// SignUp ( will never happen )
const signup = async (req, res) => {
  const { name, password, contactInfo } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const admin = new Admin({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      password: hashedPassword,
      contactInfo: contactInfo,
    });
    await admin.save();
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: "email already exists" });
  }

  res.json({ message: "Admin registered!" });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ "contactInfo.email": email });
  if (!admin) {
    return res.status(400).json({ message: "Admin doesn't exist" });
  }

  isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "login successful", token });
};

exports.createWorkspace = async (req, res) => {
  await isAdmin(req, res);
};

module.exports = { login, signup };
